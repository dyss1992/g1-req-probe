/* 用“真实存在的 10p 商品名”替换：Ultra 20TB → helium 年付一折；同时给出 3 个月 75% 备选 */
"use strict";
(function () {
  var VERSION = "g1-x-v2";
  var url = (typeof $request === "object" && $request) ? $request.url : "";
  if (typeof url !== "string" || url.indexOf("one.google.com") < 0) { $done({}); return; }

  var body = (typeof $response === "object" && $response) ? $response.body : undefined;
  if (typeof body !== "string") { $done({}); return; }

  var MAP = [
    ["g1\\.ios\\.20tb\\.m\\.v2", "g1.ios.helium.a.ip_1yr_10p.acq"],
    ["g1\\.ios\\.30tb\\.ai\\.pro\\.m", "g1.ios.helium.a.ip_1yr_10p.acq"],
    ["g1\\.20tb\\.3months_ip_90p\\.acq", "g1.ios.helium.a.ip_1yr_10p.acq"],
    ["g1\\.2tb\\.ai\\.12months_ip_90p", "g1.ios.ai.2tb.a.ip_1yr_10p.acq"]
  ];
  var hits = [], out = body, i;
  for (i = 0; i < MAP.length; i++) {
    out = out.replace(new RegExp(MAP[i][0], "g"), function (m) { hits.push(m + "=>" + MAP[i][1]); return MAP[i][1]; });
  }
  if (hits.length) { console.log("[g1-x] " + VERSION + " hits=" + hits.length + " " + hits[0]); $done({ body: out }); }
  else { $done({}); }
})();
