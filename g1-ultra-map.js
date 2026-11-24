/* 按 NodeLoc 原帖做法：只在 /ai? 响应里把 Ultra 的新版动态 id 换成老版静态 id
   20tb.m.v2      -> 20tb.m      (Ultra 20x)
   30tb.ai.pro.m  -> 30tb.m      (Ultra 30x)
   价格由 App Store 面板决定，页面显示原价是正常的。 */
"use strict";
(function () {
  var VERSION = "g1-ultra-map-v1";
  var url = (typeof $request === "object" && $request) ? $request.url : "";
  if (typeof url !== "string" || !/^https:\/\/one\.google\.com\/ai\?/.test(url)) { $done({}); return; }

  var body = (typeof $response === "object" && $response) ? $response.body : undefined;
  if (typeof body !== "string") { $done({}); return; }

  var MAP = [
    ["20tb\\.m\\.v2", "20tb.m"],
    ["30tb\\.ai\\.pro\\.m", "30tb.m"]
  ];
  var hits = [];
  var out = body;
  for (var i = 0; i < MAP.length; i++) {
    var re = new RegExp(MAP[i][0], "g");
    out = out.replace(re, function (m) { hits.push(m + "->" + MAP[i][1]); return MAP[i][1]; });
  }

  if (hits.length) {
    console.log("[g1-ultra] " + VERSION + " hits=" + hits.length + " " + hits.slice(0, 6).join(" , "));
    $done({ body: out });
  } else {
    $done({});
  }
})();
