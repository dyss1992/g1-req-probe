/* 只改「发起购买」的请求：请求体里出现 Ultra 的 id 就换成 90p 候选，不动方案列表响应 */
"use strict";
(function () {
  var VERSION = "g1-buy-v1";
  var url = (typeof $request === "object" && $request) ? $request.url : "";
  if (typeof url !== "string" || !/^https:\/\/one\.google\.com\//.test(url)) { $done({}); return; }
  var body = (typeof $request === "object" && $request) ? $request.body : null;
  if (typeof body !== "string" || !body) { $done({}); return; }

  var MAP = [
    ["g1\\.ios\\.20tb\\.m\\.v2", "g1.20tb.3months_ip_90p.acq"],
    ["g1\\.20tb\\.v2", "g1.20tb.3months_ip_90p.acq"],
    ["g1\\.play\\.20tb", "g1.20tb.3months_ip_90p.acq"],
    ["g1\\.ios\\.30tb\\.ai\\.pro\\.m", "g1.ai.ultra.3months_ip_90p.acq"],
    ["g1\\.30tb\\.ai\\.pro\\.m", "g1.ai.ultra.3months_ip_90p.acq"],
    ["g1\\.play\\.ai\\.pro", "g1.ai.ultra.3months_ip_90p.acq"]
  ];
  var hits = [], out = body;
  for (var i = 0; i < MAP.length; i++) {
    out = out.replace(new RegExp(MAP[i][0], "g"), function (m) { hits.push(m + "->" + MAP[i][1]); return MAP[i][1]; });
  }
  if (hits.length) {
    console.log("[g1-buy] " + VERSION + " " + url.split("?")[0] + " hits=" + hits.length + " " + hits.slice(0,4).join(" , "));
    $done({ body: out });
  } else { $done({}); }
})();
