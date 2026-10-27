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
function setup(labels = true, apple = false) {
  const handlers = [];
  const window = {};
  const context = { window, document: { addEventListener: (type, fn) => handlers.push(fn) },
    navigator: { userAgent: apple ? "iPhone" : "Android", platform: "", maxTouchPoints: 0 }, Date };
  const script = createTrackingScript({ googleAdsId: "AW-18538035442",
    phoneConversionLabel: labels ? "test-phone" : "", smsConversionLabel: labels ? "test-sms" : "" });
  vm.runInNewContext(script, context);
  vm.runInNewContext(script, context);
  assert.equal(handlers.length, 1, "one handler after duplicate installation");
  assert.equal(window.dataLayer.length, 2, "one js and one config event");
  return { window, click(href, extra = {}) {
    const link = { dataset: {}, getAttribute: () => href, setAttribute: (_, value) => { href = value; } };
    let prevented = false;
    handlers[0]({ button: 0, target: { closest: () => link }, preventDefault: () => { prevented = true; }, ...extra });
    assert.equal(prevented, false, "never block phone/SMS navigation");
    return href;
  } };
}
for (const apple of [false, true]) {
  const env = setup(true, apple);
  env.click("tel:01081584244");
  assert.equal(env.window.dataLayer.at(-1)[2].send_to, "AW-18538035442/test-phone");
  const message = encodeURIComponent("[상품 문의] 10만원 / 2매 & 한글");
  assert.equal(env.click("sms:01081584244?body=" + message), "sms:01081584244" + (apple ? "&" : "?") + "body=" + message);
  assert.equal(env.window.dataLayer.at(-1)[2].send_to, "AW-18538035442/test-sms");
  const count = env.window.dataLayer.length;
  env.click("/contact");
  env.click("tel:01081584244", { ctrlKey: true });
  assert.equal(env.window.dataLayer.length, count);
  env.window.gtag = () => { throw new Error("blocked"); };
  env.click("tel:01081584244");
}
const pending = setup(false);
pending.click("tel:01081584244");
pending.click("sms:01081584244?body=hello");
assert.equal(pending.window.dataLayer.length, 2, "no fabricated conversions without labels");
log("PASS: channels, missing labels, duplicate setup, iOS/Android, custom message, blocked tracking, modifier clicks");
