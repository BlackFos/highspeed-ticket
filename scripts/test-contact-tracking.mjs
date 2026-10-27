import { URL } from "node:url";
import { log } from "node:console";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../app/tracking-script.ts", import.meta.url), "utf8");
const testModule = { exports: {} };
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: testModule.exports });
const { createTrackingScript } = testModule.exports;

// Isolated event loop: no Google requests, calls or SMS are actually sent.
function setup({ labels = true, apple = false, mode = "async" } = {}) {
  const handlers = [], calls = [], navigation = [], processed = [], timers = new Map();
  let clock = 0, nextTimer = 0, frozen = false;
  const schedule = (fn, ms) => { const id = ++nextTimer; timers.set(id, { fn, at: clock + ms }); return id; };
  const window = { location: { assign: href => { navigation.push(href); frozen = true; } },
    setTimeout: schedule, clearTimeout: id => timers.delete(id) };
  const context = { window, document: { addEventListener: (_, fn) => handlers.push(fn) },
    navigator: { userAgent: apple ? "iPhone" : "Android", platform: "", maxTouchPoints: 0 }, Date, WeakSet };
  const script = createTrackingScript({ googleAdsId: "AW-18538035442",
    phoneConversionLabel: labels ? "test-phone" : "", smsConversionLabel: labels ? "test-sms" : "" });
  vm.runInNewContext(script, context); vm.runInNewContext(script, context);
  assert.equal(handlers.length, 1, "one delegated handler");
  assert.equal(window.dataLayer.length, 2, "no conversion on page load");
  window.gtag = (...args) => {
    calls.push(args);
    if (mode === "throw") throw new Error("blocked");
    if (mode === "silent") return;
    const finish = () => { processed.push(args); args[2].event_callback?.(); };
    if (mode === "sync") finish(); else schedule(finish, 80);
  };
  function click(linkOrHref, extra = {}) {
    let href = linkOrHref;
    const link = typeof href === "string" ? { dataset: {},
      getAttribute: name => name === "href" ? href : null,
      setAttribute: (name, value) => { if (name === "href") href = value; } } : linkOrHref;
    const event = { button: 0, cancelable: true, defaultPrevented: false,
      target: { closest: () => link }, preventDefault() { this.defaultPrevented = true; }, ...extra };
    handlers[0](event);
    // Simulate external-app handoff suspending JS before an asynchronous tag can run.
    if (!event.defaultPrevented && /^(tel|sms):/.test(link.getAttribute("href")) &&
        !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0)
      window.location.assign(link.getAttribute("href"));
    return { link, event };
  }
  function tick(ms) {
    const end = clock + ms;
    while (!frozen) {
      const entry = [...timers].filter(([, task]) => task.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!entry) break;
      const [id, task] = entry; timers.delete(id); clock = task.at; task.fn();
    }
    clock = end;
  }
  return { window, calls, navigation, processed, click, tick, resume: () => { frozen = false; } };
}
for (const scheme of ["sms", "tel"]) {
  const env = setup();
  const { event } = env.click(scheme + ":01081584244");
  assert.equal(event.defaultPrevented, true, "defer native handoff until conversion processing callback");
  assert.equal(env.navigation.length, 0);
  env.tick(79); assert.equal(env.navigation.length, 0);
  env.tick(1); assert.equal(env.processed.length, 1, "event processed before simulated suspension");
  assert.deepEqual(env.navigation, [scheme + ":01081584244"]);
  assert.equal(env.calls[0][2].send_to, "AW-18538035442/test-" + (scheme === "sms" ? "sms" : "phone"));
  env.calls[0][2].event_callback(); env.resume(); env.tick(2000);
  assert.equal(env.navigation.length, 1, "callback and fallback must not open twice");
}
for (const apple of [false, true]) {
  const env = setup({ apple });
  const body = encodeURIComponent("[상품 문의] 10만원 / 2매 & 한글");
  const href = "sms:01081584244" + (apple ? "&" : "?") + "body=" + body;
  const { link } = env.click("sms:01081584244?body=" + body);
  assert.equal(link.getAttribute("href"), href);
  env.tick(80); assert.deepEqual(env.navigation, [href]);
  const params = env.calls[0][2];
  assert.deepEqual(Object.keys(params).sort(), ["event_callback", "event_timeout", "send_to", "transport_type"]);
  assert.ok(!JSON.stringify(params).includes(body), "no message body sent to Ads");
}
for (const mode of ["silent", "throw", "sync"]) {
  const env = setup({ mode }); env.click("sms:01081584244?body=hello");
  if (mode === "silent") { env.tick(999); assert.equal(env.navigation.length, 0); env.tick(1); }
  assert.equal(env.navigation.length, 1, "tracking failure must not strand visitor: " + mode);
  env.resume(); env.tick(2000); assert.equal(env.navigation.length, 1);
}
{
  const env = setup({ mode: "silent" });
  const { link } = env.click("sms:01081584244"); env.click(link);
  assert.equal(env.calls.length, 1, "double tap while waiting emits once");
  env.tick(1000); env.calls[0][2].event_callback();
  assert.equal(env.navigation.length, 1, "late callback does not reopen app");
  env.resume(); env.click(link); assert.equal(env.calls.length, 2, "later deliberate click remains possible");
}
{
  const env = setup({ labels: false });
  const { event } = env.click("sms:01081584244");
  assert.equal(event.defaultPrevented, false); assert.equal(env.calls.length, 0); assert.equal(env.navigation.length, 1);
}
{
  const env = setup(); env.click("/contact"); env.click("https://open.kakao.com/o/example");
  for (const key of ["ctrlKey", "metaKey", "shiftKey", "altKey"]) env.click("sms:01081584244", { [key]: true });
  env.click("sms:01081584244", { button: 1 }); env.click("sms:01081584244", { defaultPrevented: true });
  assert.equal(env.calls.length, 0, "ignore unrelated, modified and cancelled clicks");
  env.click("sms:01081584244", { detail: 0 }); assert.equal(env.calls.length, 1, "keyboard activation");
}
log("PASS: async handoff regression, callback/fallback once, blocked loader, errors, double tap, iOS/Android, labels, privacy, keyboard/modifier clicks");
