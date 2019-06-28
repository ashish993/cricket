"use strict";

function setOfCachedUrls(e) {
    return e.keys().then(function (e) {
        return e.map(function (e) {
            return e.url
        })
    }).then(function (e) {
        return new Set(e)
    })
}
var precacheConfig = [
    ["https://ashish993.github.io/cricket/index.html", "https://ashish993.github.io/cricket/6eb57ba8e7f9306f146f260df77e0887"],
    ["https://ashish993.github.io/cricket/service-worker.js", "https://ashish993.github.io/cricket/e17f6fc61f86b8ac9f02e77854ad195d"],
    ["https://ashish993.github.io/cricket/static/css/app.d37afdcf8e24c3249a1dcb94242ce380.css", "https://ashish993.github.io/cricket/d37afdcf8e24c3249a1dcb94242ce380"],
    ["https://ashish993.github.io/cricket/static/js/app.e43b49c3c84a7fc81a3d.js", "https://ashish993.github.io/cricket/8281606b0d575315f6eac50839722212"],
    ["https://ashish993.github.io/cricket/static/js/manifest.9616c67252f02c30b0ba.js", "https://ashish993.github.io/cricket/1255755a8d240f940ec2f16344d0c3f3"],
    ["https://ashish993.github.io/cricket/static/js/vendor.f9c6d5a7cb81ad3bbc97.js", "https://ashish993.github.io/cricket/0b9675474ce039a4eb9fb9d88c5359f0"]
],
    cacheName = "sw-precache-v3-my-vue-app-" + (self.registration ? self.registration.scope : ""),
    ignoreUrlParametersMatching = [/^utm_/],
    addDirectoryIndex = function (e, t) {
        var n = new URL(e);
        return "/" === n.pathname.slice(-1) && (n.pathname += t), n.toString()
    },
    cleanResponse = function (e) {
        return e.redirected ? ("body" in e ? Promise.resolve(e.body) : e.blob()).then(function (t) {
            return new Response(t, {
                headers: e.headers,
                status: e.status,
                statusText: e.statusText
            })
        }) : Promise.resolve(e)
    },
    createCacheKey = function (e, t, n, r) {
        var a = new URL(e);
        return r && a.pathname.match(r) || (a.search += (a.search ? "&" : "") + encodeURIComponent(t) + "=" + encodeURIComponent(n)), a.toString()
    },
    isPathWhitelisted = function (e, t) {
        if (0 === e.length) return !0;
        var n = new URL(t).pathname;
        return e.some(function (e) {
            return n.match(e)
        })
    },
    stripIgnoredUrlParameters = function (e, t) {
        var n = new URL(e);
        return n.hash = "", n.search = n.search.slice(1).split("&").map(function (e) {
            return e.split("=")
        }).filter(function (e) {
            return t.every(function (t) {
                return !t.test(e[0])
            })
        }).map(function (e) {
            return e.join("=")
        }).join("&"), n.toString()
    },
    hashParamName = "_sw-precache",
    urlsToCacheKeys = new Map(precacheConfig.map(function (e) {
        var t = e[0],
            n = e[1],
            r = new URL(t, self.location),
            a = createCacheKey(r, hashParamName, n, !1);
        return [r.toString(), a]
    }));
self.addEventListener("install", function (e) {
    e.waitUntil(caches.open(cacheName).then(function (e) {
        return setOfCachedUrls(e).then(function (t) {
            return Promise.all(Array.from(urlsToCacheKeys.values()).map(function (n) {
                if (!t.has(n)) {
                    var r = new Request(n, {
                        credentials: "same-origin"
                    });
                    return fetch(r).then(function (t) {
                        if (!t.ok) throw new Error("Request for " + n + " returned a response with status " + t.status);
                        return cleanResponse(t).then(function (t) {
                            return e.put(n, t)
                        })
                    })
                }
            }))
        })
    }).then(function () {
        return self.skipWaiting()
    }))
}), self.addEventListener("activate", function (e) {
    var t = new Set(urlsToCacheKeys.values());
    e.waitUntil(caches.open(cacheName).then(function (e) {
        return e.keys().then(function (n) {
            return Promise.all(n.map(function (n) {
                if (!t.has(n.url)) return e.delete(n)
            }))
        })
    }).then(function () {
        return self.clients.claim()
    }))
}), self.addEventListener("fetch", function (e) {
    if ("GET" === e.request.method) {
        var t, n = stripIgnoredUrlParameters(e.request.url, ignoreUrlParametersMatching);
        (t = urlsToCacheKeys.has(n)) || (n = addDirectoryIndex(n, "index.html"), t = urlsToCacheKeys.has(n));
        t && e.respondWith(caches.open(cacheName).then(function (e) {
            return e.match(urlsToCacheKeys.get(n)).then(function (e) {
                if (e) return e;
                throw Error("The cached response that was expected is missing.")
            })
        }).catch(function (t) {
            return console.warn('Couldn\'t serve response for "%s" from cache: %O', e.request.url, t), fetch(e.request)
        }))
    }
});