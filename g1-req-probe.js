/* G1 REQ probe — 改写"请求"而非响应：把 App 选档时发给 Google 的 sku 换成 90p 候选，让服务端做资格校验 */
"use strict";
(function () {
  var VERSION = "g1-req-probe-v1";
  var url = (typeof $request === "object" && $request) ? $request.url : "";
  var SCOPE = /^https:\/\/one\.google\.com\/_\/(?:Subscriptions(?:Management|NonOgb)Ui)\/data\/batchexecute/;

  if (typeof url !== "string" || !SCOPE.test(url)) { $done({}); return; }

  var MAP = {
    "g1.20tb.v2": "g1.20tb.3months_ip_90p.acq",
    "g1.20tb": "g1.20tb.3months_ip_90p.acq",
    "g1.play.20tb": "g1.20tb.3months_ip_90p.acq",
    "g1.ai.pro": "g1.ai.ultra.3months_ip_90p.acq",
    "g1.play.ai.pro": "g1.ai.ultra.3months_ip_90p.acq",
    "g1.2tb.ai": "g1.2tb.ai.12months_ip_90p",
    "g1.play.2tb.ai": "g1.2tb.ai.12months_ip_90p",
    "g1.2tb.ai.subs_variant": "g1.2tb.ai.12months_ip_90p"
  };

  var body = (typeof $request === "object" && $request && typeof $request.body === "string") ? $request.body : null;
  var hits = [];

  if (body) {
    // 请求体常是 URL 编码/JSON 转义，前后可能出现 %22 %5C 之类，无法用简单的字符边界
    body = body.replace(/(g1\.[A-Za-z0-9._-]+)/g, function (match, id, offset, whole) {
      var prev = offset > 0 ? whole.charAt(offset - 1) : "";
      var next = whole.charAt(offset + match.length);
      var prevOk = !/[A-Za-z0-9._-]/.test(prev) || whole.slice(Math.max(0, offset - 3), offset).slice(-3).match(/%[0-9A-Fa-f]{2}$/);
      var nextOk = !/[A-Za-z0-9._-]/.test(next) || /^%[0-9A-Fa-f]{2}/.test(whole.slice(offset + match.length));
      if (!prevOk || !nextOk) return match;
      var to = MAP[whole.substr(offset, match.length)];
      if (!to) return match;
      hits.push(match + "->" + to);
      return to;
    });
  }

  try {
    if (typeof $persistentStore !== "undefined" && $persistentStore.write) {
      if (hits.length) {
        $persistentStore.write(VERSION + " " + new Date().toISOString() + " " + hits.join(" , "), "g1.reqprobe.last");
      }
      $persistentStore.write(String(Date.now()), "g1.reqprobe.at");
    }
  } catch (e) {}

  if (hits.length) {
    console.log("[g1-req] " + VERSION + " hits=" + hits.length + " | " + hits.join(" , "));
    $done({ body: body });
  } else {
    $done({});
  }
})();
