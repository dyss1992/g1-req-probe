/* Ultra 一折：把 Ultra 的新版动态 id 换成 90p 的 ad-hoc offer 候选 id
   20tb.m.v2     -> g1.20tb.3months_ip_90p.acq      (Ultra 20x / 20TB)
   30tb.ai.pro.m -> g1.ai.ultra.3months_ip_90p.acq  (Ultra 30x / 30TB) */
"use strict";
(function () {
  var VERSION = "g1-ultra-90p-v1";
  var url = (typeof $request === "object" && $request) ? $request.url : "";
  if (typeof url !== "string") { $done({}); return; }
  if (!/^https:\/\/one\.google\.com\//.test(url)) { $done({}); return; }
  if (/^https:\/\/one\.google\.com\/g1-sku-report/.test(url)) { $done({}); return; }

  var body = (typeof $response === "object" && $response) ? $response.body : undefined;
  if (typeof body !== "string") { $done({}); return; }

  var MAP = [
    ["20tb\\.m\\.v2", "g1.20tb.3months_ip_90p.acq"],
    ["30tb\\.ai\\.pro\\.m", "g1.ai.ultra.3months_ip_90p.acq"]
  ];
  var hits = [];
  var out = body;
  for (var i = 0; i < MAP.length; i++) {
    out = out.replace(new RegExp(MAP[i][0], "g"), function (m) { hits.push(m + "->" + MAP[i][1]); return MAP[i][1]; });
  }
  if (hits.length) {
    console.log("[g1-90p] " + VERSION + " hits=" + hits.length + " " + hits.slice(0,4).join(" , "));
    $done({ body: out });
  } else { $done({}); }
})();
