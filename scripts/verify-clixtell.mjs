import assert from "node:assert/strict";
import { URL } from "node:url";
import { readFile } from "node:fs/promises";
import { log } from "node:console";
import process from "node:process";
import vm from "node:vm";

// Check the HTML actually served, rather than JSX or serialized React text.
const live = process.argv.includes("--live");
const routes = ["/"];
for (const route of routes) {
let html;
if (live) {
  const response = await globalThis.fetch(new URL(route, "https://고속티켓.com/"), {
    headers: { "Cache-Control": "no-cache" }, signal: globalThis.AbortSignal.timeout(30000),
  });
  assert.equal(response.status, 200);
  html = await response.text();
} else {
  html = await readFile(new URL("../.next/server/app/" + (route === "/" ? "index" : route.slice(1)) + ".html", import.meta.url), "utf8");
}
// Next/React may prepend this empty hidden metadata boundary. Permit only that
// framework marker, never visible content or another application script.
const match = html.match(/<body\b[^>]*>\s*(?:<div hidden="">(?:<!--[\s\S]*?-->)*<\/div>)?\s*<script\b[^>]*id="clixtell-tracking-init"[^>]*>([\s\S]*?)<\/script>\s*<noscript>([\s\S]*?)<\/noscript>/);
assert.ok(match, "Clixtell bootstrap and noscript must precede all application body content");
assert.equal([...html.matchAll(/<script\b[^>]*id="clixtell-tracking-init"/g)].length, 1);
assert.match(match[2], /src="\/\/tracker\.clixtell\.com\/track\/t\.gif"/);
assert.match(match[2], /display:none/);
assert.ok(!html.split("</head>")[0].includes("//tracker.clixtell.com/track/t.gif"),
  "noscript fallback must not be preloaded while JavaScript is enabled");
assert.match(html, /AW-18538035442/);
assert.match(html, /fiqXCJjcg6sdEPLxz4dF/);

// Execute only our extracted bootstrap in an isolated document stub; do not
// download or execute the vendor's code, or simulate customer conversions.
for (const protocol of ["https:", "http:"]) {
  const scripts = [];
  const document = {
    location: { protocol },
    getElementById: id => scripts.find(script => script.id === id),
    createElement: tag => { assert.equal(tag, "script"); return {}; },
    head: { appendChild: script => scripts.push(script) },
  };
  vm.runInNewContext(match[1], { document }, { timeout: 1000 });
  vm.runInNewContext(match[1], { document }, { timeout: 1000 });
  assert.equal(scripts.length, 1, "loader must not be installed twice");
  assert.equal(scripts[0].src, protocol + "//scripts.clixtell.com/track.js");
  assert.equal(scripts[0].async, true);
  assert.equal(scripts[0].type, "text/javascript");
}
log("PASS 고속티켓 " + route + " " + (live ? "production" : "build") + ": body-start placement, noscript, single async Clixtell loader, existing Ads labels");
}
