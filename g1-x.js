/* 扩充作用域：把 20TB/30TB 的 id 替换也覆盖到 batchexecute 响应（仓库规则只覆盖 /ai?） */
"use strict";
(function () {
  var VERSION = "g1-x-v1";
  var url = (typeof $request === "object" && $request) ? $request.url : "";
  if (typeof url !== "string" || !/^https:\/\/one\.google\.com\/_\//.test(url) || url.indexOf("/data/batchexecute") < 0) { $done({}); return; }

  var body = (typeof $response === "object" && $response) ? $response.body : undefined;
  if (typeof body !== "string") { $done({}); return; }

  var MAP = [
    ["g1\\.ios\\.20tb\\.m\\.v2", "g1.20tb.3months_ip_90p.acq"],
    ["g1\\.ios\\.30tb\\.ai\\.pro\\.m", "g1.ai.ultra.3months_ip_90p.acq"],
    ["g1\\.ios\\.2tb\\.a\\.12month_ip_15p", "g1.2tb.ai.12months_ip_90p"],
    ["g1\\.ios\\.2tb\\.m\\.3month_ip_75p", "g1.2tb.ai.12months_ip_90p"]
  ];
  var hits = [], out = body, i;
  for (i = 0; i < MAP.length; i++) {
    out = out.replace(new RegExp(MAP[i][0], "g"), function (m) { hits.push(m); return MAP[i][1]; });
  }
  if (hits.length) {
    console.log("[g1-x] " + VERSION + " hits=" + hits.length + " first=" + hits[0]);
    $done({ body: out });
  } else { $done({}); }
})();
