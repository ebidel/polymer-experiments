/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
// @version 0.7.12
'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

window.WebComponents = window.WebComponents || {}, (function (e) {
  var t = e.flags || {},
      n = "webcomponents-lite.js",
      r = document.querySelector('script[src*="' + n + '"]');if (!t.noOpts) {
    if ((location.search.slice(1).split("&").forEach(function (e) {
      var n,
          r = e.split("=");r[0] && (n = r[0].match(/wc-(.+)/)) && (t[n[1]] = r[1] || !0);
    }), r)) for (var o, i = 0; o = r.attributes[i]; i++) "src" !== o.name && (t[o.name] = o.value || !0);if (t.log) {
      var a = t.log.split(",");t.log = {}, a.forEach(function (e) {
        t.log[e] = !0;
      });
    } else t.log = {};
  }t.shadow = t.shadow || t.shadowdom || t.polyfill, t.shadow = "native" === t.shadow ? !1 : t.shadow || !HTMLElement.prototype.createShadowRoot, t.register && (window.CustomElements = window.CustomElements || { flags: {} }, window.CustomElements.flags.register = t.register), e.flags = t;
})(window.WebComponents), (function (e) {
  "use strict";function t(e) {
    return void 0 !== h[e];
  }function n() {
    s.call(this), this._isInvalid = !0;
  }function r(e) {
    return ("" == e && n.call(this), e.toLowerCase());
  }function o(e) {
    var t = e.charCodeAt(0);return t > 32 && 127 > t && -1 == [34, 35, 60, 62, 63, 96].indexOf(t) ? e : encodeURIComponent(e);
  }function i(e) {
    var t = e.charCodeAt(0);return t > 32 && 127 > t && -1 == [34, 35, 60, 62, 96].indexOf(t) ? e : encodeURIComponent(e);
  }function a(e, a, s) {
    function c(e) {
      g.push(e);
    }var d = a || "scheme start",
        u = 0,
        l = "",
        _ = !1,
        w = !1,
        g = [];e: for (; (e[u - 1] != f || 0 == u) && !this._isInvalid;) {
      var b = e[u];switch (d) {case "scheme start":
          if (!b || !m.test(b)) {
            if (a) {
              c("Invalid scheme.");break e;
            }l = "", d = "no scheme";continue;
          }l += b.toLowerCase(), d = "scheme";break;case "scheme":
          if (b && v.test(b)) l += b.toLowerCase();else {
            if (":" != b) {
              if (a) {
                if (f == b) break e;c("Code point not allowed in scheme: " + b);break e;
              }l = "", u = 0, d = "no scheme";continue;
            }if ((this._scheme = l, l = "", a)) break e;t(this._scheme) && (this._isRelative = !0), d = "file" == this._scheme ? "relative" : this._isRelative && s && s._scheme == this._scheme ? "relative or authority" : this._isRelative ? "authority first slash" : "scheme data";
          }break;case "scheme data":
          "?" == b ? (this._query = "?", d = "query") : "#" == b ? (this._fragment = "#", d = "fragment") : f != b && "	" != b && "\n" != b && "\r" != b && (this._schemeData += o(b));break;case "no scheme":
          if (s && t(s._scheme)) {
            d = "relative";continue;
          }c("Missing scheme."), n.call(this);break;case "relative or authority":
          if ("/" != b || "/" != e[u + 1]) {
            c("Expected /, got: " + b), d = "relative";continue;
          }d = "authority ignore slashes";break;case "relative":
          if ((this._isRelative = !0, "file" != this._scheme && (this._scheme = s._scheme), f == b)) {
            this._host = s._host, this._port = s._port, this._path = s._path.slice(), this._query = s._query, this._username = s._username, this._password = s._password;break e;
          }if ("/" == b || "\\" == b) "\\" == b && c("\\ is an invalid code point."), d = "relative slash";else if ("?" == b) this._host = s._host, this._port = s._port, this._path = s._path.slice(), this._query = "?", this._username = s._username, this._password = s._password, d = "query";else {
            if ("#" != b) {
              var y = e[u + 1],
                  E = e[u + 2];("file" != this._scheme || !m.test(b) || ":" != y && "|" != y || f != E && "/" != E && "\\" != E && "?" != E && "#" != E) && (this._host = s._host, this._port = s._port, this._username = s._username, this._password = s._password, this._path = s._path.slice(), this._path.pop()), d = "relative path";continue;
            }this._host = s._host, this._port = s._port, this._path = s._path.slice(), this._query = s._query, this._fragment = "#", this._username = s._username, this._password = s._password, d = "fragment";
          }break;case "relative slash":
          if ("/" != b && "\\" != b) {
            "file" != this._scheme && (this._host = s._host, this._port = s._port, this._username = s._username, this._password = s._password), d = "relative path";continue;
          }"\\" == b && c("\\ is an invalid code point."), d = "file" == this._scheme ? "file host" : "authority ignore slashes";break;case "authority first slash":
          if ("/" != b) {
            c("Expected '/', got: " + b), d = "authority ignore slashes";continue;
          }d = "authority second slash";break;case "authority second slash":
          if ((d = "authority ignore slashes", "/" != b)) {
            c("Expected '/', got: " + b);continue;
          }break;case "authority ignore slashes":
          if ("/" != b && "\\" != b) {
            d = "authority";continue;
          }c("Expected authority, got: " + b);break;case "authority":
          if ("@" == b) {
            _ && (c("@ already seen."), l += "%40"), _ = !0;for (var L = 0; L < l.length; L++) {
              var M = l[L];if ("	" != M && "\n" != M && "\r" != M) if (":" != M || null !== this._password) {
                var T = o(M);null !== this._password ? this._password += T : this._username += T;
              } else this._password = "";else c("Invalid whitespace in authority.");
            }l = "";
          } else {
            if (f == b || "/" == b || "\\" == b || "?" == b || "#" == b) {
              u -= l.length, l = "", d = "host";continue;
            }l += b;
          }break;case "file host":
          if (f == b || "/" == b || "\\" == b || "?" == b || "#" == b) {
            2 != l.length || !m.test(l[0]) || ":" != l[1] && "|" != l[1] ? 0 == l.length ? d = "relative path start" : (this._host = r.call(this, l), l = "", d = "relative path start") : d = "relative path";continue;
          }"	" == b || "\n" == b || "\r" == b ? c("Invalid whitespace in file host.") : l += b;break;case "host":case "hostname":
          if (":" != b || w) {
            if (f == b || "/" == b || "\\" == b || "?" == b || "#" == b) {
              if ((this._host = r.call(this, l), l = "", d = "relative path start", a)) break e;continue;
            }"	" != b && "\n" != b && "\r" != b ? ("[" == b ? w = !0 : "]" == b && (w = !1), l += b) : c("Invalid code point in host/hostname: " + b);
          } else if ((this._host = r.call(this, l), l = "", d = "port", "hostname" == a)) break e;break;case "port":
          if (/[0-9]/.test(b)) l += b;else {
            if (f == b || "/" == b || "\\" == b || "?" == b || "#" == b || a) {
              if ("" != l) {
                var N = parseInt(l, 10);N != h[this._scheme] && (this._port = N + ""), l = "";
              }if (a) break e;d = "relative path start";continue;
            }"	" == b || "\n" == b || "\r" == b ? c("Invalid code point in port: " + b) : n.call(this);
          }break;case "relative path start":
          if (("\\" == b && c("'\\' not allowed in path."), d = "relative path", "/" != b && "\\" != b)) continue;break;case "relative path":
          if (f != b && "/" != b && "\\" != b && (a || "?" != b && "#" != b)) "	" != b && "\n" != b && "\r" != b && (l += o(b));else {
            "\\" == b && c("\\ not allowed in relative path.");var O;(O = p[l.toLowerCase()]) && (l = O), ".." == l ? (this._path.pop(), "/" != b && "\\" != b && this._path.push("")) : "." == l && "/" != b && "\\" != b ? this._path.push("") : "." != l && ("file" == this._scheme && 0 == this._path.length && 2 == l.length && m.test(l[0]) && "|" == l[1] && (l = l[0] + ":"), this._path.push(l)), l = "", "?" == b ? (this._query = "?", d = "query") : "#" == b && (this._fragment = "#", d = "fragment");
          }break;case "query":
          a || "#" != b ? f != b && "	" != b && "\n" != b && "\r" != b && (this._query += i(b)) : (this._fragment = "#", d = "fragment");break;case "fragment":
          f != b && "	" != b && "\n" != b && "\r" != b && (this._fragment += b);}u++;
    }
  }function s() {
    this._scheme = "", this._schemeData = "", this._username = "", this._password = null, this._host = "", this._port = "", this._path = [], this._query = "", this._fragment = "", this._isInvalid = !1, this._isRelative = !1;
  }function c(e, t) {
    void 0 === t || t instanceof c || (t = new c(String(t))), this._url = e, s.call(this);var n = e.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, "");a.call(this, n, null, t);
  }var d = !1;if (!e.forceJURL) try {
    var u = new URL("b", "http://a");u.pathname = "c%20d", d = "http://a/c%20d" === u.href;
  } catch (l) {}if (!d) {
    var h = Object.create(null);h.ftp = 21, h.file = 0, h.gopher = 70, h.http = 80, h.https = 443, h.ws = 80, h.wss = 443;var p = Object.create(null);p["%2e"] = ".", p[".%2e"] = "..", p["%2e."] = "..", p["%2e%2e"] = "..";var f = void 0,
        m = /[a-zA-Z]/,
        v = /[a-zA-Z0-9\+\-\.]/;c.prototype = Object.defineProperties({ toString: function toString() {
        return this.href;
      } }, {
      href: {
        get: function get() {
          if (this._isInvalid) return this._url;var e = "";return (("" != this._username || null != this._password) && (e = this._username + (null != this._password ? ":" + this._password : "") + "@"), this.protocol + (this._isRelative ? "//" + e + this.host : "") + this.pathname + this._query + this._fragment);
        },
        set: function set(e) {
          s.call(this), a.call(this, e);
        },
        configurable: true,
        enumerable: true
      },
      protocol: {
        get: function get() {
          return this._scheme + ":";
        },
        set: function set(e) {
          this._isInvalid || a.call(this, e + ":", "scheme start");
        },
        configurable: true,
        enumerable: true
      },
      host: {
        get: function get() {
          return this._isInvalid ? "" : this._port ? this._host + ":" + this._port : this._host;
        },
        set: function set(e) {
          !this._isInvalid && this._isRelative && a.call(this, e, "host");
        },
        configurable: true,
        enumerable: true
      },
      hostname: {
        get: function get() {
          return this._host;
        },
        set: function set(e) {
          !this._isInvalid && this._isRelative && a.call(this, e, "hostname");
        },
        configurable: true,
        enumerable: true
      },
      port: {
        get: function get() {
          return this._port;
        },
        set: function set(e) {
          !this._isInvalid && this._isRelative && a.call(this, e, "port");
        },
        configurable: true,
        enumerable: true
      },
      pathname: {
        get: function get() {
          return this._isInvalid ? "" : this._isRelative ? "/" + this._path.join("/") : this._schemeData;
        },
        set: function set(e) {
          !this._isInvalid && this._isRelative && (this._path = [], a.call(this, e, "relative path start"));
        },
        configurable: true,
        enumerable: true
      },
      search: {
        get: function get() {
          return this._isInvalid || !this._query || "?" == this._query ? "" : this._query;
        },
        set: function set(e) {
          !this._isInvalid && this._isRelative && (this._query = "?", "?" == e[0] && (e = e.slice(1)), a.call(this, e, "query"));
        },
        configurable: true,
        enumerable: true
      },
      hash: {
        get: function get() {
          return this._isInvalid || !this._fragment || "#" == this._fragment ? "" : this._fragment;
        },
        set: function set(e) {
          this._isInvalid || (this._fragment = "#", "#" == e[0] && (e = e.slice(1)), a.call(this, e, "fragment"));
        },
        configurable: true,
        enumerable: true
      },
      origin: {
        get: function get() {
          var e;if (this._isInvalid || !this._scheme) return "";switch (this._scheme) {case "data":case "file":case "javascript":case "mailto":
              return "null";}return (e = this.host, e ? this._scheme + "://" + e : "");
        },
        configurable: true,
        enumerable: true
      }
    });var _ = e.URL;_ && (c.createObjectURL = function (e) {
      return _.createObjectURL.apply(_, arguments);
    }, c.revokeObjectURL = function (e) {
      _.revokeObjectURL(e);
    }), e.URL = c;
  }
})(undefined), "undefined" == typeof WeakMap && !(function () {
  var e = Object.defineProperty,
      t = Date.now() % 1e9,
      n = function n() {
    this.name = "__st" + (1e9 * Math.random() >>> 0) + (t++ + "__");
  };n.prototype = { set: function set(t, n) {
      var r = t[this.name];return (r && r[0] === t ? r[1] = n : e(t, this.name, { value: [t, n], writable: !0 }), this);
    }, get: function get(e) {
      var t;return (t = e[this.name]) && t[0] === e ? t[1] : void 0;
    }, "delete": function _delete(e) {
      var t = e[this.name];return t && t[0] === e ? (t[0] = t[1] = void 0, !0) : !1;
    }, has: function has(e) {
      var t = e[this.name];return t ? t[0] === e : !1;
    } }, window.WeakMap = n;
})(), (function (e) {
  function t(e) {
    b.push(e), g || (g = !0, m(r));
  }function n(e) {
    return window.ShadowDOMPolyfill && window.ShadowDOMPolyfill.wrapIfNeeded(e) || e;
  }function r() {
    g = !1;var e = b;b = [], e.sort(function (e, t) {
      return e.uid_ - t.uid_;
    });var t = !1;e.forEach(function (e) {
      var n = e.takeRecords();o(e), n.length && (e.callback_(n, e), t = !0);
    }), t && r();
  }function o(e) {
    e.nodes_.forEach(function (t) {
      var n = v.get(t);n && n.forEach(function (t) {
        t.observer === e && t.removeTransientObservers();
      });
    });
  }function i(e, t) {
    for (var n = e; n; n = n.parentNode) {
      var r = v.get(n);if (r) for (var o = 0; o < r.length; o++) {
        var i = r[o],
            a = i.options;if (n === e || a.subtree) {
          var s = t(a);s && i.enqueue(s);
        }
      }
    }
  }function a(e) {
    this.callback_ = e, this.nodes_ = [], this.records_ = [], this.uid_ = ++y;
  }function s(e, t) {
    this.type = e, this.target = t, this.addedNodes = [], this.removedNodes = [], this.previousSibling = null, this.nextSibling = null, this.attributeName = null, this.attributeNamespace = null, this.oldValue = null;
  }function c(e) {
    var t = new s(e.type, e.target);return (t.addedNodes = e.addedNodes.slice(), t.removedNodes = e.removedNodes.slice(), t.previousSibling = e.previousSibling, t.nextSibling = e.nextSibling, t.attributeName = e.attributeName, t.attributeNamespace = e.attributeNamespace, t.oldValue = e.oldValue, t);
  }function d(e, t) {
    return E = new s(e, t);
  }function u(e) {
    return L ? L : (L = c(E), L.oldValue = e, L);
  }function l() {
    E = L = void 0;
  }function h(e) {
    return e === L || e === E;
  }function p(e, t) {
    return e === t ? e : L && h(e) ? L : null;
  }function f(e, t, n) {
    this.observer = e, this.target = t, this.options = n, this.transientObservedNodes = [];
  }var m,
      v = new WeakMap();if (/Trident|Edge/.test(navigator.userAgent)) m = setTimeout;else if (window.setImmediate) m = window.setImmediate;else {
    var _ = [],
        w = String(Math.random());window.addEventListener("message", function (e) {
      if (e.data === w) {
        var t = _;_ = [], t.forEach(function (e) {
          e();
        });
      }
    }), m = function (e) {
      _.push(e), window.postMessage(w, "*");
    };
  }var g = !1,
      b = [],
      y = 0;a.prototype = { observe: function observe(e, t) {
      if ((e = n(e), !t.childList && !t.attributes && !t.characterData || t.attributeOldValue && !t.attributes || t.attributeFilter && t.attributeFilter.length && !t.attributes || t.characterDataOldValue && !t.characterData)) throw new SyntaxError();var r = v.get(e);r || v.set(e, r = []);for (var o, i = 0; i < r.length; i++) if (r[i].observer === this) {
        o = r[i], o.removeListeners(), o.options = t;break;
      }o || (o = new f(this, e, t), r.push(o), this.nodes_.push(e)), o.addListeners();
    }, disconnect: function disconnect() {
      this.nodes_.forEach(function (e) {
        for (var t = v.get(e), n = 0; n < t.length; n++) {
          var r = t[n];if (r.observer === this) {
            r.removeListeners(), t.splice(n, 1);break;
          }
        }
      }, this), this.records_ = [];
    }, takeRecords: function takeRecords() {
      var e = this.records_;return (this.records_ = [], e);
    } };var E, L;f.prototype = { enqueue: function enqueue(e) {
      var n = this.observer.records_,
          r = n.length;if (n.length > 0) {
        var o = n[r - 1],
            i = p(o, e);if (i) return void (n[r - 1] = i);
      } else t(this.observer);n[r] = e;
    }, addListeners: function addListeners() {
      this.addListeners_(this.target);
    }, addListeners_: function addListeners_(e) {
      var t = this.options;t.attributes && e.addEventListener("DOMAttrModified", this, !0), t.characterData && e.addEventListener("DOMCharacterDataModified", this, !0), t.childList && e.addEventListener("DOMNodeInserted", this, !0), (t.childList || t.subtree) && e.addEventListener("DOMNodeRemoved", this, !0);
    }, removeListeners: function removeListeners() {
      this.removeListeners_(this.target);
    }, removeListeners_: function removeListeners_(e) {
      var t = this.options;t.attributes && e.removeEventListener("DOMAttrModified", this, !0), t.characterData && e.removeEventListener("DOMCharacterDataModified", this, !0), t.childList && e.removeEventListener("DOMNodeInserted", this, !0), (t.childList || t.subtree) && e.removeEventListener("DOMNodeRemoved", this, !0);
    }, addTransientObserver: function addTransientObserver(e) {
      if (e !== this.target) {
        this.addListeners_(e), this.transientObservedNodes.push(e);var t = v.get(e);t || v.set(e, t = []), t.push(this);
      }
    }, removeTransientObservers: function removeTransientObservers() {
      var e = this.transientObservedNodes;this.transientObservedNodes = [], e.forEach(function (e) {
        this.removeListeners_(e);for (var t = v.get(e), n = 0; n < t.length; n++) if (t[n] === this) {
          t.splice(n, 1);break;
        }
      }, this);
    }, handleEvent: function handleEvent(e) {
      switch ((e.stopImmediatePropagation(), e.type)) {case "DOMAttrModified":
          var t = e.attrName,
              n = e.relatedNode.namespaceURI,
              r = e.target,
              o = new d("attributes", r);o.attributeName = t, o.attributeNamespace = n;var a = e.attrChange === MutationEvent.ADDITION ? null : e.prevValue;i(r, function (e) {
            return !e.attributes || e.attributeFilter && e.attributeFilter.length && -1 === e.attributeFilter.indexOf(t) && -1 === e.attributeFilter.indexOf(n) ? void 0 : e.attributeOldValue ? u(a) : o;
          });break;case "DOMCharacterDataModified":
          var r = e.target,
              o = d("characterData", r),
              a = e.prevValue;i(r, function (e) {
            return e.characterData ? e.characterDataOldValue ? u(a) : o : void 0;
          });break;case "DOMNodeRemoved":
          this.addTransientObserver(e.target);case "DOMNodeInserted":
          var s,
              c,
              h = e.target;"DOMNodeInserted" === e.type ? (s = [h], c = []) : (s = [], c = [h]);var p = h.previousSibling,
              f = h.nextSibling,
              o = d("childList", e.target.parentNode);o.addedNodes = s, o.removedNodes = c, o.previousSibling = p, o.nextSibling = f, i(e.relatedNode, function (e) {
            return e.childList ? o : void 0;
          });}l();
    } }, e.JsMutationObserver = a, e.MutationObserver || (e.MutationObserver = a);
})(window), window.HTMLImports = window.HTMLImports || { flags: {} }, (function (e) {
  function t(e, t) {
    t = t || f, r(function () {
      i(e, t);
    }, t);
  }function n(e) {
    return "complete" === e.readyState || e.readyState === _;
  }function r(e, t) {
    if (n(t)) e && e();else {
      var o = function o() {
        ("complete" === t.readyState || t.readyState === _) && (t.removeEventListener(w, o), r(e, t));
      };t.addEventListener(w, o);
    }
  }function o(e) {
    e.target.__loaded = !0;
  }function i(e, t) {
    function n() {
      c == d && e && e({ allImports: s, loadedImports: u, errorImports: l });
    }function r(e) {
      o(e), u.push(this), c++, n();
    }function i(e) {
      l.push(this), c++, n();
    }var s = t.querySelectorAll("link[rel=import]"),
        c = 0,
        d = s.length,
        u = [],
        l = [];if (d) for (var h, p = 0; d > p && (h = s[p]); p++) a(h) ? (c++, n()) : (h.addEventListener("load", r), h.addEventListener("error", i));else n();
  }function a(e) {
    return l ? e.__loaded || e["import"] && "loading" !== e["import"].readyState : e.__importParsed;
  }function s(e) {
    for (var t, n = 0, r = e.length; r > n && (t = e[n]); n++) c(t) && d(t);
  }function c(e) {
    return "link" === e.localName && "import" === e.rel;
  }function d(e) {
    var t = e["import"];t ? o({ target: e }) : (e.addEventListener("load", o), e.addEventListener("error", o));
  }var u = "import",
      l = Boolean(u in document.createElement("link")),
      h = Boolean(window.ShadowDOMPolyfill),
      p = function p(e) {
    return h ? window.ShadowDOMPolyfill.wrapIfNeeded(e) : e;
  },
      f = p(document),
      m = { get: function get() {
      var e = window.HTMLImports.currentScript || document.currentScript || ("complete" !== document.readyState ? document.scripts[document.scripts.length - 1] : null);return p(e);
    }, configurable: !0 };Object.defineProperty(document, "_currentScript", m), Object.defineProperty(f, "_currentScript", m);var v = /Trident/.test(navigator.userAgent),
      _ = v ? "complete" : "interactive",
      w = "readystatechange";l && (new MutationObserver(function (e) {
    for (var t, n = 0, r = e.length; r > n && (t = e[n]); n++) t.addedNodes && s(t.addedNodes);
  }).observe(document.head, { childList: !0 }), (function () {
    if ("loading" === document.readyState) for (var e, t = document.querySelectorAll("link[rel=import]"), n = 0, r = t.length; r > n && (e = t[n]); n++) d(e);
  })()), t(function (e) {
    window.HTMLImports.ready = !0, window.HTMLImports.readyTime = new Date().getTime();var t = f.createEvent("CustomEvent");t.initCustomEvent("HTMLImportsLoaded", !0, !0, e), f.dispatchEvent(t);
  }), e.IMPORT_LINK_TYPE = u, e.useNative = l, e.rootDocument = f, e.whenReady = t, e.isIE = v;
})(window.HTMLImports), (function (e) {
  var t = [],
      n = function n(e) {
    t.push(e);
  },
      r = function r() {
    t.forEach(function (t) {
      t(e);
    });
  };e.addModule = n, e.initializeModules = r;
})(window.HTMLImports), window.HTMLImports.addModule(function (e) {
  var t = /(url\()([^)]*)(\))/g,
      n = /(@import[\s]+(?!url\())([^;]*)(;)/g,
      r = { resolveUrlsInStyle: function resolveUrlsInStyle(e, t) {
      var n = e.ownerDocument,
          r = n.createElement("a");return (e.textContent = this.resolveUrlsInCssText(e.textContent, t, r), e);
    }, resolveUrlsInCssText: function resolveUrlsInCssText(e, r, o) {
      var i = this.replaceUrls(e, o, r, t);return i = this.replaceUrls(i, o, r, n);
    }, replaceUrls: function replaceUrls(e, t, n, r) {
      return e.replace(r, function (e, r, o, i) {
        var a = o.replace(/["']/g, "");return (n && (a = new URL(a, n).href), t.href = a, a = t.href, r + "'" + a + "'" + i);
      });
    } };e.path = r;
}), window.HTMLImports.addModule(function (e) {
  var t = { async: !0, ok: function ok(e) {
      return e.status >= 200 && e.status < 300 || 304 === e.status || 0 === e.status;
    }, load: function load(n, r, o) {
      var i = new XMLHttpRequest();return ((e.flags.debug || e.flags.bust) && (n += "?" + Math.random()), i.open("GET", n, t.async), i.addEventListener("readystatechange", function (e) {
        if (4 === i.readyState) {
          var n = i.getResponseHeader("Location"),
              a = null;if (n) var a = "/" === n.substr(0, 1) ? location.origin + n : n;r.call(o, !t.ok(i) && i, i.response || i.responseText, a);
        }
      }), i.send(), i);
    }, loadDocument: function loadDocument(e, t, n) {
      this.load(e, t, n).responseType = "document";
    } };e.xhr = t;
}), window.HTMLImports.addModule(function (e) {
  var t = e.xhr,
      n = e.flags,
      r = function r(e, t) {
    this.cache = {}, this.onload = e, this.oncomplete = t, this.inflight = 0, this.pending = {};
  };r.prototype = { addNodes: function addNodes(e) {
      this.inflight += e.length;for (var t, n = 0, r = e.length; r > n && (t = e[n]); n++) this.require(t);this.checkDone();
    }, addNode: function addNode(e) {
      this.inflight++, this.require(e), this.checkDone();
    }, require: function require(e) {
      var t = e.src || e.href;e.__nodeUrl = t, this.dedupe(t, e) || this.fetch(t, e);
    }, dedupe: function dedupe(e, t) {
      if (this.pending[e]) return (this.pending[e].push(t), !0);return this.cache[e] ? (this.onload(e, t, this.cache[e]), this.tail(), !0) : (this.pending[e] = [t], !1);
    }, fetch: function fetch(e, r) {
      if ((n.load && console.log("fetch", e, r), e)) if (e.match(/^data:/)) {
        var o = e.split(","),
            i = o[0],
            a = o[1];a = i.indexOf(";base64") > -1 ? atob(a) : decodeURIComponent(a), setTimeout((function () {
          this.receive(e, r, null, a);
        }).bind(this), 0);
      } else {
        var s = (function (t, n, o) {
          this.receive(e, r, t, n, o);
        }).bind(this);t.load(e, s);
      } else setTimeout((function () {
        this.receive(e, r, { error: "href must be specified" }, null);
      }).bind(this), 0);
    }, receive: function receive(e, t, n, r, o) {
      this.cache[e] = r;for (var i, a = this.pending[e], s = 0, c = a.length; c > s && (i = a[s]); s++) this.onload(e, i, r, n, o), this.tail();this.pending[e] = null;
    }, tail: function tail() {
      --this.inflight, this.checkDone();
    }, checkDone: function checkDone() {
      this.inflight || this.oncomplete();
    } }, e.Loader = r;
}), window.HTMLImports.addModule(function (e) {
  var t = function t(e) {
    this.addCallback = e, this.mo = new MutationObserver(this.handler.bind(this));
  };t.prototype = { handler: function handler(e) {
      for (var t, n = 0, r = e.length; r > n && (t = e[n]); n++) "childList" === t.type && t.addedNodes.length && this.addedNodes(t.addedNodes);
    }, addedNodes: function addedNodes(e) {
      this.addCallback && this.addCallback(e);for (var t, n = 0, r = e.length; r > n && (t = e[n]); n++) t.children && t.children.length && this.addedNodes(t.children);
    }, observe: function observe(e) {
      this.mo.observe(e, { childList: !0, subtree: !0 });
    } }, e.Observer = t;
}), window.HTMLImports.addModule(function (e) {
  function t(e) {
    return "link" === e.localName && e.rel === u;
  }function n(e) {
    var t = r(e);return "data:text/javascript;charset=utf-8," + encodeURIComponent(t);
  }function r(e) {
    return e.textContent + o(e);
  }function o(e) {
    var t = e.ownerDocument;t.__importedScripts = t.__importedScripts || 0;var n = e.ownerDocument.baseURI,
        r = t.__importedScripts ? "-" + t.__importedScripts : "";return (t.__importedScripts++, "\n//# sourceURL=" + n + r + ".js\n");
  }function i(e) {
    var t = e.ownerDocument.createElement("style");return (t.textContent = e.textContent, a.resolveUrlsInStyle(t), t);
  }var a = e.path,
      s = e.rootDocument,
      c = e.flags,
      d = e.isIE,
      u = e.IMPORT_LINK_TYPE,
      l = "link[rel=" + u + "]",
      h = { documentSelectors: l, importsSelectors: [l, "link[rel=stylesheet]:not([type])", "style:not([type])", "script:not([type])", 'script[type="application/javascript"]', 'script[type="text/javascript"]'].join(","), map: { link: "parseLink", script: "parseScript", style: "parseStyle" }, dynamicElements: [], parseNext: function parseNext() {
      var e = this.nextToParse();e && this.parse(e);
    }, parse: function parse(e) {
      if (this.isParsed(e)) return void (c.parse && console.log("[%s] is already parsed", e.localName));var t = this[this.map[e.localName]];t && (this.markParsing(e), t.call(this, e));
    }, parseDynamic: function parseDynamic(e, t) {
      this.dynamicElements.push(e), t || this.parseNext();
    }, markParsing: function markParsing(e) {
      c.parse && console.log("parsing", e), this.parsingElement = e;
    }, markParsingComplete: function markParsingComplete(e) {
      e.__importParsed = !0, this.markDynamicParsingComplete(e), e.__importElement && (e.__importElement.__importParsed = !0, this.markDynamicParsingComplete(e.__importElement)), this.parsingElement = null, c.parse && console.log("completed", e);
    }, markDynamicParsingComplete: function markDynamicParsingComplete(e) {
      var t = this.dynamicElements.indexOf(e);t >= 0 && this.dynamicElements.splice(t, 1);
    }, parseImport: function parseImport(e) {
      if ((e["import"] = e.__doc, window.HTMLImports.__importsParsingHook && window.HTMLImports.__importsParsingHook(e), e["import"] && (e["import"].__importParsed = !0), this.markParsingComplete(e), e.dispatchEvent(e.__resource && !e.__error ? new CustomEvent("load", { bubbles: !1 }) : new CustomEvent("error", { bubbles: !1 })), e.__pending)) for (var t; e.__pending.length;) t = e.__pending.shift(), t && t({ target: e });this.parseNext();
    }, parseLink: function parseLink(e) {
      t(e) ? this.parseImport(e) : (e.href = e.href, this.parseGeneric(e));
    }, parseStyle: function parseStyle(e) {
      var t = e;e = i(e), t.__appliedElement = e, e.__importElement = t, this.parseGeneric(e);
    }, parseGeneric: function parseGeneric(e) {
      this.trackElement(e), this.addElementToDocument(e);
    }, rootImportForElement: function rootImportForElement(e) {
      for (var t = e; t.ownerDocument.__importLink;) t = t.ownerDocument.__importLink;return t;
    }, addElementToDocument: function addElementToDocument(e) {
      var t = this.rootImportForElement(e.__importElement || e);t.parentNode.insertBefore(e, t);
    }, trackElement: function trackElement(e, t) {
      var n = this,
          r = function r(o) {
        e.removeEventListener("load", r), e.removeEventListener("error", r), t && t(o), n.markParsingComplete(e), n.parseNext();
      };if ((e.addEventListener("load", r), e.addEventListener("error", r), d && "style" === e.localName)) {
        var o = !1;if (-1 == e.textContent.indexOf("@import")) o = !0;else if (e.sheet) {
          o = !0;for (var i, a = e.sheet.cssRules, s = a ? a.length : 0, c = 0; s > c && (i = a[c]); c++) i.type === CSSRule.IMPORT_RULE && (o = o && Boolean(i.styleSheet));
        }o && setTimeout(function () {
          e.dispatchEvent(new CustomEvent("load", { bubbles: !1 }));
        });
      }
    }, parseScript: function parseScript(t) {
      var r = document.createElement("script");r.__importElement = t, r.src = t.src ? t.src : n(t), e.currentScript = t, this.trackElement(r, function (t) {
        r.parentNode && r.parentNode.removeChild(r), e.currentScript = null;
      }), this.addElementToDocument(r);
    }, nextToParse: function nextToParse() {
      return (this._mayParse = [], !this.parsingElement && (this.nextToParseInDoc(s) || this.nextToParseDynamic()));
    }, nextToParseInDoc: function nextToParseInDoc(e, n) {
      if (e && this._mayParse.indexOf(e) < 0) {
        this._mayParse.push(e);for (var r, o = e.querySelectorAll(this.parseSelectorsForNode(e)), i = 0, a = o.length; a > i && (r = o[i]); i++) if (!this.isParsed(r)) return this.hasResource(r) ? t(r) ? this.nextToParseInDoc(r.__doc, r) : r : void 0;
      }return n;
    }, nextToParseDynamic: function nextToParseDynamic() {
      return this.dynamicElements[0];
    }, parseSelectorsForNode: function parseSelectorsForNode(e) {
      var t = e.ownerDocument || e;return t === s ? this.documentSelectors : this.importsSelectors;
    }, isParsed: function isParsed(e) {
      return e.__importParsed;
    }, needsDynamicParsing: function needsDynamicParsing(e) {
      return this.dynamicElements.indexOf(e) >= 0;
    }, hasResource: function hasResource(e) {
      return t(e) && void 0 === e.__doc ? !1 : !0;
    } };e.parser = h, e.IMPORT_SELECTOR = l;
}), window.HTMLImports.addModule(function (e) {
  function t(e) {
    return n(e, a);
  }function n(e, t) {
    return "link" === e.localName && e.getAttribute("rel") === t;
  }function r(e) {
    return !!Object.getOwnPropertyDescriptor(e, "baseURI");
  }function o(e, t) {
    var n = document.implementation.createHTMLDocument(a);n._URL = t;var o = n.createElement("base");o.setAttribute("href", t), n.baseURI || r(n) || Object.defineProperty(n, "baseURI", { value: t });var i = n.createElement("meta");return (i.setAttribute("charset", "utf-8"), n.head.appendChild(i), n.head.appendChild(o), n.body.innerHTML = e, window.HTMLTemplateElement && HTMLTemplateElement.bootstrap && HTMLTemplateElement.bootstrap(n), n);
  }var i = e.flags,
      a = e.IMPORT_LINK_TYPE,
      s = e.IMPORT_SELECTOR,
      c = e.rootDocument,
      d = e.Loader,
      u = e.Observer,
      l = e.parser,
      h = { documents: {}, documentPreloadSelectors: s, importsPreloadSelectors: [s].join(","), loadNode: function loadNode(e) {
      p.addNode(e);
    }, loadSubtree: function loadSubtree(e) {
      var t = this.marshalNodes(e);p.addNodes(t);
    }, marshalNodes: function marshalNodes(e) {
      return e.querySelectorAll(this.loadSelectorsForNode(e));
    }, loadSelectorsForNode: function loadSelectorsForNode(e) {
      var t = e.ownerDocument || e;return t === c ? this.documentPreloadSelectors : this.importsPreloadSelectors;
    }, loaded: function loaded(e, n, r, a, s) {
      if ((i.load && console.log("loaded", e, n), n.__resource = r, n.__error = a, t(n))) {
        var c = this.documents[e];void 0 === c && (c = a ? null : o(r, s || e), c && (c.__importLink = n, this.bootDocument(c)), this.documents[e] = c), n.__doc = c;
      }l.parseNext();
    }, bootDocument: function bootDocument(e) {
      this.loadSubtree(e), this.observer.observe(e), l.parseNext();
    }, loadedAll: function loadedAll() {
      l.parseNext();
    } },
      p = new d(h.loaded.bind(h), h.loadedAll.bind(h));if ((h.observer = new u(), !document.baseURI)) {
    var f = { get: function get() {
        var e = document.querySelector("base");return e ? e.href : window.location.href;
      }, configurable: !0 };Object.defineProperty(document, "baseURI", f), Object.defineProperty(c, "baseURI", f);
  }e.importer = h, e.importLoader = p;
}), window.HTMLImports.addModule(function (e) {
  var t = e.parser,
      n = e.importer,
      r = { added: function added(e) {
      for (var r, o, i, a, s = 0, c = e.length; c > s && (a = e[s]); s++) r || (r = a.ownerDocument, o = t.isParsed(r)), i = this.shouldLoadNode(a), i && n.loadNode(a), this.shouldParseNode(a) && o && t.parseDynamic(a, i);
    }, shouldLoadNode: function shouldLoadNode(e) {
      return 1 === e.nodeType && o.call(e, n.loadSelectorsForNode(e));
    }, shouldParseNode: function shouldParseNode(e) {
      return 1 === e.nodeType && o.call(e, t.parseSelectorsForNode(e));
    } };n.observer.addCallback = r.added.bind(r);var o = HTMLElement.prototype.matches || HTMLElement.prototype.matchesSelector || HTMLElement.prototype.webkitMatchesSelector || HTMLElement.prototype.mozMatchesSelector || HTMLElement.prototype.msMatchesSelector;
}), (function (e) {
  function t() {
    window.HTMLImports.importer.bootDocument(o);
  }var n = e.initializeModules,
      r = e.isIE;if (!e.useNative) {
    r && "function" != typeof window.CustomEvent && (window.CustomEvent = function (e, t) {
      t = t || {};var n = document.createEvent("CustomEvent");return (n.initCustomEvent(e, Boolean(t.bubbles), Boolean(t.cancelable), t.detail), n.preventDefault = function () {
        Object.defineProperty(this, "defaultPrevented", { get: function get() {
            return !0;
          } });
      }, n);
    }, window.CustomEvent.prototype = window.Event.prototype), n();var o = e.rootDocument;"complete" === document.readyState || "interactive" === document.readyState && !window.attachEvent ? t() : document.addEventListener("DOMContentLoaded", t);
  }
})(window.HTMLImports), window.CustomElements = window.CustomElements || { flags: {} }, (function (e) {
  var t = e.flags,
      n = [],
      r = function r(e) {
    n.push(e);
  },
      o = function o() {
    n.forEach(function (t) {
      t(e);
    });
  };e.addModule = r, e.initializeModules = o, e.hasNative = Boolean(document.registerElement), e.isIE = /Trident/.test(navigator.userAgent), e.useNative = !t.register && e.hasNative && !window.ShadowDOMPolyfill && (!window.HTMLImports || window.HTMLImports.useNative);
})(window.CustomElements), window.CustomElements.addModule(function (e) {
  function t(e, t) {
    n(e, function (e) {
      return t(e) ? !0 : void r(e, t);
    }), r(e, t);
  }function n(e, t, r) {
    var o = e.firstElementChild;if (!o) for (o = e.firstChild; o && o.nodeType !== Node.ELEMENT_NODE;) o = o.nextSibling;for (; o;) t(o, r) !== !0 && n(o, t, r), o = o.nextElementSibling;return null;
  }function r(e, n) {
    for (var r = e.shadowRoot; r;) t(r, n), r = r.olderShadowRoot;
  }function o(e, t) {
    i(e, t, []);
  }function i(e, t, n) {
    if ((e = window.wrap(e), !(n.indexOf(e) >= 0))) {
      n.push(e);for (var r, o = e.querySelectorAll("link[rel=" + a + "]"), s = 0, c = o.length; c > s && (r = o[s]); s++) r["import"] && i(r["import"], t, n);t(e);
    }
  }var a = window.HTMLImports ? window.HTMLImports.IMPORT_LINK_TYPE : "none";e.forDocumentTree = o, e.forSubtree = t;
}), window.CustomElements.addModule(function (e) {
  function t(e, t) {
    return n(e, t) || r(e, t);
  }function n(t, n) {
    return e.upgrade(t, n) ? !0 : void (n && a(t));
  }function r(e, t) {
    g(e, function (e) {
      return n(e, t) ? !0 : void 0;
    });
  }function o(e) {
    L.push(e), E || (E = !0, setTimeout(i));
  }function i() {
    E = !1;for (var e, t = L, n = 0, r = t.length; r > n && (e = t[n]); n++) e();L = [];
  }function a(e) {
    y ? o(function () {
      s(e);
    }) : s(e);
  }function s(e) {
    e.__upgraded__ && !e.__attached && (e.__attached = !0, e.attachedCallback && e.attachedCallback());
  }function c(e) {
    d(e), g(e, function (e) {
      d(e);
    });
  }function d(e) {
    y ? o(function () {
      u(e);
    }) : u(e);
  }function u(e) {
    e.__upgraded__ && e.__attached && (e.__attached = !1, e.detachedCallback && e.detachedCallback());
  }function l(e) {
    for (var t = e, n = window.wrap(document); t;) {
      if (t == n) return !0;t = t.parentNode || t.nodeType === Node.DOCUMENT_FRAGMENT_NODE && t.host;
    }
  }function h(e) {
    if (e.shadowRoot && !e.shadowRoot.__watched) {
      w.dom && console.log("watching shadow-root for: ", e.localName);for (var t = e.shadowRoot; t;) m(t), t = t.olderShadowRoot;
    }
  }function p(e, n) {
    if (w.dom) {
      var r = n[0];if (r && "childList" === r.type && r.addedNodes && r.addedNodes) {
        for (var o = r.addedNodes[0]; o && o !== document && !o.host;) o = o.parentNode;var i = o && (o.URL || o._URL || o.host && o.host.localName) || "";i = i.split("/?").shift().split("/").pop();
      }console.group("mutations (%d) [%s]", n.length, i || "");
    }var a = l(e);n.forEach(function (e) {
      "childList" === e.type && (M(e.addedNodes, function (e) {
        e.localName && t(e, a);
      }), M(e.removedNodes, function (e) {
        e.localName && c(e);
      }));
    }), w.dom && console.groupEnd();
  }function f(e) {
    for (e = window.wrap(e), e || (e = window.wrap(document)); e.parentNode;) e = e.parentNode;var t = e.__observer;t && (p(e, t.takeRecords()), i());
  }function m(e) {
    if (!e.__observer) {
      var t = new MutationObserver(p.bind(this, e));t.observe(e, { childList: !0, subtree: !0 }), e.__observer = t;
    }
  }function v(e) {
    e = window.wrap(e), w.dom && console.group("upgradeDocument: ", e.baseURI.split("/").pop());var n = e === window.wrap(document);t(e, n), m(e), w.dom && console.groupEnd();
  }function _(e) {
    b(e, v);
  }var w = e.flags,
      g = e.forSubtree,
      b = e.forDocumentTree,
      y = !window.MutationObserver || window.MutationObserver === window.JsMutationObserver;e.hasPolyfillMutations = y;var E = !1,
      L = [],
      M = Array.prototype.forEach.call.bind(Array.prototype.forEach),
      T = Element.prototype.createShadowRoot;T && (Element.prototype.createShadowRoot = function () {
    var e = T.call(this);return (window.CustomElements.watchShadow(this), e);
  }), e.watchShadow = h, e.upgradeDocumentTree = _, e.upgradeDocument = v, e.upgradeSubtree = r, e.upgradeAll = t, e.attached = a, e.takeRecords = f;
}), window.CustomElements.addModule(function (e) {
  function t(t, r) {
    if (!t.__upgraded__ && t.nodeType === Node.ELEMENT_NODE) {
      var o = t.getAttribute("is"),
          i = e.getRegisteredDefinition(t.localName) || e.getRegisteredDefinition(o);if (i && (o && i.tag == t.localName || !o && !i["extends"])) return n(t, i, r);
    }
  }function n(t, n, o) {
    return (a.upgrade && console.group("upgrade:", t.localName), n.is && t.setAttribute("is", n.is), r(t, n), t.__upgraded__ = !0, i(t), o && e.attached(t), e.upgradeSubtree(t, o), a.upgrade && console.groupEnd(), t);
  }function r(e, t) {
    Object.__proto__ ? e.__proto__ = t.prototype : (o(e, t.prototype, t["native"]), e.__proto__ = t.prototype);
  }function o(e, t, n) {
    for (var r = {}, o = t; o !== n && o !== HTMLElement.prototype;) {
      for (var i, a = Object.getOwnPropertyNames(o), s = 0; i = a[s]; s++) r[i] || (Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(o, i)), r[i] = 1);o = Object.getPrototypeOf(o);
    }
  }function i(e) {
    e.createdCallback && e.createdCallback();
  }var a = e.flags;e.upgrade = t, e.upgradeWithDefinition = n, e.implementPrototype = r;
}), window.CustomElements.addModule(function (e) {
  function t(t, r) {
    var c = r || {};if (!t) throw new Error("document.registerElement: first argument `name` must not be empty");if (t.indexOf("-") < 0) throw new Error("document.registerElement: first argument ('name') must contain a dash ('-'). Argument provided was '" + String(t) + "'.");if (o(t)) throw new Error("Failed to execute 'registerElement' on 'Document': Registration failed for type '" + String(t) + "'. The type name is invalid.");if (d(t)) throw new Error("DuplicateDefinitionError: a type with name '" + String(t) + "' is already registered");return (c.prototype || (c.prototype = Object.create(HTMLElement.prototype)), c.__name = t.toLowerCase(), c.lifecycle = c.lifecycle || {}, c.ancestry = i(c["extends"]), a(c), s(c), n(c.prototype), u(c.__name, c), c.ctor = l(c), c.ctor.prototype = c.prototype, c.prototype.constructor = c.ctor, e.ready && _(document), c.ctor);
  }function n(e) {
    if (!e.setAttribute._polyfilled) {
      var t = e.setAttribute;e.setAttribute = function (e, n) {
        r.call(this, e, n, t);
      };var n = e.removeAttribute;e.removeAttribute = function (e) {
        r.call(this, e, null, n);
      }, e.setAttribute._polyfilled = !0;
    }
  }function r(e, t, n) {
    e = e.toLowerCase();var r = this.getAttribute(e);n.apply(this, arguments);var o = this.getAttribute(e);this.attributeChangedCallback && o !== r && this.attributeChangedCallback(e, r, o);
  }function o(e) {
    for (var t = 0; t < E.length; t++) if (e === E[t]) return !0;
  }function i(e) {
    var t = d(e);return t ? i(t["extends"]).concat([t]) : [];
  }function a(e) {
    for (var t, n = e["extends"], r = 0; t = e.ancestry[r]; r++) n = t.is && t.tag;e.tag = n || e.__name, n && (e.is = e.__name);
  }function s(e) {
    if (!Object.__proto__) {
      var t = HTMLElement.prototype;if (e.is) {
        var n = document.createElement(e.tag);t = Object.getPrototypeOf(n);
      }for (var r, o = e.prototype, i = !1; o;) o == t && (i = !0), r = Object.getPrototypeOf(o), r && (o.__proto__ = r), o = r;i || console.warn(e.tag + " prototype not found in prototype chain for " + e.is), e["native"] = t;
    }
  }function c(e) {
    return g(T(e.tag), e);
  }function d(e) {
    return e ? L[e.toLowerCase()] : void 0;
  }function u(e, t) {
    L[e] = t;
  }function l(e) {
    return function () {
      return c(e);
    };
  }function h(e, t, n) {
    return e === M ? p(t, n) : N(e, t);
  }function p(e, t) {
    e && (e = e.toLowerCase()), t && (t = t.toLowerCase());var n = d(t || e);if (n) {
      if (e == n.tag && t == n.is) return new n.ctor();if (!t && !n.is) return new n.ctor();
    }var r;return t ? (r = p(e), r.setAttribute("is", t), r) : (r = T(e), e.indexOf("-") >= 0 && b(r, HTMLElement), r);
  }function f(e, t) {
    var n = e[t];e[t] = function () {
      var e = n.apply(this, arguments);return (w(e), e);
    };
  }var m,
      v = e.isIE,
      _ = e.upgradeDocumentTree,
      w = e.upgradeAll,
      g = e.upgradeWithDefinition,
      b = e.implementPrototype,
      y = e.useNative,
      E = ["annotation-xml", "color-profile", "font-face", "font-face-src", "font-face-uri", "font-face-format", "font-face-name", "missing-glyph"],
      L = {},
      M = "http://www.w3.org/1999/xhtml",
      T = document.createElement.bind(document),
      N = document.createElementNS.bind(document);m = Object.__proto__ || y ? function (e, t) {
    return e instanceof t;
  } : function (e, t) {
    if (e instanceof t) return !0;for (var n = e; n;) {
      if (n === t.prototype) return !0;n = n.__proto__;
    }return !1;
  }, f(Node.prototype, "cloneNode"), f(document, "importNode"), v && !(function () {
    var e = document.importNode;document.importNode = function () {
      var t = e.apply(document, arguments);if (t.nodeType == t.DOCUMENT_FRAGMENT_NODE) {
        var n = document.createDocumentFragment();return (n.appendChild(t), n);
      }return t;
    };
  })(), document.registerElement = t, document.createElement = p, document.createElementNS = h, e.registry = L, e["instanceof"] = m, e.reservedTagList = E, e.getRegisteredDefinition = d, document.register = document.registerElement;
}), (function (e) {
  function t() {
    a(window.wrap(document)), window.CustomElements.ready = !0;var e = window.requestAnimationFrame || function (e) {
      setTimeout(e, 16);
    };e(function () {
      setTimeout(function () {
        window.CustomElements.readyTime = Date.now(), window.HTMLImports && (window.CustomElements.elapsed = window.CustomElements.readyTime - window.HTMLImports.readyTime), document.dispatchEvent(new CustomEvent("WebComponentsReady", { bubbles: !0 }));
      });
    });
  }var n = e.useNative,
      r = e.initializeModules,
      o = e.isIE;if (n) {
    var i = function i() {};e.watchShadow = i, e.upgrade = i, e.upgradeAll = i, e.upgradeDocumentTree = i, e.upgradeSubtree = i, e.takeRecords = i, e["instanceof"] = function (e, t) {
      return e instanceof t;
    };
  } else r();var a = e.upgradeDocumentTree,
      s = e.upgradeDocument;if ((window.wrap || (window.ShadowDOMPolyfill ? (window.wrap = window.ShadowDOMPolyfill.wrapIfNeeded, window.unwrap = window.ShadowDOMPolyfill.unwrapIfNeeded) : window.wrap = window.unwrap = function (e) {
    return e;
  }), window.HTMLImports && (window.HTMLImports.__importsParsingHook = function (e) {
    e["import"] && s(wrap(e["import"]));
  }), o && "function" != typeof window.CustomEvent && (window.CustomEvent = function (e, t) {
    t = t || {};var n = document.createEvent("CustomEvent");return (n.initCustomEvent(e, Boolean(t.bubbles), Boolean(t.cancelable), t.detail), n.preventDefault = function () {
      Object.defineProperty(this, "defaultPrevented", { get: function get() {
          return !0;
        } });
    }, n);
  }, window.CustomEvent.prototype = window.Event.prototype), "complete" === document.readyState || e.flags.eager)) t();else if ("interactive" !== document.readyState || window.attachEvent || window.HTMLImports && !window.HTMLImports.ready) {
    var c = window.HTMLImports && !window.HTMLImports.ready ? "HTMLImportsLoaded" : "DOMContentLoaded";window.addEventListener(c, t);
  } else t();
})(window.CustomElements), "undefined" == typeof HTMLTemplateElement && !(function () {
  function e(e) {
    switch (e) {case "&":
        return "&amp;";case "<":
        return "&lt;";case ">":
        return "&gt;";case " ":
        return "&nbsp;";}
  }function t(t) {
    return t.replace(a, e);
  }var n = "template",
      r = document.implementation.createHTMLDocument("template"),
      o = !0;HTMLTemplateElement = function () {}, HTMLTemplateElement.prototype = Object.create(HTMLElement.prototype), HTMLTemplateElement.decorate = function (e) {
    e.content || (e.content = r.createDocumentFragment());for (var n; n = e.firstChild;) e.content.appendChild(n);if (o) try {
      Object.defineProperty(e, "innerHTML", { get: function get() {
          for (var e = "", n = this.content.firstChild; n; n = n.nextSibling) e += n.outerHTML || t(n.data);return e;
        }, set: function set(e) {
          for (r.body.innerHTML = e, HTMLTemplateElement.bootstrap(r); this.content.firstChild;) this.content.removeChild(this.content.firstChild);for (; r.body.firstChild;) this.content.appendChild(r.body.firstChild);
        }, configurable: !0 });
    } catch (i) {
      o = !1;
    }
  }, HTMLTemplateElement.bootstrap = function (e) {
    for (var t, r = e.querySelectorAll(n), o = 0, i = r.length; i > o && (t = r[o]); o++) HTMLTemplateElement.decorate(t);
  }, window.addEventListener("DOMContentLoaded", function () {
    HTMLTemplateElement.bootstrap(document);
  });var i = document.createElement;document.createElement = function () {
    "use strict";var e = i.apply(document, arguments);return ("template" == e.localName && HTMLTemplateElement.decorate(e), e);
  };var a = /[&\u00A0<>]/g;
})(), (function (e) {
  var t = document.createElement("style");t.textContent = "body {transition: opacity ease-in 0.2s; } \nbody[unresolved] {opacity: 0; display: block; overflow: hidden; position: relative; } \n";var n = document.querySelector("head");n.insertBefore(t, n.firstChild);
})(window.WebComponents);
(function () {
  function resolve() {
    document.body.removeAttribute('unresolved');
  }
  if (window.WebComponents) {
    addEventListener('WebComponentsReady', resolve);
  } else {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      resolve();
    } else {
      addEventListener('DOMContentLoaded', resolve);
    }
  }
})();
window.Polymer = {
  Settings: (function () {
    var user = window.Polymer || {};
    location.search.slice(1).split('&').forEach(function (o) {
      o = o.split('=');
      o[0] && (user[o[0]] = o[1] || true);
    });
    var wantShadow = user.dom === 'shadow';
    var hasShadow = Boolean(Element.prototype.createShadowRoot);
    var nativeShadow = hasShadow && !window.ShadowDOMPolyfill;
    var useShadow = wantShadow && hasShadow;
    var hasNativeImports = Boolean('import' in document.createElement('link'));
    var useNativeImports = hasNativeImports;
    var useNativeCustomElements = !window.CustomElements || window.CustomElements.useNative;
    return {
      wantShadow: wantShadow,
      hasShadow: hasShadow,
      nativeShadow: nativeShadow,
      useShadow: useShadow,
      useNativeShadow: useShadow && nativeShadow,
      useNativeImports: useNativeImports,
      useNativeCustomElements: useNativeCustomElements
    };
  })()
};
(function () {
  var userPolymer = window.Polymer;
  window.Polymer = function (prototype) {
    if (typeof prototype === 'function') {
      prototype = prototype.prototype;
    }
    if (!prototype) {
      prototype = {};
    }
    var factory = desugar(prototype);
    prototype = factory.prototype;
    var options = {
      prototype: prototype,
      'extends': prototype['extends']
    };
    Polymer.telemetry._registrate(prototype);
    document.registerElement(prototype.is, options);
    return factory;
  };
  var desugar = function desugar(prototype) {
    var base = Polymer.Base;
    if (prototype['extends']) {
      base = Polymer.Base._getExtendedPrototype(prototype['extends']);
    }
    prototype = Polymer.Base.chainObject(prototype, base);
    prototype.registerCallback();
    return prototype.constructor;
  };
  window.Polymer = Polymer;
  if (userPolymer) {
    for (var i in userPolymer) {
      Polymer[i] = userPolymer[i];
    }
  }
  Polymer.Class = desugar;
})();
Polymer.telemetry = {
  registrations: [],
  _regLog: function _regLog(prototype) {
    console.log('[' + prototype.is + ']: registered');
  },
  _registrate: function _registrate(prototype) {
    this.registrations.push(prototype);
    Polymer.log && this._regLog(prototype);
  },
  dumpRegistrations: function dumpRegistrations() {
    this.registrations.forEach(this._regLog);
  }
};
Object.defineProperty(window, 'currentImport', {
  enumerable: true,
  configurable: true,
  get: function get() {
    return (document._currentScript || document.currentScript).ownerDocument;
  }
});
Polymer.RenderStatus = {
  _ready: false,
  _callbacks: [],
  whenReady: function whenReady(cb) {
    if (this._ready) {
      cb();
    } else {
      this._callbacks.push(cb);
    }
  },
  _makeReady: function _makeReady() {
    this._ready = true;
    this._callbacks.forEach(function (cb) {
      cb();
    });
    this._callbacks = [];
  },
  _catchFirstRender: function _catchFirstRender() {
    requestAnimationFrame(function () {
      Polymer.RenderStatus._makeReady();
    });
  }
};
if (window.HTMLImports) {
  HTMLImports.whenReady(function () {
    Polymer.RenderStatus._catchFirstRender();
  });
} else {
  Polymer.RenderStatus._catchFirstRender();
}
Polymer.ImportStatus = Polymer.RenderStatus;
Polymer.ImportStatus.whenLoaded = Polymer.ImportStatus.whenReady;
Polymer.Base = {
  __isPolymerInstance__: true,
  _addFeature: function _addFeature(feature) {
    this.extend(this, feature);
  },
  registerCallback: function registerCallback() {
    this._desugarBehaviors();
    this._doBehavior('beforeRegister');
    this._registerFeatures();
    this._doBehavior('registered');
  },
  createdCallback: function createdCallback() {
    Polymer.telemetry.instanceCount++;
    this.root = this;
    this._doBehavior('created');
    this._initFeatures();
  },
  attachedCallback: function attachedCallback() {
    Polymer.RenderStatus.whenReady((function () {
      this.isAttached = true;
      this._doBehavior('attached');
    }).bind(this));
  },
  detachedCallback: function detachedCallback() {
    this.isAttached = false;
    this._doBehavior('detached');
  },
  attributeChangedCallback: function attributeChangedCallback(name) {
    this._attributeChangedImpl(name);
    this._doBehavior('attributeChanged', arguments);
  },
  _attributeChangedImpl: function _attributeChangedImpl(name) {
    this._setAttributeToProperty(this, name);
  },
  extend: function extend(prototype, api) {
    if (prototype && api) {
      Object.getOwnPropertyNames(api).forEach(function (n) {
        this.copyOwnProperty(n, api, prototype);
      }, this);
    }
    return prototype || api;
  },
  mixin: function mixin(target, source) {
    for (var i in source) {
      target[i] = source[i];
    }
    return target;
  },
  copyOwnProperty: function copyOwnProperty(name, source, target) {
    var pd = Object.getOwnPropertyDescriptor(source, name);
    if (pd) {
      Object.defineProperty(target, name, pd);
    }
  },
  _log: console.log.apply.bind(console.log, console),
  _warn: console.warn.apply.bind(console.warn, console),
  _error: console.error.apply.bind(console.error, console),
  _logf: function _logf() {
    return this._logPrefix.concat([this.is]).concat(Array.prototype.slice.call(arguments, 0));
  }
};
Polymer.Base._logPrefix = (function () {
  var color = window.chrome || /firefox/i.test(navigator.userAgent);
  return color ? ['%c[%s::%s]:', 'font-weight: bold; background-color:#EEEE00;'] : ['[%s::%s]:'];
})();
Polymer.Base.chainObject = function (object, inherited) {
  if (object && inherited && object !== inherited) {
    if (!Object.__proto__) {
      object = Polymer.Base.extend(Object.create(inherited), object);
    }
    object.__proto__ = inherited;
  }
  return object;
};
Polymer.Base = Polymer.Base.chainObject(Polymer.Base, HTMLElement.prototype);
if (window.CustomElements) {
  Polymer['instanceof'] = CustomElements['instanceof'];
} else {
  Polymer['instanceof'] = function (obj, ctor) {
    return obj instanceof ctor;
  };
}
Polymer.isInstance = function (obj) {
  return Boolean(obj && obj.__isPolymerInstance__);
};
Polymer.telemetry.instanceCount = 0;
(function () {
  var modules = {};
  var lcModules = {};
  var findModule = function findModule(id) {
    return modules[id] || lcModules[id.toLowerCase()];
  };
  var DomModule = function DomModule() {
    return document.createElement('dom-module');
  };
  DomModule.prototype = Object.create(HTMLElement.prototype);
  Polymer.Base.extend(DomModule.prototype, {
    constructor: DomModule,
    createdCallback: function createdCallback() {
      this.register();
    },
    register: function register(id) {
      var id = id || this.id || this.getAttribute('name') || this.getAttribute('is');
      if (id) {
        this.id = id;
        modules[id] = this;
        lcModules[id.toLowerCase()] = this;
      }
    },
    'import': function _import(id, selector) {
      if (id) {
        var m = findModule(id);
        if (!m) {
          forceDocumentUpgrade();
          m = findModule(id);
        }
        if (m && selector) {
          m = m.querySelector(selector);
        }
        return m;
      }
    }
  });
  var cePolyfill = window.CustomElements && !CustomElements.useNative;
  document.registerElement('dom-module', DomModule);
  function forceDocumentUpgrade() {
    if (cePolyfill) {
      var script = document._currentScript || document.currentScript;
      var doc = script && script.ownerDocument;
      if (doc) {
        CustomElements.upgradeAll(doc);
      }
    }
  }
})();
Polymer.Base._addFeature({
  _prepIs: function _prepIs() {
    if (!this.is) {
      var module = (document._currentScript || document.currentScript).parentNode;
      if (module.localName === 'dom-module') {
        var id = module.id || module.getAttribute('name') || module.getAttribute('is');
        this.is = id;
      }
    }
    if (this.is) {
      this.is = this.is.toLowerCase();
    }
  }
});
Polymer.Base._addFeature({
  behaviors: [],
  _desugarBehaviors: function _desugarBehaviors() {
    if (this.behaviors.length) {
      this.behaviors = this._desugarSomeBehaviors(this.behaviors);
    }
  },
  _desugarSomeBehaviors: function _desugarSomeBehaviors(behaviors) {
    behaviors = this._flattenBehaviorsList(behaviors);
    for (var i = behaviors.length - 1; i >= 0; i--) {
      this._mixinBehavior(behaviors[i]);
    }
    return behaviors;
  },
  _flattenBehaviorsList: function _flattenBehaviorsList(behaviors) {
    var flat = [];
    behaviors.forEach(function (b) {
      if (b instanceof Array) {
        flat = flat.concat(this._flattenBehaviorsList(b));
      } else if (b) {
        flat.push(b);
      } else {
        this._warn(this._logf('_flattenBehaviorsList', 'behavior is null, check for missing or 404 import'));
      }
    }, this);
    return flat;
  },
  _mixinBehavior: function _mixinBehavior(b) {
    Object.getOwnPropertyNames(b).forEach(function (n) {
      switch (n) {
        case 'hostAttributes':
        case 'registered':
        case 'properties':
        case 'observers':
        case 'listeners':
        case 'created':
        case 'attached':
        case 'detached':
        case 'attributeChanged':
        case 'configure':
        case 'ready':
          break;
        default:
          if (!this.hasOwnProperty(n)) {
            this.copyOwnProperty(n, b, this);
          }
          break;
      }
    }, this);
  },
  _prepBehaviors: function _prepBehaviors() {
    this._prepFlattenedBehaviors(this.behaviors);
  },
  _prepFlattenedBehaviors: function _prepFlattenedBehaviors(behaviors) {
    for (var i = 0, l = behaviors.length; i < l; i++) {
      this._prepBehavior(behaviors[i]);
    }
    this._prepBehavior(this);
  },
  _doBehavior: function _doBehavior(name, args) {
    this.behaviors.forEach(function (b) {
      this._invokeBehavior(b, name, args);
    }, this);
    this._invokeBehavior(this, name, args);
  },
  _invokeBehavior: function _invokeBehavior(b, name, args) {
    var fn = b[name];
    if (fn) {
      fn.apply(this, args || Polymer.nar);
    }
  },
  _marshalBehaviors: function _marshalBehaviors() {
    this.behaviors.forEach(function (b) {
      this._marshalBehavior(b);
    }, this);
    this._marshalBehavior(this);
  }
});
Polymer.Base._addFeature({
  _getExtendedPrototype: function _getExtendedPrototype(tag) {
    return this._getExtendedNativePrototype(tag);
  },
  _nativePrototypes: {},
  _getExtendedNativePrototype: function _getExtendedNativePrototype(tag) {
    var p = this._nativePrototypes[tag];
    if (!p) {
      var np = this.getNativePrototype(tag);
      p = this.extend(Object.create(np), Polymer.Base);
      this._nativePrototypes[tag] = p;
    }
    return p;
  },
  getNativePrototype: function getNativePrototype(tag) {
    return Object.getPrototypeOf(document.createElement(tag));
  }
});
Polymer.Base._addFeature({
  _prepConstructor: function _prepConstructor() {
    this._factoryArgs = this['extends'] ? [this['extends'], this.is] : [this.is];
    var ctor = function ctor() {
      return this._factory(arguments);
    };
    if (this.hasOwnProperty('extends')) {
      ctor['extends'] = this['extends'];
    }
    Object.defineProperty(this, 'constructor', {
      value: ctor,
      writable: true,
      configurable: true
    });
    ctor.prototype = this;
  },
  _factory: function _factory(args) {
    var elt = document.createElement.apply(document, this._factoryArgs);
    if (this.factoryImpl) {
      this.factoryImpl.apply(elt, args);
    }
    return elt;
  }
});
Polymer.nob = Object.create(null);
Polymer.Base._addFeature({
  properties: {},
  getPropertyInfo: function getPropertyInfo(property) {
    var info = this._getPropertyInfo(property, this.properties);
    if (!info) {
      this.behaviors.some(function (b) {
        return info = this._getPropertyInfo(property, b.properties);
      }, this);
    }
    return info || Polymer.nob;
  },
  _getPropertyInfo: function _getPropertyInfo(property, properties) {
    var p = properties && properties[property];
    if (typeof p === 'function') {
      p = properties[property] = { type: p };
    }
    if (p) {
      p.defined = true;
    }
    return p;
  }
});
Polymer.CaseMap = {
  _caseMap: {},
  dashToCamelCase: function dashToCamelCase(dash) {
    var mapped = Polymer.CaseMap._caseMap[dash];
    if (mapped) {
      return mapped;
    }
    if (dash.indexOf('-') < 0) {
      return Polymer.CaseMap._caseMap[dash] = dash;
    }
    return Polymer.CaseMap._caseMap[dash] = dash.replace(/-([a-z])/g, function (m) {
      return m[1].toUpperCase();
    });
  },
  camelToDashCase: function camelToDashCase(camel) {
    var mapped = Polymer.CaseMap._caseMap[camel];
    if (mapped) {
      return mapped;
    }
    return Polymer.CaseMap._caseMap[camel] = camel.replace(/([a-z][A-Z])/g, function (g) {
      return g[0] + '-' + g[1].toLowerCase();
    });
  }
};
Polymer.Base._addFeature({
  _prepAttributes: function _prepAttributes() {
    this._aggregatedAttributes = {};
  },
  _addHostAttributes: function _addHostAttributes(attributes) {
    if (attributes) {
      this.mixin(this._aggregatedAttributes, attributes);
    }
  },
  _marshalHostAttributes: function _marshalHostAttributes() {
    this._applyAttributes(this, this._aggregatedAttributes);
  },
  _applyAttributes: function _applyAttributes(node, attr$) {
    for (var n in attr$) {
      if (!this.hasAttribute(n) && n !== 'class') {
        this.serializeValueToAttribute(attr$[n], n, this);
      }
    }
  },
  _marshalAttributes: function _marshalAttributes() {
    this._takeAttributesToModel(this);
  },
  _takeAttributesToModel: function _takeAttributesToModel(model) {
    for (var i = 0, l = this.attributes.length; i < l; i++) {
      this._setAttributeToProperty(model, this.attributes[i].name);
    }
  },
  _setAttributeToProperty: function _setAttributeToProperty(model, attrName) {
    if (!this._serializing) {
      var propName = Polymer.CaseMap.dashToCamelCase(attrName);
      var info = this.getPropertyInfo(propName);
      if (info.defined || this._propertyEffects && this._propertyEffects[propName]) {
        var val = this.getAttribute(attrName);
        model[propName] = this.deserialize(val, info.type);
      }
    }
  },
  _serializing: false,
  reflectPropertyToAttribute: function reflectPropertyToAttribute(name) {
    this._serializing = true;
    this.serializeValueToAttribute(this[name], Polymer.CaseMap.camelToDashCase(name));
    this._serializing = false;
  },
  serializeValueToAttribute: function serializeValueToAttribute(value, attribute, node) {
    var str = this.serialize(value);
    (node || this)[str === undefined ? 'removeAttribute' : 'setAttribute'](attribute, str);
  },
  deserialize: function deserialize(value, type) {
    switch (type) {
      case Number:
        value = Number(value);
        break;
      case Boolean:
        value = value !== null;
        break;
      case Object:
        try {
          value = JSON.parse(value);
        } catch (x) {}
        break;
      case Array:
        try {
          value = JSON.parse(value);
        } catch (x) {
          value = null;
          console.warn('Polymer::Attributes: couldn`t decode Array as JSON');
        }
        break;
      case Date:
        value = new Date(value);
        break;
      case String:
      default:
        break;
    }
    return value;
  },
  serialize: function serialize(value) {
    switch (typeof value) {
      case 'boolean':
        return value ? '' : undefined;
      case 'object':
        if (value instanceof Date) {
          return value;
        } else if (value) {
          try {
            return JSON.stringify(value);
          } catch (x) {
            return '';
          }
        }
      default:
        return value != null ? value : undefined;
    }
  }
});
Polymer.Base._addFeature({
  _setupDebouncers: function _setupDebouncers() {
    this._debouncers = {};
  },
  debounce: function debounce(jobName, callback, wait) {
    return this._debouncers[jobName] = Polymer.Debounce.call(this, this._debouncers[jobName], callback, wait);
  },
  isDebouncerActive: function isDebouncerActive(jobName) {
    var debouncer = this._debouncers[jobName];
    return debouncer && debouncer.finish;
  },
  flushDebouncer: function flushDebouncer(jobName) {
    var debouncer = this._debouncers[jobName];
    if (debouncer) {
      debouncer.complete();
    }
  },
  cancelDebouncer: function cancelDebouncer(jobName) {
    var debouncer = this._debouncers[jobName];
    if (debouncer) {
      debouncer.stop();
    }
  }
});
Polymer.version = '1.1.2';
Polymer.Base._addFeature({
  _registerFeatures: function _registerFeatures() {
    this._prepIs();
    this._prepAttributes();
    this._prepBehaviors();
    this._prepConstructor();
  },
  _prepBehavior: function _prepBehavior(b) {
    this._addHostAttributes(b.hostAttributes);
  },
  _marshalBehavior: function _marshalBehavior(b) {},
  _initFeatures: function _initFeatures() {
    this._marshalHostAttributes();
    this._setupDebouncers();
    this._marshalBehaviors();
  }
});
Polymer.Base._addFeature({
  _prepTemplate: function _prepTemplate() {
    this._template = this._template || Polymer.DomModule['import'](this.is, 'template');
    if (this._template && this._template.hasAttribute('is')) {
      this._warn(this._logf('_prepTemplate', 'top-level Polymer template ' + 'must not be a type-extension, found', this._template, 'Move inside simple <template>.'));
    }
    if (this._template && !this._template.content && HTMLTemplateElement.bootstrap) {
      HTMLTemplateElement.decorate(this._template);
      HTMLTemplateElement.bootstrap(this._template.content);
    }
  },
  _stampTemplate: function _stampTemplate() {
    if (this._template) {
      this.root = this.instanceTemplate(this._template);
    }
  },
  instanceTemplate: function instanceTemplate(template) {
    var dom = document.importNode(template._content || template.content, true);
    return dom;
  }
});
(function () {
  var baseAttachedCallback = Polymer.Base.attachedCallback;
  Polymer.Base._addFeature({
    _hostStack: [],
    ready: function ready() {},
    _pushHost: function _pushHost(host) {
      this.dataHost = host = host || Polymer.Base._hostStack[Polymer.Base._hostStack.length - 1];
      if (host && host._clients) {
        host._clients.push(this);
      }
      this._beginHost();
    },
    _beginHost: function _beginHost() {
      Polymer.Base._hostStack.push(this);
      if (!this._clients) {
        this._clients = [];
      }
    },
    _popHost: function _popHost() {
      Polymer.Base._hostStack.pop();
    },
    _tryReady: function _tryReady() {
      if (this._canReady()) {
        this._ready();
      }
    },
    _canReady: function _canReady() {
      return !this.dataHost || this.dataHost._clientsReadied;
    },
    _ready: function _ready() {
      this._beforeClientsReady();
      this._setupRoot();
      this._readyClients();
      this._afterClientsReady();
      this._readySelf();
    },
    _readyClients: function _readyClients() {
      this._beginDistribute();
      var c$ = this._clients;
      for (var i = 0, l = c$.length, c; i < l && (c = c$[i]); i++) {
        c._ready();
      }
      this._finishDistribute();
      this._clientsReadied = true;
      this._clients = null;
    },
    _readySelf: function _readySelf() {
      this._doBehavior('ready');
      this._readied = true;
      if (this._attachedPending) {
        this._attachedPending = false;
        this.attachedCallback();
      }
    },
    _beforeClientsReady: function _beforeClientsReady() {},
    _afterClientsReady: function _afterClientsReady() {},
    _beforeAttached: function _beforeAttached() {},
    attachedCallback: function attachedCallback() {
      if (this._readied) {
        this._beforeAttached();
        baseAttachedCallback.call(this);
      } else {
        this._attachedPending = true;
      }
    }
  });
})();
Polymer.ArraySplice = (function () {
  function newSplice(index, removed, addedCount) {
    return {
      index: index,
      removed: removed,
      addedCount: addedCount
    };
  }
  var EDIT_LEAVE = 0;
  var EDIT_UPDATE = 1;
  var EDIT_ADD = 2;
  var EDIT_DELETE = 3;
  function ArraySplice() {}
  ArraySplice.prototype = {
    calcEditDistances: function calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd) {
      var rowCount = oldEnd - oldStart + 1;
      var columnCount = currentEnd - currentStart + 1;
      var distances = new Array(rowCount);
      for (var i = 0; i < rowCount; i++) {
        distances[i] = new Array(columnCount);
        distances[i][0] = i;
      }
      for (var j = 0; j < columnCount; j++) distances[0][j] = j;
      for (var i = 1; i < rowCount; i++) {
        for (var j = 1; j < columnCount; j++) {
          if (this.equals(current[currentStart + j - 1], old[oldStart + i - 1])) distances[i][j] = distances[i - 1][j - 1];else {
            var north = distances[i - 1][j] + 1;
            var west = distances[i][j - 1] + 1;
            distances[i][j] = north < west ? north : west;
          }
        }
      }
      return distances;
    },
    spliceOperationsFromEditDistances: function spliceOperationsFromEditDistances(distances) {
      var i = distances.length - 1;
      var j = distances[0].length - 1;
      var current = distances[i][j];
      var edits = [];
      while (i > 0 || j > 0) {
        if (i == 0) {
          edits.push(EDIT_ADD);
          j--;
          continue;
        }
        if (j == 0) {
          edits.push(EDIT_DELETE);
          i--;
          continue;
        }
        var northWest = distances[i - 1][j - 1];
        var west = distances[i - 1][j];
        var north = distances[i][j - 1];
        var min;
        if (west < north) min = west < northWest ? west : northWest;else min = north < northWest ? north : northWest;
        if (min == northWest) {
          if (northWest == current) {
            edits.push(EDIT_LEAVE);
          } else {
            edits.push(EDIT_UPDATE);
            current = northWest;
          }
          i--;
          j--;
        } else if (min == west) {
          edits.push(EDIT_DELETE);
          i--;
          current = west;
        } else {
          edits.push(EDIT_ADD);
          j--;
          current = north;
        }
      }
      edits.reverse();
      return edits;
    },
    calcSplices: function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
      var prefixCount = 0;
      var suffixCount = 0;
      var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
      if (currentStart == 0 && oldStart == 0) prefixCount = this.sharedPrefix(current, old, minLength);
      if (currentEnd == current.length && oldEnd == old.length) suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);
      currentStart += prefixCount;
      oldStart += prefixCount;
      currentEnd -= suffixCount;
      oldEnd -= suffixCount;
      if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0) return [];
      if (currentStart == currentEnd) {
        var splice = newSplice(currentStart, [], 0);
        while (oldStart < oldEnd) splice.removed.push(old[oldStart++]);
        return [splice];
      } else if (oldStart == oldEnd) return [newSplice(currentStart, [], currentEnd - currentStart)];
      var ops = this.spliceOperationsFromEditDistances(this.calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd));
      var splice = undefined;
      var splices = [];
      var index = currentStart;
      var oldIndex = oldStart;
      for (var i = 0; i < ops.length; i++) {
        switch (ops[i]) {
          case EDIT_LEAVE:
            if (splice) {
              splices.push(splice);
              splice = undefined;
            }
            index++;
            oldIndex++;
            break;
          case EDIT_UPDATE:
            if (!splice) splice = newSplice(index, [], 0);
            splice.addedCount++;
            index++;
            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
          case EDIT_ADD:
            if (!splice) splice = newSplice(index, [], 0);
            splice.addedCount++;
            index++;
            break;
          case EDIT_DELETE:
            if (!splice) splice = newSplice(index, [], 0);
            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
        }
      }
      if (splice) {
        splices.push(splice);
      }
      return splices;
    },
    sharedPrefix: function sharedPrefix(current, old, searchLength) {
      for (var i = 0; i < searchLength; i++) if (!this.equals(current[i], old[i])) return i;
      return searchLength;
    },
    sharedSuffix: function sharedSuffix(current, old, searchLength) {
      var index1 = current.length;
      var index2 = old.length;
      var count = 0;
      while (count < searchLength && this.equals(current[--index1], old[--index2])) count++;
      return count;
    },
    calculateSplices: function calculateSplices(current, previous) {
      return this.calcSplices(current, 0, current.length, previous, 0, previous.length);
    },
    equals: function equals(currentValue, previousValue) {
      return currentValue === previousValue;
    }
  };
  return new ArraySplice();
})();
Polymer.EventApi = (function () {
  var Settings = Polymer.Settings;
  var EventApi = function EventApi(event) {
    this.event = event;
  };
  if (Settings.useShadow) {
    EventApi.prototype = Object.defineProperties({}, {
      rootTarget: {
        get: function get() {
          return this.event.path[0];
        },
        configurable: true,
        enumerable: true
      },
      localTarget: {
        get: function get() {
          return this.event.target;
        },
        configurable: true,
        enumerable: true
      },
      path: {
        get: function get() {
          return this.event.path;
        },
        configurable: true,
        enumerable: true
      }
    });
  } else {
    EventApi.prototype = Object.defineProperties({}, {
      rootTarget: {
        get: function get() {
          return this.event.target;
        },
        configurable: true,
        enumerable: true
      },
      localTarget: {
        get: function get() {
          var current = this.event.currentTarget;
          var currentRoot = current && Polymer.dom(current).getOwnerRoot();
          var p$ = this.path;
          for (var i = 0; i < p$.length; i++) {
            if (Polymer.dom(p$[i]).getOwnerRoot() === currentRoot) {
              return p$[i];
            }
          }
        },
        configurable: true,
        enumerable: true
      },
      path: {
        get: function get() {
          if (!this.event._path) {
            var path = [];
            var o = this.rootTarget;
            while (o) {
              path.push(o);
              o = Polymer.dom(o).parentNode || o.host;
            }
            path.push(window);
            this.event._path = path;
          }
          return this.event._path;
        },
        configurable: true,
        enumerable: true
      }
    });
  }
  var factory = function factory(event) {
    if (!event.__eventApi) {
      event.__eventApi = new EventApi(event);
    }
    return event.__eventApi;
  };
  return { factory: factory };
})();
Polymer.domInnerHTML = (function () {
  var escapeAttrRegExp = /[&\u00A0"]/g;
  var escapeDataRegExp = /[&\u00A0<>]/g;
  function escapeReplace(c) {
    switch (c) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case '\xA0':
        return '&nbsp;';
    }
  }
  function escapeAttr(s) {
    return s.replace(escapeAttrRegExp, escapeReplace);
  }
  function escapeData(s) {
    return s.replace(escapeDataRegExp, escapeReplace);
  }
  function makeSet(arr) {
    var set = {};
    for (var i = 0; i < arr.length; i++) {
      set[arr[i]] = true;
    }
    return set;
  }
  var voidElements = makeSet(['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  var plaintextParents = makeSet(['style', 'script', 'xmp', 'iframe', 'noembed', 'noframes', 'plaintext', 'noscript']);
  function getOuterHTML(node, parentNode, composed) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        var tagName = node.localName;
        var s = '<' + tagName;
        var attrs = node.attributes;
        for (var i = 0, attr; attr = attrs[i]; i++) {
          s += ' ' + attr.name + '="' + escapeAttr(attr.value) + '"';
        }
        s += '>';
        if (voidElements[tagName]) {
          return s;
        }
        return s + getInnerHTML(node, composed) + '</' + tagName + '>';
      case Node.TEXT_NODE:
        var data = node.data;
        if (parentNode && plaintextParents[parentNode.localName]) {
          return data;
        }
        return escapeData(data);
      case Node.COMMENT_NODE:
        return '<!--' + node.data + '-->';
      default:
        console.error(node);
        throw new Error('not implemented');
    }
  }
  function getInnerHTML(node, composed) {
    if (node instanceof HTMLTemplateElement) node = node.content;
    var s = '';
    var c$ = Polymer.dom(node).childNodes;
    c$ = composed ? node._composedChildren : c$;
    for (var i = 0, l = c$.length, child; i < l && (child = c$[i]); i++) {
      s += getOuterHTML(child, node, composed);
    }
    return s;
  }
  return { getInnerHTML: getInnerHTML };
})();
Polymer.DomApi = (function () {
  'use strict';
  var Settings = Polymer.Settings;
  var getInnerHTML = Polymer.domInnerHTML.getInnerHTML;
  var nativeInsertBefore = Element.prototype.insertBefore;
  var nativeRemoveChild = Element.prototype.removeChild;
  var nativeAppendChild = Element.prototype.appendChild;
  var nativeCloneNode = Element.prototype.cloneNode;
  var nativeImportNode = Document.prototype.importNode;
  var DomApi = function DomApi(node) {
    this.node = node;
    if (this.patch) {
      this.patch();
    }
  };
  if (window.wrap && Settings.useShadow && !Settings.useNativeShadow) {
    DomApi = function (node) {
      this.node = wrap(node);
      if (this.patch) {
        this.patch();
      }
    };
  }
  DomApi.prototype = {
    flush: function flush() {
      Polymer.dom.flush();
    },
    _lazyDistribute: function _lazyDistribute(host) {
      if (host.shadyRoot && host.shadyRoot._distributionClean) {
        host.shadyRoot._distributionClean = false;
        Polymer.dom.addDebouncer(host.debounce('_distribute', host._distributeContent));
      }
    },
    appendChild: function appendChild(node) {
      return this._addNode(node);
    },
    insertBefore: function insertBefore(node, ref_node) {
      return this._addNode(node, ref_node);
    },
    _addNode: function _addNode(node, ref_node) {
      this._removeNodeFromHost(node, true);
      var addedInsertionPoint;
      var root = this.getOwnerRoot();
      if (root) {
        addedInsertionPoint = this._maybeAddInsertionPoint(node, this.node);
      }
      if (this._nodeHasLogicalChildren(this.node)) {
        if (ref_node) {
          var children = this.childNodes;
          var index = children.indexOf(ref_node);
          if (index < 0) {
            throw Error('The ref_node to be inserted before is not a child ' + 'of this node');
          }
        }
        this._addLogicalInfo(node, this.node, index);
      }
      this._addNodeToHost(node);
      if (!this._maybeDistribute(node, this.node) && !this._tryRemoveUndistributedNode(node)) {
        if (ref_node) {
          ref_node = ref_node.localName === CONTENT ? this._firstComposedNode(ref_node) : ref_node;
        }
        var container = this.node._isShadyRoot ? this.node.host : this.node;
        addToComposedParent(container, node, ref_node);
        if (ref_node) {
          nativeInsertBefore.call(container, node, ref_node);
        } else {
          nativeAppendChild.call(container, node);
        }
      }
      if (addedInsertionPoint) {
        this._updateInsertionPoints(root.host);
      }
      return node;
    },
    removeChild: function removeChild(node) {
      if (factory(node).parentNode !== this.node) {
        console.warn('The node to be removed is not a child of this node', node);
      }
      this._removeNodeFromHost(node);
      if (!this._maybeDistribute(node, this.node)) {
        var container = this.node._isShadyRoot ? this.node.host : this.node;
        if (container === node.parentNode) {
          removeFromComposedParent(container, node);
          nativeRemoveChild.call(container, node);
        }
      }
      return node;
    },
    replaceChild: function replaceChild(node, ref_node) {
      this.insertBefore(node, ref_node);
      this.removeChild(ref_node);
      return node;
    },
    _hasCachedOwnerRoot: function _hasCachedOwnerRoot(node) {
      return Boolean(node._ownerShadyRoot !== undefined);
    },
    getOwnerRoot: function getOwnerRoot() {
      return this._ownerShadyRootForNode(this.node);
    },
    _ownerShadyRootForNode: function _ownerShadyRootForNode(node) {
      if (!node) {
        return;
      }
      if (node._ownerShadyRoot === undefined) {
        var root;
        if (node._isShadyRoot) {
          root = node;
        } else {
          var parent = Polymer.dom(node).parentNode;
          if (parent) {
            root = parent._isShadyRoot ? parent : this._ownerShadyRootForNode(parent);
          } else {
            root = null;
          }
        }
        node._ownerShadyRoot = root;
      }
      return node._ownerShadyRoot;
    },
    _maybeDistribute: function _maybeDistribute(node, parent) {
      var fragContent = node.nodeType === Node.DOCUMENT_FRAGMENT_NODE && !node.__noContent && Polymer.dom(node).querySelector(CONTENT);
      var wrappedContent = fragContent && Polymer.dom(fragContent).parentNode.nodeType !== Node.DOCUMENT_FRAGMENT_NODE;
      var hasContent = fragContent || node.localName === CONTENT;
      if (hasContent) {
        var root = this._ownerShadyRootForNode(parent);
        if (root) {
          var host = root.host;
          this._lazyDistribute(host);
        }
      }
      var parentNeedsDist = this._parentNeedsDistribution(parent);
      if (parentNeedsDist) {
        this._lazyDistribute(parent);
      }
      return parentNeedsDist || hasContent && !wrappedContent;
    },
    _maybeAddInsertionPoint: function _maybeAddInsertionPoint(node, parent) {
      var added;
      if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE && !node.__noContent) {
        var c$ = factory(node).querySelectorAll(CONTENT);
        for (var i = 0, n, np, na; i < c$.length && (n = c$[i]); i++) {
          np = factory(n).parentNode;
          if (np === node) {
            np = parent;
          }
          na = this._maybeAddInsertionPoint(n, np);
          added = added || na;
        }
      } else if (node.localName === CONTENT) {
        saveLightChildrenIfNeeded(parent);
        saveLightChildrenIfNeeded(node);
        added = true;
      }
      return added;
    },
    _tryRemoveUndistributedNode: function _tryRemoveUndistributedNode(node) {
      if (this.node.shadyRoot) {
        var parent = getComposedParent(node);
        if (parent) {
          nativeRemoveChild.call(parent, node);
        }
        return true;
      }
    },
    _updateInsertionPoints: function _updateInsertionPoints(host) {
      var i$ = host.shadyRoot._insertionPoints = factory(host.shadyRoot).querySelectorAll(CONTENT);
      for (var i = 0, c; i < i$.length; i++) {
        c = i$[i];
        saveLightChildrenIfNeeded(c);
        saveLightChildrenIfNeeded(factory(c).parentNode);
      }
    },
    _nodeHasLogicalChildren: function _nodeHasLogicalChildren(node) {
      return Boolean(node._lightChildren !== undefined);
    },
    _parentNeedsDistribution: function _parentNeedsDistribution(parent) {
      return parent && parent.shadyRoot && hasInsertionPoint(parent.shadyRoot);
    },
    _removeNodeFromHost: function _removeNodeFromHost(node, ensureComposedRemoval) {
      var hostNeedsDist;
      var root;
      var parent = node._lightParent;
      if (parent) {
        factory(node)._distributeParent();
        root = this._ownerShadyRootForNode(node);
        if (root) {
          root.host._elementRemove(node);
          hostNeedsDist = this._removeDistributedChildren(root, node);
        }
        this._removeLogicalInfo(node, node._lightParent);
      }
      this._removeOwnerShadyRoot(node);
      if (root && hostNeedsDist) {
        this._updateInsertionPoints(root.host);
        this._lazyDistribute(root.host);
      } else if (ensureComposedRemoval) {
        removeFromComposedParent(getComposedParent(node), node);
      }
    },
    _removeDistributedChildren: function _removeDistributedChildren(root, container) {
      var hostNeedsDist;
      var ip$ = root._insertionPoints;
      for (var i = 0; i < ip$.length; i++) {
        var content = ip$[i];
        if (this._contains(container, content)) {
          var dc$ = factory(content).getDistributedNodes();
          for (var j = 0; j < dc$.length; j++) {
            hostNeedsDist = true;
            var node = dc$[j];
            var parent = node.parentNode;
            if (parent) {
              removeFromComposedParent(parent, node);
              nativeRemoveChild.call(parent, node);
            }
          }
        }
      }
      return hostNeedsDist;
    },
    _contains: function _contains(container, node) {
      while (node) {
        if (node == container) {
          return true;
        }
        node = factory(node).parentNode;
      }
    },
    _addNodeToHost: function _addNodeToHost(node) {
      var root = this.getOwnerRoot();
      if (root) {
        root.host._elementAdd(node);
      }
    },
    _addLogicalInfo: function _addLogicalInfo(node, container, index) {
      var children = factory(container).childNodes;
      index = index === undefined ? children.length : index;
      if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        var c$ = Array.prototype.slice.call(node.childNodes);
        for (var i = 0, n; i < c$.length && (n = c$[i]); i++) {
          children.splice(index++, 0, n);
          n._lightParent = container;
        }
      } else {
        children.splice(index, 0, node);
        node._lightParent = container;
      }
    },
    _removeLogicalInfo: function _removeLogicalInfo(node, container) {
      var children = factory(container).childNodes;
      var index = children.indexOf(node);
      if (index < 0 || container !== node._lightParent) {
        throw Error('The node to be removed is not a child of this node');
      }
      children.splice(index, 1);
      node._lightParent = null;
    },
    _removeOwnerShadyRoot: function _removeOwnerShadyRoot(node) {
      if (this._hasCachedOwnerRoot(node)) {
        var c$ = factory(node).childNodes;
        for (var i = 0, l = c$.length, n; i < l && (n = c$[i]); i++) {
          this._removeOwnerShadyRoot(n);
        }
      }
      node._ownerShadyRoot = undefined;
    },
    _firstComposedNode: function _firstComposedNode(content) {
      var n$ = factory(content).getDistributedNodes();
      for (var i = 0, l = n$.length, n, p$; i < l && (n = n$[i]); i++) {
        p$ = factory(n).getDestinationInsertionPoints();
        if (p$[p$.length - 1] === content) {
          return n;
        }
      }
    },
    querySelector: function querySelector(selector) {
      return this.querySelectorAll(selector)[0];
    },
    querySelectorAll: function querySelectorAll(selector) {
      return this._query(function (n) {
        return matchesSelector.call(n, selector);
      }, this.node);
    },
    _query: function _query(matcher, node) {
      node = node || this.node;
      var list = [];
      this._queryElements(factory(node).childNodes, matcher, list);
      return list;
    },
    _queryElements: function _queryElements(elements, matcher, list) {
      for (var i = 0, l = elements.length, c; i < l && (c = elements[i]); i++) {
        if (c.nodeType === Node.ELEMENT_NODE) {
          this._queryElement(c, matcher, list);
        }
      }
    },
    _queryElement: function _queryElement(node, matcher, list) {
      if (matcher(node)) {
        list.push(node);
      }
      this._queryElements(factory(node).childNodes, matcher, list);
    },
    getDestinationInsertionPoints: function getDestinationInsertionPoints() {
      return this.node._destinationInsertionPoints || [];
    },
    getDistributedNodes: function getDistributedNodes() {
      return this.node._distributedNodes || [];
    },
    queryDistributedElements: function queryDistributedElements(selector) {
      var c$ = this.childNodes;
      var list = [];
      this._distributedFilter(selector, c$, list);
      for (var i = 0, l = c$.length, c; i < l && (c = c$[i]); i++) {
        if (c.localName === CONTENT) {
          this._distributedFilter(selector, factory(c).getDistributedNodes(), list);
        }
      }
      return list;
    },
    _distributedFilter: function _distributedFilter(selector, list, results) {
      results = results || [];
      for (var i = 0, l = list.length, d; i < l && (d = list[i]); i++) {
        if (d.nodeType === Node.ELEMENT_NODE && d.localName !== CONTENT && matchesSelector.call(d, selector)) {
          results.push(d);
        }
      }
      return results;
    },
    _clear: function _clear() {
      while (this.childNodes.length) {
        this.removeChild(this.childNodes[0]);
      }
    },
    setAttribute: function setAttribute(name, value) {
      this.node.setAttribute(name, value);
      this._distributeParent();
    },
    removeAttribute: function removeAttribute(name) {
      this.node.removeAttribute(name);
      this._distributeParent();
    },
    _distributeParent: function _distributeParent() {
      if (this._parentNeedsDistribution(this.parentNode)) {
        this._lazyDistribute(this.parentNode);
      }
    },
    cloneNode: function cloneNode(deep) {
      var n = nativeCloneNode.call(this.node, false);
      if (deep) {
        var c$ = this.childNodes;
        var d = factory(n);
        for (var i = 0, nc; i < c$.length; i++) {
          nc = factory(c$[i]).cloneNode(true);
          d.appendChild(nc);
        }
      }
      return n;
    },
    importNode: function importNode(externalNode, deep) {
      var doc = this.node instanceof Document ? this.node : this.node.ownerDocument;
      var n = nativeImportNode.call(doc, externalNode, false);
      if (deep) {
        var c$ = factory(externalNode).childNodes;
        var d = factory(n);
        for (var i = 0, nc; i < c$.length; i++) {
          nc = factory(doc).importNode(c$[i], true);
          d.appendChild(nc);
        }
      }
      return n;
    }
  };
  Object.defineProperty(DomApi.prototype, 'classList', {
    get: function get() {
      if (!this._classList) {
        this._classList = new DomApi.ClassList(this);
      }
      return this._classList;
    },
    configurable: true
  });
  DomApi.ClassList = function (host) {
    this.domApi = host;
    this.node = host.node;
  };
  DomApi.ClassList.prototype = {
    add: function add() {
      this.node.classList.add.apply(this.node.classList, arguments);
      this.domApi._distributeParent();
    },
    remove: function remove() {
      this.node.classList.remove.apply(this.node.classList, arguments);
      this.domApi._distributeParent();
    },
    toggle: function toggle() {
      this.node.classList.toggle.apply(this.node.classList, arguments);
      this.domApi._distributeParent();
    },
    contains: function contains() {
      return this.node.classList.contains.apply(this.node.classList, arguments);
    }
  };
  if (!Settings.useShadow) {
    Object.defineProperties(DomApi.prototype, {
      childNodes: {
        get: function get() {
          var c$ = getLightChildren(this.node);
          return Array.isArray(c$) ? c$ : Array.prototype.slice.call(c$);
        },
        configurable: true
      },
      children: {
        get: function get() {
          return Array.prototype.filter.call(this.childNodes, function (n) {
            return n.nodeType === Node.ELEMENT_NODE;
          });
        },
        configurable: true
      },
      parentNode: {
        get: function get() {
          return this.node._lightParent || getComposedParent(this.node);
        },
        configurable: true
      },
      firstChild: {
        get: function get() {
          return this.childNodes[0];
        },
        configurable: true
      },
      lastChild: {
        get: function get() {
          var c$ = this.childNodes;
          return c$[c$.length - 1];
        },
        configurable: true
      },
      nextSibling: {
        get: function get() {
          var c$ = this.parentNode && factory(this.parentNode).childNodes;
          if (c$) {
            return c$[Array.prototype.indexOf.call(c$, this.node) + 1];
          }
        },
        configurable: true
      },
      previousSibling: {
        get: function get() {
          var c$ = this.parentNode && factory(this.parentNode).childNodes;
          if (c$) {
            return c$[Array.prototype.indexOf.call(c$, this.node) - 1];
          }
        },
        configurable: true
      },
      firstElementChild: {
        get: function get() {
          return this.children[0];
        },
        configurable: true
      },
      lastElementChild: {
        get: function get() {
          var c$ = this.children;
          return c$[c$.length - 1];
        },
        configurable: true
      },
      nextElementSibling: {
        get: function get() {
          var c$ = this.parentNode && factory(this.parentNode).children;
          if (c$) {
            return c$[Array.prototype.indexOf.call(c$, this.node) + 1];
          }
        },
        configurable: true
      },
      previousElementSibling: {
        get: function get() {
          var c$ = this.parentNode && factory(this.parentNode).children;
          if (c$) {
            return c$[Array.prototype.indexOf.call(c$, this.node) - 1];
          }
        },
        configurable: true
      },
      textContent: {
        get: function get() {
          var nt = this.node.nodeType;
          if (nt === Node.TEXT_NODE || nt === Node.COMMENT_NODE) {
            return this.node.textContent;
          } else {
            var tc = [];
            for (var i = 0, cn = this.childNodes, c; c = cn[i]; i++) {
              if (c.nodeType !== Node.COMMENT_NODE) {
                tc.push(c.textContent);
              }
            }
            return tc.join('');
          }
        },
        set: function set(text) {
          var nt = this.node.nodeType;
          if (nt === Node.TEXT_NODE || nt === Node.COMMENT_NODE) {
            this.node.textContent = text;
          } else {
            this._clear();
            if (text) {
              this.appendChild(document.createTextNode(text));
            }
          }
        },
        configurable: true
      },
      innerHTML: {
        get: function get() {
          var nt = this.node.nodeType;
          if (nt === Node.TEXT_NODE || nt === Node.COMMENT_NODE) {
            return null;
          } else {
            return getInnerHTML(this.node);
          }
        },
        set: function set(text) {
          var nt = this.node.nodeType;
          if (nt !== Node.TEXT_NODE || nt !== Node.COMMENT_NODE) {
            this._clear();
            var d = document.createElement('div');
            d.innerHTML = text;
            var c$ = Array.prototype.slice.call(d.childNodes);
            for (var i = 0; i < c$.length; i++) {
              this.appendChild(c$[i]);
            }
          }
        },
        configurable: true
      }
    });
    DomApi.prototype._getComposedInnerHTML = function () {
      return getInnerHTML(this.node, true);
    };
  } else {
    var forwardMethods = ['cloneNode', 'appendChild', 'insertBefore', 'removeChild', 'replaceChild'];
    forwardMethods.forEach(function (name) {
      DomApi.prototype[name] = function () {
        return this.node[name].apply(this.node, arguments);
      };
    });
    DomApi.prototype.querySelectorAll = function (selector) {
      return Array.prototype.slice.call(this.node.querySelectorAll(selector));
    };
    DomApi.prototype.getOwnerRoot = function () {
      var n = this.node;
      while (n) {
        if (n.nodeType === Node.DOCUMENT_FRAGMENT_NODE && n.host) {
          return n;
        }
        n = n.parentNode;
      }
    };
    DomApi.prototype.importNode = function (externalNode, deep) {
      var doc = this.node instanceof Document ? this.node : this.node.ownerDocument;
      return doc.importNode(externalNode, deep);
    };
    DomApi.prototype.getDestinationInsertionPoints = function () {
      var n$ = this.node.getDestinationInsertionPoints && this.node.getDestinationInsertionPoints();
      return n$ ? Array.prototype.slice.call(n$) : [];
    };
    DomApi.prototype.getDistributedNodes = function () {
      var n$ = this.node.getDistributedNodes && this.node.getDistributedNodes();
      return n$ ? Array.prototype.slice.call(n$) : [];
    };
    DomApi.prototype._distributeParent = function () {};
    Object.defineProperties(DomApi.prototype, {
      childNodes: {
        get: function get() {
          return Array.prototype.slice.call(this.node.childNodes);
        },
        configurable: true
      },
      children: {
        get: function get() {
          return Array.prototype.slice.call(this.node.children);
        },
        configurable: true
      },
      textContent: {
        get: function get() {
          return this.node.textContent;
        },
        set: function set(value) {
          return this.node.textContent = value;
        },
        configurable: true
      },
      innerHTML: {
        get: function get() {
          return this.node.innerHTML;
        },
        set: function set(value) {
          return this.node.innerHTML = value;
        },
        configurable: true
      }
    });
    var forwardProperties = ['parentNode', 'firstChild', 'lastChild', 'nextSibling', 'previousSibling', 'firstElementChild', 'lastElementChild', 'nextElementSibling', 'previousElementSibling'];
    forwardProperties.forEach(function (name) {
      Object.defineProperty(DomApi.prototype, name, {
        get: function get() {
          return this.node[name];
        },
        configurable: true
      });
    });
  }
  var CONTENT = 'content';
  var factory = function factory(node, patch) {
    node = node || document;
    if (!node.__domApi) {
      node.__domApi = new DomApi(node, patch);
    }
    return node.__domApi;
  };
  Polymer.dom = function (obj, patch) {
    if (obj instanceof Event) {
      return Polymer.EventApi.factory(obj);
    } else {
      return factory(obj, patch);
    }
  };
  Polymer.Base.extend(Polymer.dom, {
    _flushGuard: 0,
    _FLUSH_MAX: 100,
    _needsTakeRecords: !Polymer.Settings.useNativeCustomElements,
    _debouncers: [],
    _finishDebouncer: null,
    flush: function flush() {
      for (var i = 0; i < this._debouncers.length; i++) {
        this._debouncers[i].complete();
      }
      if (this._finishDebouncer) {
        this._finishDebouncer.complete();
      }
      this._flushPolyfills();
      if (this._debouncers.length && this._flushGuard < this._FLUSH_MAX) {
        this._flushGuard++;
        this.flush();
      } else {
        if (this._flushGuard >= this._FLUSH_MAX) {
          console.warn('Polymer.dom.flush aborted. Flush may not be complete.');
        }
        this._flushGuard = 0;
      }
    },
    _flushPolyfills: function _flushPolyfills() {
      if (this._needsTakeRecords) {
        CustomElements.takeRecords();
      }
    },
    addDebouncer: function addDebouncer(debouncer) {
      this._debouncers.push(debouncer);
      this._finishDebouncer = Polymer.Debounce(this._finishDebouncer, this._finishFlush);
    },
    _finishFlush: function _finishFlush() {
      Polymer.dom._debouncers = [];
    }
  });
  function getLightChildren(node) {
    var children = node._lightChildren;
    return children ? children : node.childNodes;
  }
  function getComposedChildren(node) {
    if (!node._composedChildren) {
      node._composedChildren = Array.prototype.slice.call(node.childNodes);
    }
    return node._composedChildren;
  }
  function addToComposedParent(parent, node, ref_node) {
    var children = getComposedChildren(parent);
    var i = ref_node ? children.indexOf(ref_node) : -1;
    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      var fragChildren = getComposedChildren(node);
      for (var j = 0; j < fragChildren.length; j++) {
        addNodeToComposedChildren(fragChildren[j], parent, children, i + j);
      }
      node._composedChildren = null;
    } else {
      addNodeToComposedChildren(node, parent, children, i);
    }
  }
  function getComposedParent(node) {
    return node.__patched ? node._composedParent : node.parentNode;
  }
  function addNodeToComposedChildren(node, parent, children, i) {
    node._composedParent = parent;
    children.splice(i >= 0 ? i : children.length, 0, node);
  }
  function removeFromComposedParent(parent, node) {
    node._composedParent = null;
    if (parent) {
      var children = getComposedChildren(parent);
      var i = children.indexOf(node);
      if (i >= 0) {
        children.splice(i, 1);
      }
    }
  }
  function saveLightChildrenIfNeeded(node) {
    if (!node._lightChildren) {
      var c$ = Array.prototype.slice.call(node.childNodes);
      for (var i = 0, l = c$.length, child; i < l && (child = c$[i]); i++) {
        child._lightParent = child._lightParent || node;
      }
      node._lightChildren = c$;
    }
  }
  function hasInsertionPoint(root) {
    return Boolean(root && root._insertionPoints.length);
  }
  var p = Element.prototype;
  var matchesSelector = p.matches || p.matchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector || p.webkitMatchesSelector;
  return {
    getLightChildren: getLightChildren,
    getComposedParent: getComposedParent,
    getComposedChildren: getComposedChildren,
    removeFromComposedParent: removeFromComposedParent,
    saveLightChildrenIfNeeded: saveLightChildrenIfNeeded,
    matchesSelector: matchesSelector,
    hasInsertionPoint: hasInsertionPoint,
    ctor: DomApi,
    factory: factory
  };
})();
(function () {
  Polymer.Base._addFeature(Object.defineProperties({
    _prepShady: function _prepShady() {
      this._useContent = this._useContent || Boolean(this._template);
    },
    _poolContent: function _poolContent() {
      if (this._useContent) {
        saveLightChildrenIfNeeded(this);
      }
    },
    _setupRoot: function _setupRoot() {
      if (this._useContent) {
        this._createLocalRoot();
        if (!this.dataHost) {
          upgradeLightChildren(this._lightChildren);
        }
      }
    },
    _createLocalRoot: function _createLocalRoot() {
      this.shadyRoot = this.root;
      this.shadyRoot._distributionClean = false;
      this.shadyRoot._isShadyRoot = true;
      this.shadyRoot._dirtyRoots = [];
      var i$ = this.shadyRoot._insertionPoints = !this._notes || this._notes._hasContent ? this.shadyRoot.querySelectorAll('content') : [];
      saveLightChildrenIfNeeded(this.shadyRoot);
      for (var i = 0, c; i < i$.length; i++) {
        c = i$[i];
        saveLightChildrenIfNeeded(c);
        saveLightChildrenIfNeeded(c.parentNode);
      }
      this.shadyRoot.host = this;
    },

    distributeContent: function distributeContent(updateInsertionPoints) {
      if (this.shadyRoot) {
        var dom = Polymer.dom(this);
        if (updateInsertionPoints) {
          dom._updateInsertionPoints(this);
        }
        var host = getTopDistributingHost(this);
        dom._lazyDistribute(host);
      }
    },
    _distributeContent: function _distributeContent() {
      if (this._useContent && !this.shadyRoot._distributionClean) {
        this._beginDistribute();
        this._distributeDirtyRoots();
        this._finishDistribute();
      }
    },
    _beginDistribute: function _beginDistribute() {
      if (this._useContent && hasInsertionPoint(this.shadyRoot)) {
        this._resetDistribution();
        this._distributePool(this.shadyRoot, this._collectPool());
      }
    },
    _distributeDirtyRoots: function _distributeDirtyRoots() {
      var c$ = this.shadyRoot._dirtyRoots;
      for (var i = 0, l = c$.length, c; i < l && (c = c$[i]); i++) {
        c._distributeContent();
      }
      this.shadyRoot._dirtyRoots = [];
    },
    _finishDistribute: function _finishDistribute() {
      if (this._useContent) {
        this.shadyRoot._distributionClean = true;
        if (hasInsertionPoint(this.shadyRoot)) {
          this._composeTree();
        } else {
          if (!this.shadyRoot._hasDistributed) {
            this.textContent = '';
            this._composedChildren = null;
            this.appendChild(this.shadyRoot);
          } else {
            var children = this._composeNode(this);
            this._updateChildNodes(this, children);
          }
        }
        this.shadyRoot._hasDistributed = true;
      }
    },
    elementMatches: function elementMatches(selector, node) {
      node = node || this;
      return matchesSelector.call(node, selector);
    },
    _resetDistribution: function _resetDistribution() {
      var children = getLightChildren(this);
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child._destinationInsertionPoints) {
          child._destinationInsertionPoints = undefined;
        }
        if (isInsertionPoint(child)) {
          clearDistributedDestinationInsertionPoints(child);
        }
      }
      var root = this.shadyRoot;
      var p$ = root._insertionPoints;
      for (var j = 0; j < p$.length; j++) {
        p$[j]._distributedNodes = [];
      }
    },
    _collectPool: function _collectPool() {
      var pool = [];
      var children = getLightChildren(this);
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (isInsertionPoint(child)) {
          pool.push.apply(pool, child._distributedNodes);
        } else {
          pool.push(child);
        }
      }
      return pool;
    },
    _distributePool: function _distributePool(node, pool) {
      var p$ = node._insertionPoints;
      for (var i = 0, l = p$.length, p; i < l && (p = p$[i]); i++) {
        this._distributeInsertionPoint(p, pool);
        maybeRedistributeParent(p, this);
      }
    },
    _distributeInsertionPoint: function _distributeInsertionPoint(content, pool) {
      var anyDistributed = false;
      for (var i = 0, l = pool.length, node; i < l; i++) {
        node = pool[i];
        if (!node) {
          continue;
        }
        if (this._matchesContentSelect(node, content)) {
          distributeNodeInto(node, content);
          pool[i] = undefined;
          anyDistributed = true;
        }
      }
      if (!anyDistributed) {
        var children = getLightChildren(content);
        for (var j = 0; j < children.length; j++) {
          distributeNodeInto(children[j], content);
        }
      }
    },
    _composeTree: function _composeTree() {
      this._updateChildNodes(this, this._composeNode(this));
      var p$ = this.shadyRoot._insertionPoints;
      for (var i = 0, l = p$.length, p, parent; i < l && (p = p$[i]); i++) {
        parent = p._lightParent || p.parentNode;
        if (!parent._useContent && parent !== this && parent !== this.shadyRoot) {
          this._updateChildNodes(parent, this._composeNode(parent));
        }
      }
    },
    _composeNode: function _composeNode(node) {
      var children = [];
      var c$ = getLightChildren(node.shadyRoot || node);
      for (var i = 0; i < c$.length; i++) {
        var child = c$[i];
        if (isInsertionPoint(child)) {
          var distributedNodes = child._distributedNodes;
          for (var j = 0; j < distributedNodes.length; j++) {
            var distributedNode = distributedNodes[j];
            if (isFinalDestination(child, distributedNode)) {
              children.push(distributedNode);
            }
          }
        } else {
          children.push(child);
        }
      }
      return children;
    },
    _updateChildNodes: function _updateChildNodes(container, children) {
      var composed = getComposedChildren(container);
      var splices = Polymer.ArraySplice.calculateSplices(children, composed);
      for (var i = 0, d = 0, s; i < splices.length && (s = splices[i]); i++) {
        for (var j = 0, n; j < s.removed.length && (n = s.removed[j]); j++) {
          if (getComposedParent(n) === container) {
            remove(n);
          }
          composed.splice(s.index + d, 1);
        }
        d -= s.addedCount;
      }
      for (var i = 0, s, next; i < splices.length && (s = splices[i]); i++) {
        next = composed[s.index];
        for (var j = s.index, n; j < s.index + s.addedCount; j++) {
          n = children[j];
          insertBefore(container, n, next);
          composed.splice(j, 0, n);
        }
      }
      ensureComposedParent(container, children);
    },
    _matchesContentSelect: function _matchesContentSelect(node, contentElement) {
      var select = contentElement.getAttribute('select');
      if (!select) {
        return true;
      }
      select = select.trim();
      if (!select) {
        return true;
      }
      if (!(node instanceof Element)) {
        return false;
      }
      var validSelectors = /^(:not\()?[*.#[a-zA-Z_|]/;
      if (!validSelectors.test(select)) {
        return false;
      }
      return this.elementMatches(select, node);
    },
    _elementAdd: function _elementAdd() {},
    _elementRemove: function _elementRemove() {}
  }, {
    domHost: {
      get: function get() {
        var root = Polymer.dom(this).getOwnerRoot();
        return root && root.host;
      },
      configurable: true,
      enumerable: true
    }
  }));
  var saveLightChildrenIfNeeded = Polymer.DomApi.saveLightChildrenIfNeeded;
  var getLightChildren = Polymer.DomApi.getLightChildren;
  var matchesSelector = Polymer.DomApi.matchesSelector;
  var hasInsertionPoint = Polymer.DomApi.hasInsertionPoint;
  var getComposedChildren = Polymer.DomApi.getComposedChildren;
  var getComposedParent = Polymer.DomApi.getComposedParent;
  var removeFromComposedParent = Polymer.DomApi.removeFromComposedParent;
  function distributeNodeInto(child, insertionPoint) {
    insertionPoint._distributedNodes.push(child);
    var points = child._destinationInsertionPoints;
    if (!points) {
      child._destinationInsertionPoints = [insertionPoint];
    } else {
      points.push(insertionPoint);
    }
  }
  function clearDistributedDestinationInsertionPoints(content) {
    var e$ = content._distributedNodes;
    if (e$) {
      for (var i = 0; i < e$.length; i++) {
        var d = e$[i]._destinationInsertionPoints;
        if (d) {
          d.splice(d.indexOf(content) + 1, d.length);
        }
      }
    }
  }
  function maybeRedistributeParent(content, host) {
    var parent = content._lightParent;
    if (parent && parent.shadyRoot && hasInsertionPoint(parent.shadyRoot) && parent.shadyRoot._distributionClean) {
      parent.shadyRoot._distributionClean = false;
      host.shadyRoot._dirtyRoots.push(parent);
    }
  }
  function isFinalDestination(insertionPoint, node) {
    var points = node._destinationInsertionPoints;
    return points && points[points.length - 1] === insertionPoint;
  }
  function isInsertionPoint(node) {
    return node.localName == 'content';
  }
  var nativeInsertBefore = Element.prototype.insertBefore;
  var nativeRemoveChild = Element.prototype.removeChild;
  function insertBefore(parentNode, newChild, refChild) {
    var newChildParent = getComposedParent(newChild);
    if (newChildParent !== parentNode) {
      removeFromComposedParent(newChildParent, newChild);
    }
    remove(newChild);
    nativeInsertBefore.call(parentNode, newChild, refChild || null);
    newChild._composedParent = parentNode;
  }
  function remove(node) {
    var parentNode = getComposedParent(node);
    if (parentNode) {
      node._composedParent = null;
      nativeRemoveChild.call(parentNode, node);
    }
  }
  function ensureComposedParent(parent, children) {
    for (var i = 0, n; i < children.length; i++) {
      children[i]._composedParent = parent;
    }
  }
  function getTopDistributingHost(host) {
    while (host && hostNeedsRedistribution(host)) {
      host = host.domHost;
    }
    return host;
  }
  function hostNeedsRedistribution(host) {
    var c$ = Polymer.dom(host).children;
    for (var i = 0, c; i < c$.length; i++) {
      c = c$[i];
      if (c.localName === 'content') {
        return host.domHost;
      }
    }
  }
  var needsUpgrade = window.CustomElements && !CustomElements.useNative;
  function upgradeLightChildren(children) {
    if (needsUpgrade && children) {
      for (var i = 0; i < children.length; i++) {
        CustomElements.upgrade(children[i]);
      }
    }
  }
})();
if (Polymer.Settings.useShadow) {
  Polymer.Base._addFeature({
    _poolContent: function _poolContent() {},
    _beginDistribute: function _beginDistribute() {},
    distributeContent: function distributeContent() {},
    _distributeContent: function _distributeContent() {},
    _finishDistribute: function _finishDistribute() {},
    _createLocalRoot: function _createLocalRoot() {
      this.createShadowRoot();
      this.shadowRoot.appendChild(this.root);
      this.root = this.shadowRoot;
    }
  });
}
Polymer.DomModule = document.createElement('dom-module');
Polymer.Base._addFeature({
  _registerFeatures: function _registerFeatures() {
    this._prepIs();
    this._prepAttributes();
    this._prepBehaviors();
    this._prepConstructor();
    this._prepTemplate();
    this._prepShady();
  },
  _prepBehavior: function _prepBehavior(b) {
    this._addHostAttributes(b.hostAttributes);
  },
  _initFeatures: function _initFeatures() {
    this._poolContent();
    this._pushHost();
    this._stampTemplate();
    this._popHost();
    this._marshalHostAttributes();
    this._setupDebouncers();
    this._marshalBehaviors();
    this._tryReady();
  },
  _marshalBehavior: function _marshalBehavior(b) {}
});
Polymer.nar = [];
Polymer.Annotations = {
  parseAnnotations: function parseAnnotations(template) {
    var list = [];
    var content = template._content || template.content;
    this._parseNodeAnnotations(content, list);
    return list;
  },
  _parseNodeAnnotations: function _parseNodeAnnotations(node, list) {
    return node.nodeType === Node.TEXT_NODE ? this._parseTextNodeAnnotation(node, list) : this._parseElementAnnotations(node, list);
  },
  _testEscape: function _testEscape(value) {
    var escape = value.slice(0, 2);
    if (escape === '{{' || escape === '[[') {
      return escape;
    }
  },
  _parseTextNodeAnnotation: function _parseTextNodeAnnotation(node, list) {
    var v = node.textContent;
    var escape = this._testEscape(v);
    if (escape) {
      node.textContent = ' ';
      var annote = {
        bindings: [{
          kind: 'text',
          mode: escape[0],
          value: v.slice(2, -2).trim()
        }]
      };
      list.push(annote);
      return annote;
    }
  },
  _parseElementAnnotations: function _parseElementAnnotations(element, list) {
    var annote = {
      bindings: [],
      events: []
    };
    if (element.localName === 'content') {
      list._hasContent = true;
    }
    this._parseChildNodesAnnotations(element, annote, list);
    if (element.attributes) {
      this._parseNodeAttributeAnnotations(element, annote, list);
      if (this.prepElement) {
        this.prepElement(element);
      }
    }
    if (annote.bindings.length || annote.events.length || annote.id) {
      list.push(annote);
    }
    return annote;
  },
  _parseChildNodesAnnotations: function _parseChildNodesAnnotations(root, annote, list, callback) {
    if (root.firstChild) {
      for (var i = 0, node = root.firstChild; node; node = node.nextSibling, i++) {
        if (node.localName === 'template' && !node.hasAttribute('preserve-content')) {
          this._parseTemplate(node, i, list, annote);
        }
        if (node.nodeType === Node.TEXT_NODE) {
          var n = node.nextSibling;
          while (n && n.nodeType === Node.TEXT_NODE) {
            node.textContent += n.textContent;
            root.removeChild(n);
            n = n.nextSibling;
          }
        }
        var childAnnotation = this._parseNodeAnnotations(node, list, callback);
        if (childAnnotation) {
          childAnnotation.parent = annote;
          childAnnotation.index = i;
        }
      }
    }
  },
  _parseTemplate: function _parseTemplate(node, index, list, parent) {
    var content = document.createDocumentFragment();
    content._notes = this.parseAnnotations(node);
    content.appendChild(node.content);
    list.push({
      bindings: Polymer.nar,
      events: Polymer.nar,
      templateContent: content,
      parent: parent,
      index: index
    });
  },
  _parseNodeAttributeAnnotations: function _parseNodeAttributeAnnotations(node, annotation) {
    for (var i = node.attributes.length - 1, a; a = node.attributes[i]; i--) {
      var n = a.name,
          v = a.value;
      if (n === 'id' && !this._testEscape(v)) {
        annotation.id = v;
      } else if (n.slice(0, 3) === 'on-') {
        node.removeAttribute(n);
        annotation.events.push({
          name: n.slice(3),
          value: v
        });
      } else {
        var b = this._parseNodeAttributeAnnotation(node, n, v);
        if (b) {
          annotation.bindings.push(b);
        }
      }
    }
  },
  _parseNodeAttributeAnnotation: function _parseNodeAttributeAnnotation(node, n, v) {
    var escape = this._testEscape(v);
    if (escape) {
      var customEvent;
      var name = n;
      var mode = escape[0];
      v = v.slice(2, -2).trim();
      var not = false;
      if (v[0] == '!') {
        v = v.substring(1);
        not = true;
      }
      var kind = 'property';
      if (n[n.length - 1] == '$') {
        name = n.slice(0, -1);
        kind = 'attribute';
      }
      var notifyEvent, colon;
      if (mode == '{' && (colon = v.indexOf('::')) > 0) {
        notifyEvent = v.substring(colon + 2);
        v = v.substring(0, colon);
        customEvent = true;
      }
      if (node.localName == 'input' && n == 'value') {
        node.setAttribute(n, '');
      }
      node.removeAttribute(n);
      if (kind === 'property') {
        name = Polymer.CaseMap.dashToCamelCase(name);
      }
      return {
        kind: kind,
        mode: mode,
        name: name,
        value: v,
        negate: not,
        event: notifyEvent,
        customEvent: customEvent
      };
    }
  },
  _localSubTree: function _localSubTree(node, host) {
    return node === host ? node.childNodes : node._lightChildren || node.childNodes;
  },
  findAnnotatedNode: function findAnnotatedNode(root, annote) {
    var parent = annote.parent && Polymer.Annotations.findAnnotatedNode(root, annote.parent);
    return !parent ? root : Polymer.Annotations._localSubTree(parent, root)[annote.index];
  }
};
(function () {
  function resolveCss(cssText, ownerDocument) {
    return cssText.replace(CSS_URL_RX, function (m, pre, url, post) {
      return pre + '\'' + resolve(url.replace(/["']/g, ''), ownerDocument) + '\'' + post;
    });
  }
  function resolveAttrs(element, ownerDocument) {
    for (var name in URL_ATTRS) {
      var a$ = URL_ATTRS[name];
      for (var i = 0, l = a$.length, a, at, v; i < l && (a = a$[i]); i++) {
        if (name === '*' || element.localName === name) {
          at = element.attributes[a];
          v = at && at.value;
          if (v && v.search(BINDING_RX) < 0) {
            at.value = a === 'style' ? resolveCss(v, ownerDocument) : resolve(v, ownerDocument);
          }
        }
      }
    }
  }
  function resolve(url, ownerDocument) {
    if (url && url[0] === '#') {
      return url;
    }
    var resolver = getUrlResolver(ownerDocument);
    resolver.href = url;
    return resolver.href || url;
  }
  var tempDoc;
  var tempDocBase;
  function resolveUrl(url, baseUri) {
    if (!tempDoc) {
      tempDoc = document.implementation.createHTMLDocument('temp');
      tempDocBase = tempDoc.createElement('base');
      tempDoc.head.appendChild(tempDocBase);
    }
    tempDocBase.href = baseUri;
    return resolve(url, tempDoc);
  }
  function getUrlResolver(ownerDocument) {
    return ownerDocument.__urlResolver || (ownerDocument.__urlResolver = ownerDocument.createElement('a'));
  }
  var CSS_URL_RX = /(url\()([^)]*)(\))/g;
  var URL_ATTRS = {
    '*': ['href', 'src', 'style', 'url'],
    form: ['action']
  };
  var BINDING_RX = /\{\{|\[\[/;
  Polymer.ResolveUrl = {
    resolveCss: resolveCss,
    resolveAttrs: resolveAttrs,
    resolveUrl: resolveUrl
  };
})();
Polymer.Base._addFeature({
  _prepAnnotations: function _prepAnnotations() {
    if (!this._template) {
      this._notes = [];
    } else {
      Polymer.Annotations.prepElement = this._prepElement.bind(this);
      if (this._template._content && this._template._content._notes) {
        this._notes = this._template._content._notes;
      } else {
        this._notes = Polymer.Annotations.parseAnnotations(this._template);
      }
      this._processAnnotations(this._notes);
      Polymer.Annotations.prepElement = null;
    }
  },
  _processAnnotations: function _processAnnotations(notes) {
    for (var i = 0; i < notes.length; i++) {
      var note = notes[i];
      for (var j = 0; j < note.bindings.length; j++) {
        var b = note.bindings[j];
        b.signature = this._parseMethod(b.value);
        if (!b.signature) {
          b.model = this._modelForPath(b.value);
        }
      }
      if (note.templateContent) {
        this._processAnnotations(note.templateContent._notes);
        var pp = note.templateContent._parentProps = this._discoverTemplateParentProps(note.templateContent._notes);
        var bindings = [];
        for (var prop in pp) {
          bindings.push({
            index: note.index,
            kind: 'property',
            mode: '{',
            name: '_parent_' + prop,
            model: prop,
            value: prop
          });
        }
        note.bindings = note.bindings.concat(bindings);
      }
    }
  },
  _discoverTemplateParentProps: function _discoverTemplateParentProps(notes) {
    var pp = {};
    notes.forEach(function (n) {
      n.bindings.forEach(function (b) {
        if (b.signature) {
          var args = b.signature.args;
          for (var k = 0; k < args.length; k++) {
            pp[args[k].model] = true;
          }
        } else {
          pp[b.model] = true;
        }
      });
      if (n.templateContent) {
        var tpp = n.templateContent._parentProps;
        Polymer.Base.mixin(pp, tpp);
      }
    });
    return pp;
  },
  _prepElement: function _prepElement(element) {
    Polymer.ResolveUrl.resolveAttrs(element, this._template.ownerDocument);
  },
  _findAnnotatedNode: Polymer.Annotations.findAnnotatedNode,
  _marshalAnnotationReferences: function _marshalAnnotationReferences() {
    if (this._template) {
      this._marshalIdNodes();
      this._marshalAnnotatedNodes();
      this._marshalAnnotatedListeners();
    }
  },
  _configureAnnotationReferences: function _configureAnnotationReferences() {
    this._configureTemplateContent();
  },
  _configureTemplateContent: function _configureTemplateContent() {
    this._notes.forEach(function (note, i) {
      if (note.templateContent) {
        this._nodes[i]._content = note.templateContent;
      }
    }, this);
  },
  _marshalIdNodes: function _marshalIdNodes() {
    this.$ = {};
    this._notes.forEach(function (a) {
      if (a.id) {
        this.$[a.id] = this._findAnnotatedNode(this.root, a);
      }
    }, this);
  },
  _marshalAnnotatedNodes: function _marshalAnnotatedNodes() {
    if (this._nodes) {
      this._nodes = this._nodes.map(function (a) {
        return this._findAnnotatedNode(this.root, a);
      }, this);
    }
  },
  _marshalAnnotatedListeners: function _marshalAnnotatedListeners() {
    this._notes.forEach(function (a) {
      if (a.events && a.events.length) {
        var node = this._findAnnotatedNode(this.root, a);
        a.events.forEach(function (e) {
          this.listen(node, e.name, e.value);
        }, this);
      }
    }, this);
  }
});
Polymer.Base._addFeature({
  listeners: {},
  _listenListeners: function _listenListeners(listeners) {
    var node, name, key;
    for (key in listeners) {
      if (key.indexOf('.') < 0) {
        node = this;
        name = key;
      } else {
        name = key.split('.');
        node = this.$[name[0]];
        name = name[1];
      }
      this.listen(node, name, listeners[key]);
    }
  },
  listen: function listen(node, eventName, methodName) {
    this._listen(node, eventName, this._createEventHandler(node, eventName, methodName));
  },
  _boundListenerKey: function _boundListenerKey(eventName, methodName) {
    return eventName + ':' + methodName;
  },
  _recordEventHandler: function _recordEventHandler(host, eventName, target, methodName, handler) {
    var hbl = host.__boundListeners;
    if (!hbl) {
      hbl = host.__boundListeners = new WeakMap();
    }
    var bl = hbl.get(target);
    if (!bl) {
      bl = {};
      hbl.set(target, bl);
    }
    var key = this._boundListenerKey(eventName, methodName);
    bl[key] = handler;
  },
  _recallEventHandler: function _recallEventHandler(host, eventName, target, methodName) {
    var hbl = host.__boundListeners;
    if (!hbl) {
      return;
    }
    var bl = hbl.get(target);
    if (!bl) {
      return;
    }
    var key = this._boundListenerKey(eventName, methodName);
    return bl[key];
  },
  _createEventHandler: function _createEventHandler(node, eventName, methodName) {
    var host = this;
    var handler = function handler(e) {
      if (host[methodName]) {
        host[methodName](e, e.detail);
      } else {
        host._warn(host._logf('_createEventHandler', 'listener method `' + methodName + '` not defined'));
      }
    };
    this._recordEventHandler(host, eventName, node, methodName, handler);
    return handler;
  },
  unlisten: function unlisten(node, eventName, methodName) {
    var handler = this._recallEventHandler(this, eventName, node, methodName);
    if (handler) {
      this._unlisten(node, eventName, handler);
    }
  },
  _listen: function _listen(node, eventName, handler) {
    node.addEventListener(eventName, handler);
  },
  _unlisten: function _unlisten(node, eventName, handler) {
    node.removeEventListener(eventName, handler);
  }
});
(function () {
  'use strict';
  var HAS_NATIVE_TA = typeof document.head.style.touchAction === 'string';
  var GESTURE_KEY = '__polymerGestures';
  var HANDLED_OBJ = '__polymerGesturesHandled';
  var TOUCH_ACTION = '__polymerGesturesTouchAction';
  var TAP_DISTANCE = 25;
  var TRACK_DISTANCE = 5;
  var TRACK_LENGTH = 2;
  var MOUSE_TIMEOUT = 2500;
  var MOUSE_EVENTS = ['mousedown', 'mousemove', 'mouseup', 'click'];
  var MOUSE_WHICH_TO_BUTTONS = [0, 1, 4, 2];
  var MOUSE_HAS_BUTTONS = (function () {
    try {
      return new MouseEvent('test', { buttons: 1 }).buttons === 1;
    } catch (e) {
      return false;
    }
  })();
  var IS_TOUCH_ONLY = navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/);
  var mouseCanceller = function mouseCanceller(mouseEvent) {
    mouseEvent[HANDLED_OBJ] = { skip: true };
    if (mouseEvent.type === 'click') {
      var path = Polymer.dom(mouseEvent).path;
      for (var i = 0; i < path.length; i++) {
        if (path[i] === POINTERSTATE.mouse.target) {
          return;
        }
      }
      mouseEvent.preventDefault();
      mouseEvent.stopPropagation();
    }
  };
  function setupTeardownMouseCanceller(setup) {
    for (var i = 0, en; i < MOUSE_EVENTS.length; i++) {
      en = MOUSE_EVENTS[i];
      if (setup) {
        document.addEventListener(en, mouseCanceller, true);
      } else {
        document.removeEventListener(en, mouseCanceller, true);
      }
    }
  }
  function ignoreMouse() {
    if (IS_TOUCH_ONLY) {
      return;
    }
    if (!POINTERSTATE.mouse.mouseIgnoreJob) {
      setupTeardownMouseCanceller(true);
    }
    var unset = function unset() {
      setupTeardownMouseCanceller();
      POINTERSTATE.mouse.target = null;
      POINTERSTATE.mouse.mouseIgnoreJob = null;
    };
    POINTERSTATE.mouse.mouseIgnoreJob = Polymer.Debounce(POINTERSTATE.mouse.mouseIgnoreJob, unset, MOUSE_TIMEOUT);
  }
  function hasLeftMouseButton(ev) {
    var type = ev.type;
    if (MOUSE_EVENTS.indexOf(type) === -1) {
      return false;
    }
    if (type === 'mousemove') {
      var buttons = ev.buttons === undefined ? 1 : ev.buttons;
      if (ev instanceof window.MouseEvent && !MOUSE_HAS_BUTTONS) {
        buttons = MOUSE_WHICH_TO_BUTTONS[ev.which] || 0;
      }
      return Boolean(buttons & 1);
    } else {
      var button = ev.button === undefined ? 0 : ev.button;
      return button === 0;
    }
  }
  function isSyntheticClick(ev) {
    if (ev.type === 'click') {
      if (ev.detail === 0) {
        return true;
      }
      var t = Gestures.findOriginalTarget(ev);
      var bcr = t.getBoundingClientRect();
      var x = ev.pageX,
          y = ev.pageY;
      return !(x >= bcr.left && x <= bcr.right && (y >= bcr.top && y <= bcr.bottom));
    }
    return false;
  }
  var POINTERSTATE = {
    mouse: {
      target: null,
      mouseIgnoreJob: null
    },
    touch: {
      x: 0,
      y: 0,
      id: -1,
      scrollDecided: false
    }
  };
  function firstTouchAction(ev) {
    var path = Polymer.dom(ev).path;
    var ta = 'auto';
    for (var i = 0, n; i < path.length; i++) {
      n = path[i];
      if (n[TOUCH_ACTION]) {
        ta = n[TOUCH_ACTION];
        break;
      }
    }
    return ta;
  }
  function trackDocument(stateObj, movefn, upfn) {
    stateObj.movefn = movefn;
    stateObj.upfn = upfn;
    document.addEventListener('mousemove', movefn);
    document.addEventListener('mouseup', upfn);
  }
  function untrackDocument(stateObj) {
    document.removeEventListener('mousemove', stateObj.movefn);
    document.removeEventListener('mouseup', stateObj.upfn);
  }
  var Gestures = {
    gestures: {},
    recognizers: [],
    deepTargetFind: function deepTargetFind(x, y) {
      var node = document.elementFromPoint(x, y);
      var next = node;
      while (next && next.shadowRoot) {
        next = next.shadowRoot.elementFromPoint(x, y);
        if (next) {
          node = next;
        }
      }
      return node;
    },
    findOriginalTarget: function findOriginalTarget(ev) {
      if (ev.path) {
        return ev.path[0];
      }
      return ev.target;
    },
    handleNative: function handleNative(ev) {
      var handled;
      var type = ev.type;
      var node = ev.currentTarget;
      var gobj = node[GESTURE_KEY];
      var gs = gobj[type];
      if (!gs) {
        return;
      }
      if (!ev[HANDLED_OBJ]) {
        ev[HANDLED_OBJ] = {};
        if (type.slice(0, 5) === 'touch') {
          var t = ev.changedTouches[0];
          if (type === 'touchstart') {
            if (ev.touches.length === 1) {
              POINTERSTATE.touch.id = t.identifier;
            }
          }
          if (POINTERSTATE.touch.id !== t.identifier) {
            return;
          }
          if (!HAS_NATIVE_TA) {
            if (type === 'touchstart' || type === 'touchmove') {
              Gestures.handleTouchAction(ev);
            }
          }
          if (type === 'touchend') {
            POINTERSTATE.mouse.target = Polymer.dom(ev).rootTarget;
            ignoreMouse(true);
          }
        }
      }
      handled = ev[HANDLED_OBJ];
      if (handled.skip) {
        return;
      }
      var recognizers = Gestures.recognizers;
      for (var i = 0, r; i < recognizers.length; i++) {
        r = recognizers[i];
        if (gs[r.name] && !handled[r.name]) {
          if (r.flow && r.flow.start.indexOf(ev.type) > -1) {
            if (r.reset) {
              r.reset();
            }
          }
        }
      }
      for (var i = 0, r; i < recognizers.length; i++) {
        r = recognizers[i];
        if (gs[r.name] && !handled[r.name]) {
          handled[r.name] = true;
          r[type](ev);
        }
      }
    },
    handleTouchAction: function handleTouchAction(ev) {
      var t = ev.changedTouches[0];
      var type = ev.type;
      if (type === 'touchstart') {
        POINTERSTATE.touch.x = t.clientX;
        POINTERSTATE.touch.y = t.clientY;
        POINTERSTATE.touch.scrollDecided = false;
      } else if (type === 'touchmove') {
        if (POINTERSTATE.touch.scrollDecided) {
          return;
        }
        POINTERSTATE.touch.scrollDecided = true;
        var ta = firstTouchAction(ev);
        var prevent = false;
        var dx = Math.abs(POINTERSTATE.touch.x - t.clientX);
        var dy = Math.abs(POINTERSTATE.touch.y - t.clientY);
        if (!ev.cancelable) {} else if (ta === 'none') {
          prevent = true;
        } else if (ta === 'pan-x') {
          prevent = dy > dx;
        } else if (ta === 'pan-y') {
          prevent = dx > dy;
        }
        if (prevent) {
          ev.preventDefault();
        } else {
          Gestures.prevent('track');
        }
      }
    },
    add: function add(node, evType, handler) {
      var recognizer = this.gestures[evType];
      var deps = recognizer.deps;
      var name = recognizer.name;
      var gobj = node[GESTURE_KEY];
      if (!gobj) {
        node[GESTURE_KEY] = gobj = {};
      }
      for (var i = 0, dep, gd; i < deps.length; i++) {
        dep = deps[i];
        if (IS_TOUCH_ONLY && MOUSE_EVENTS.indexOf(dep) > -1) {
          continue;
        }
        gd = gobj[dep];
        if (!gd) {
          gobj[dep] = gd = { _count: 0 };
        }
        if (gd._count === 0) {
          node.addEventListener(dep, this.handleNative);
        }
        gd[name] = (gd[name] || 0) + 1;
        gd._count = (gd._count || 0) + 1;
      }
      node.addEventListener(evType, handler);
      if (recognizer.touchAction) {
        this.setTouchAction(node, recognizer.touchAction);
      }
    },
    remove: function remove(node, evType, handler) {
      var recognizer = this.gestures[evType];
      var deps = recognizer.deps;
      var name = recognizer.name;
      var gobj = node[GESTURE_KEY];
      if (gobj) {
        for (var i = 0, dep, gd; i < deps.length; i++) {
          dep = deps[i];
          gd = gobj[dep];
          if (gd && gd[name]) {
            gd[name] = (gd[name] || 1) - 1;
            gd._count = (gd._count || 1) - 1;
          }
          if (gd._count === 0) {
            node.removeEventListener(dep, this.handleNative);
          }
        }
      }
      node.removeEventListener(evType, handler);
    },
    register: function register(recog) {
      this.recognizers.push(recog);
      for (var i = 0; i < recog.emits.length; i++) {
        this.gestures[recog.emits[i]] = recog;
      }
    },
    findRecognizerByEvent: function findRecognizerByEvent(evName) {
      for (var i = 0, r; i < this.recognizers.length; i++) {
        r = this.recognizers[i];
        for (var j = 0, n; j < r.emits.length; j++) {
          n = r.emits[j];
          if (n === evName) {
            return r;
          }
        }
      }
      return null;
    },
    setTouchAction: function setTouchAction(node, value) {
      if (HAS_NATIVE_TA) {
        node.style.touchAction = value;
      }
      node[TOUCH_ACTION] = value;
    },
    fire: function fire(target, type, detail) {
      var ev = Polymer.Base.fire(type, detail, {
        node: target,
        bubbles: true,
        cancelable: true
      });
      if (ev.defaultPrevented) {
        var se = detail.sourceEvent;
        if (se && se.preventDefault) {
          se.preventDefault();
        }
      }
    },
    prevent: function prevent(evName) {
      var recognizer = this.findRecognizerByEvent(evName);
      if (recognizer.info) {
        recognizer.info.prevent = true;
      }
    }
  };
  Gestures.register({
    name: 'downup',
    deps: ['mousedown', 'touchstart', 'touchend'],
    flow: {
      start: ['mousedown', 'touchstart'],
      end: ['mouseup', 'touchend']
    },
    emits: ['down', 'up'],
    info: {
      movefn: function movefn() {},
      upfn: function upfn() {}
    },
    reset: function reset() {
      untrackDocument(this.info);
    },
    mousedown: function mousedown(e) {
      if (!hasLeftMouseButton(e)) {
        return;
      }
      var t = Gestures.findOriginalTarget(e);
      var self = this;
      var movefn = function movefn(e) {
        if (!hasLeftMouseButton(e)) {
          self.fire('up', t, e);
          untrackDocument(self.info);
        }
      };
      var upfn = function upfn(e) {
        if (hasLeftMouseButton(e)) {
          self.fire('up', t, e);
        }
        untrackDocument(self.info);
      };
      trackDocument(this.info, movefn, upfn);
      this.fire('down', t, e);
    },
    touchstart: function touchstart(e) {
      this.fire('down', Gestures.findOriginalTarget(e), e.changedTouches[0]);
    },
    touchend: function touchend(e) {
      this.fire('up', Gestures.findOriginalTarget(e), e.changedTouches[0]);
    },
    fire: function fire(type, target, event) {
      var self = this;
      Gestures.fire(target, type, {
        x: event.clientX,
        y: event.clientY,
        sourceEvent: event,
        prevent: Gestures.prevent.bind(Gestures)
      });
    }
  });
  Gestures.register({
    name: 'track',
    touchAction: 'none',
    deps: ['mousedown', 'touchstart', 'touchmove', 'touchend'],
    flow: {
      start: ['mousedown', 'touchstart'],
      end: ['mouseup', 'touchend']
    },
    emits: ['track'],
    info: {
      x: 0,
      y: 0,
      state: 'start',
      started: false,
      moves: [],
      addMove: function addMove(move) {
        if (this.moves.length > TRACK_LENGTH) {
          this.moves.shift();
        }
        this.moves.push(move);
      },
      movefn: function movefn() {},
      upfn: function upfn() {},
      prevent: false
    },
    reset: function reset() {
      this.info.state = 'start';
      this.info.started = false;
      this.info.moves = [];
      this.info.x = 0;
      this.info.y = 0;
      this.info.prevent = false;
      untrackDocument(this.info);
    },
    hasMovedEnough: function hasMovedEnough(x, y) {
      if (this.info.prevent) {
        return false;
      }
      if (this.info.started) {
        return true;
      }
      var dx = Math.abs(this.info.x - x);
      var dy = Math.abs(this.info.y - y);
      return dx >= TRACK_DISTANCE || dy >= TRACK_DISTANCE;
    },
    mousedown: function mousedown(e) {
      if (!hasLeftMouseButton(e)) {
        return;
      }
      var t = Gestures.findOriginalTarget(e);
      var self = this;
      var movefn = function movefn(e) {
        var x = e.clientX,
            y = e.clientY;
        if (self.hasMovedEnough(x, y)) {
          self.info.state = self.info.started ? e.type === 'mouseup' ? 'end' : 'track' : 'start';
          self.info.addMove({
            x: x,
            y: y
          });
          if (!hasLeftMouseButton(e)) {
            self.info.state = 'end';
            untrackDocument(self.info);
          }
          self.fire(t, e);
          self.info.started = true;
        }
      };
      var upfn = function upfn(e) {
        if (self.info.started) {
          Gestures.prevent('tap');
          movefn(e);
        }
        untrackDocument(self.info);
      };
      trackDocument(this.info, movefn, upfn);
      this.info.x = e.clientX;
      this.info.y = e.clientY;
    },
    touchstart: function touchstart(e) {
      var ct = e.changedTouches[0];
      this.info.x = ct.clientX;
      this.info.y = ct.clientY;
    },
    touchmove: function touchmove(e) {
      var t = Gestures.findOriginalTarget(e);
      var ct = e.changedTouches[0];
      var x = ct.clientX,
          y = ct.clientY;
      if (this.hasMovedEnough(x, y)) {
        this.info.addMove({
          x: x,
          y: y
        });
        this.fire(t, ct);
        this.info.state = 'track';
        this.info.started = true;
      }
    },
    touchend: function touchend(e) {
      var t = Gestures.findOriginalTarget(e);
      var ct = e.changedTouches[0];
      if (this.info.started) {
        Gestures.prevent('tap');
        this.info.state = 'end';
        this.info.addMove({
          x: ct.clientX,
          y: ct.clientY
        });
        this.fire(t, ct);
      }
    },
    fire: function fire(target, touch) {
      var secondlast = this.info.moves[this.info.moves.length - 2];
      var lastmove = this.info.moves[this.info.moves.length - 1];
      var dx = lastmove.x - this.info.x;
      var dy = lastmove.y - this.info.y;
      var ddx,
          ddy = 0;
      if (secondlast) {
        ddx = lastmove.x - secondlast.x;
        ddy = lastmove.y - secondlast.y;
      }
      return Gestures.fire(target, 'track', {
        state: this.info.state,
        x: touch.clientX,
        y: touch.clientY,
        dx: dx,
        dy: dy,
        ddx: ddx,
        ddy: ddy,
        sourceEvent: touch,
        hover: function hover() {
          return Gestures.deepTargetFind(touch.clientX, touch.clientY);
        }
      });
    }
  });
  Gestures.register({
    name: 'tap',
    deps: ['mousedown', 'click', 'touchstart', 'touchend'],
    flow: {
      start: ['mousedown', 'touchstart'],
      end: ['click', 'touchend']
    },
    emits: ['tap'],
    info: {
      x: NaN,
      y: NaN,
      prevent: false
    },
    reset: function reset() {
      this.info.x = NaN;
      this.info.y = NaN;
      this.info.prevent = false;
    },
    save: function save(e) {
      this.info.x = e.clientX;
      this.info.y = e.clientY;
    },
    mousedown: function mousedown(e) {
      if (hasLeftMouseButton(e)) {
        this.save(e);
      }
    },
    click: function click(e) {
      if (hasLeftMouseButton(e)) {
        this.forward(e);
      }
    },
    touchstart: function touchstart(e) {
      this.save(e.changedTouches[0]);
    },
    touchend: function touchend(e) {
      this.forward(e.changedTouches[0]);
    },
    forward: function forward(e) {
      var dx = Math.abs(e.clientX - this.info.x);
      var dy = Math.abs(e.clientY - this.info.y);
      var t = Gestures.findOriginalTarget(e);
      if (isNaN(dx) || isNaN(dy) || dx <= TAP_DISTANCE && dy <= TAP_DISTANCE || isSyntheticClick(e)) {
        if (!this.info.prevent) {
          Gestures.fire(t, 'tap', {
            x: e.clientX,
            y: e.clientY,
            sourceEvent: e
          });
        }
      }
    }
  });
  var DIRECTION_MAP = {
    x: 'pan-x',
    y: 'pan-y',
    none: 'none',
    all: 'auto'
  };
  Polymer.Base._addFeature({
    _listen: function _listen(node, eventName, handler) {
      if (Gestures.gestures[eventName]) {
        Gestures.add(node, eventName, handler);
      } else {
        node.addEventListener(eventName, handler);
      }
    },
    _unlisten: function _unlisten(node, eventName, handler) {
      if (Gestures.gestures[eventName]) {
        Gestures.remove(node, eventName, handler);
      } else {
        node.removeEventListener(eventName, handler);
      }
    },
    setScrollDirection: function setScrollDirection(direction, node) {
      node = node || this;
      Gestures.setTouchAction(node, DIRECTION_MAP[direction] || 'auto');
    }
  });
  Polymer.Gestures = Gestures;
})();
Polymer.Async = {
  _currVal: 0,
  _lastVal: 0,
  _callbacks: [],
  _twiddleContent: 0,
  _twiddle: document.createTextNode(''),
  run: function run(callback, waitTime) {
    if (waitTime > 0) {
      return ~setTimeout(callback, waitTime);
    } else {
      this._twiddle.textContent = this._twiddleContent++;
      this._callbacks.push(callback);
      return this._currVal++;
    }
  },
  cancel: function cancel(handle) {
    if (handle < 0) {
      clearTimeout(~handle);
    } else {
      var idx = handle - this._lastVal;
      if (idx >= 0) {
        if (!this._callbacks[idx]) {
          throw 'invalid async handle: ' + handle;
        }
        this._callbacks[idx] = null;
      }
    }
  },
  _atEndOfMicrotask: function _atEndOfMicrotask() {
    var len = this._callbacks.length;
    for (var i = 0; i < len; i++) {
      var cb = this._callbacks[i];
      if (cb) {
        try {
          cb();
        } catch (e) {
          i++;
          this._callbacks.splice(0, i);
          this._lastVal += i;
          this._twiddle.textContent = this._twiddleContent++;
          throw e;
        }
      }
    }
    this._callbacks.splice(0, len);
    this._lastVal += len;
  }
};
new (window.MutationObserver || JsMutationObserver)(Polymer.Async._atEndOfMicrotask.bind(Polymer.Async)).observe(Polymer.Async._twiddle, { characterData: true });
Polymer.Debounce = (function () {
  var Async = Polymer.Async;
  var Debouncer = function Debouncer(context) {
    this.context = context;
    this.boundComplete = this.complete.bind(this);
  };
  Debouncer.prototype = {
    go: function go(callback, wait) {
      var h;
      this.finish = function () {
        Async.cancel(h);
      };
      h = Async.run(this.boundComplete, wait);
      this.callback = callback;
    },
    stop: function stop() {
      if (this.finish) {
        this.finish();
        this.finish = null;
      }
    },
    complete: function complete() {
      if (this.finish) {
        this.stop();
        this.callback.call(this.context);
      }
    }
  };
  function debounce(debouncer, callback, wait) {
    if (debouncer) {
      debouncer.stop();
    } else {
      debouncer = new Debouncer(this);
    }
    debouncer.go(callback, wait);
    return debouncer;
  }
  return debounce;
})();
Polymer.Base._addFeature({
  $$: function $$(slctr) {
    return Polymer.dom(this.root).querySelector(slctr);
  },
  toggleClass: function toggleClass(name, bool, node) {
    node = node || this;
    if (arguments.length == 1) {
      bool = !node.classList.contains(name);
    }
    if (bool) {
      Polymer.dom(node).classList.add(name);
    } else {
      Polymer.dom(node).classList.remove(name);
    }
  },
  toggleAttribute: function toggleAttribute(name, bool, node) {
    node = node || this;
    if (arguments.length == 1) {
      bool = !node.hasAttribute(name);
    }
    if (bool) {
      Polymer.dom(node).setAttribute(name, '');
    } else {
      Polymer.dom(node).removeAttribute(name);
    }
  },
  classFollows: function classFollows(name, toElement, fromElement) {
    if (fromElement) {
      Polymer.dom(fromElement).classList.remove(name);
    }
    if (toElement) {
      Polymer.dom(toElement).classList.add(name);
    }
  },
  attributeFollows: function attributeFollows(name, toElement, fromElement) {
    if (fromElement) {
      Polymer.dom(fromElement).removeAttribute(name);
    }
    if (toElement) {
      Polymer.dom(toElement).setAttribute(name, '');
    }
  },
  getContentChildNodes: function getContentChildNodes(slctr) {
    var content = Polymer.dom(this.root).querySelector(slctr || 'content');
    return content ? Polymer.dom(content).getDistributedNodes() : [];
  },
  getContentChildren: function getContentChildren(slctr) {
    return this.getContentChildNodes(slctr).filter(function (n) {
      return n.nodeType === Node.ELEMENT_NODE;
    });
  },
  fire: function fire(type, detail, options) {
    options = options || Polymer.nob;
    var node = options.node || this;
    var detail = detail === null || detail === undefined ? Polymer.nob : detail;
    var bubbles = options.bubbles === undefined ? true : options.bubbles;
    var cancelable = Boolean(options.cancelable);
    var event = new CustomEvent(type, {
      bubbles: Boolean(bubbles),
      cancelable: cancelable,
      detail: detail
    });
    node.dispatchEvent(event);
    return event;
  },
  async: function async(callback, waitTime) {
    return Polymer.Async.run(callback.bind(this), waitTime);
  },
  cancelAsync: function cancelAsync(handle) {
    Polymer.Async.cancel(handle);
  },
  arrayDelete: function arrayDelete(path, item) {
    var index;
    if (Array.isArray(path)) {
      index = path.indexOf(item);
      if (index >= 0) {
        return path.splice(index, 1);
      }
    } else {
      var arr = this.get(path);
      index = arr.indexOf(item);
      if (index >= 0) {
        return this.splice(path, index, 1);
      }
    }
  },
  transform: function transform(_transform, node) {
    node = node || this;
    node.style.webkitTransform = _transform;
    node.style.transform = _transform;
  },
  translate3d: function translate3d(x, y, z, node) {
    node = node || this;
    this.transform('translate3d(' + x + ',' + y + ',' + z + ')', node);
  },
  importHref: function importHref(href, onload, onerror) {
    var l = document.createElement('link');
    l.rel = 'import';
    l.href = href;
    if (onload) {
      l.onload = onload.bind(this);
    }
    if (onerror) {
      l.onerror = onerror.bind(this);
    }
    document.head.appendChild(l);
    return l;
  },
  create: function create(tag, props) {
    var elt = document.createElement(tag);
    if (props) {
      for (var n in props) {
        elt[n] = props[n];
      }
    }
    return elt;
  }
});
Polymer.Bind = {
  prepareModel: function prepareModel(model) {
    model._propertyEffects = {};
    model._bindListeners = [];
    Polymer.Base.mixin(model, this._modelApi);
  },
  _modelApi: {
    _notifyChange: function _notifyChange(property) {
      var eventName = Polymer.CaseMap.camelToDashCase(property) + '-changed';
      Polymer.Base.fire(eventName, { value: this[property] }, {
        bubbles: false,
        node: this
      });
    },
    _propertySetter: function _propertySetter(property, value, effects, fromAbove) {
      var old = this.__data__[property];
      if (old !== value && (old === old || value === value)) {
        this.__data__[property] = value;
        if (typeof value == 'object') {
          this._clearPath(property);
        }
        if (this._propertyChanged) {
          this._propertyChanged(property, value, old);
        }
        if (effects) {
          this._effectEffects(property, value, effects, old, fromAbove);
        }
      }
      return old;
    },
    __setProperty: function __setProperty(property, value, quiet, node) {
      node = node || this;
      var effects = node._propertyEffects && node._propertyEffects[property];
      if (effects) {
        node._propertySetter(property, value, effects, quiet);
      } else {
        node[property] = value;
      }
    },
    _effectEffects: function _effectEffects(property, value, effects, old, fromAbove) {
      effects.forEach(function (fx) {
        var fn = Polymer.Bind['_' + fx.kind + 'Effect'];
        if (fn) {
          fn.call(this, property, value, fx.effect, old, fromAbove);
        }
      }, this);
    },
    _clearPath: function _clearPath(path) {
      for (var prop in this.__data__) {
        if (prop.indexOf(path + '.') === 0) {
          this.__data__[prop] = undefined;
        }
      }
    }
  },
  ensurePropertyEffects: function ensurePropertyEffects(model, property) {
    var fx = model._propertyEffects[property];
    if (!fx) {
      fx = model._propertyEffects[property] = [];
    }
    return fx;
  },
  addPropertyEffect: function addPropertyEffect(model, property, kind, effect) {
    var fx = this.ensurePropertyEffects(model, property);
    fx.push({
      kind: kind,
      effect: effect
    });
  },
  createBindings: function createBindings(model) {
    var fx$ = model._propertyEffects;
    if (fx$) {
      for (var n in fx$) {
        var fx = fx$[n];
        fx.sort(this._sortPropertyEffects);
        this._createAccessors(model, n, fx);
      }
    }
  },
  _sortPropertyEffects: (function () {
    var EFFECT_ORDER = {
      'compute': 0,
      'annotation': 1,
      'computedAnnotation': 2,
      'reflect': 3,
      'notify': 4,
      'observer': 5,
      'complexObserver': 6,
      'function': 7
    };
    return function (a, b) {
      return EFFECT_ORDER[a.kind] - EFFECT_ORDER[b.kind];
    };
  })(),
  _createAccessors: function _createAccessors(model, property, effects) {
    var defun = {
      get: function get() {
        return this.__data__[property];
      }
    };
    var setter = function setter(value) {
      this._propertySetter(property, value, effects);
    };
    var info = model.getPropertyInfo && model.getPropertyInfo(property);
    if (info && info.readOnly) {
      if (!info.computed) {
        model['_set' + this.upper(property)] = setter;
      }
    } else {
      defun.set = setter;
    }
    Object.defineProperty(model, property, defun);
  },
  upper: function upper(name) {
    return name[0].toUpperCase() + name.substring(1);
  },
  _addAnnotatedListener: function _addAnnotatedListener(model, index, property, path, event) {
    var fn = this._notedListenerFactory(property, path, this._isStructured(path), this._isEventBogus);
    var eventName = event || Polymer.CaseMap.camelToDashCase(property) + '-changed';
    model._bindListeners.push({
      index: index,
      property: property,
      path: path,
      changedFn: fn,
      event: eventName
    });
  },
  _isStructured: function _isStructured(path) {
    return path.indexOf('.') > 0;
  },
  _isEventBogus: function _isEventBogus(e, target) {
    return e.path && e.path[0] !== target;
  },
  _notedListenerFactory: function _notedListenerFactory(property, path, isStructured, bogusTest) {
    return function (e, target) {
      if (!bogusTest(e, target)) {
        if (e.detail && e.detail.path) {
          this.notifyPath(this._fixPath(path, property, e.detail.path), e.detail.value);
        } else {
          var value = target[property];
          if (!isStructured) {
            this[path] = target[property];
          } else {
            if (this.__data__[path] != value) {
              this.set(path, value);
            }
          }
        }
      }
    };
  },
  prepareInstance: function prepareInstance(inst) {
    inst.__data__ = Object.create(null);
  },
  setupBindListeners: function setupBindListeners(inst) {
    inst._bindListeners.forEach(function (info) {
      var node = inst._nodes[info.index];
      node.addEventListener(info.event, inst._notifyListener.bind(inst, info.changedFn));
    });
  }
};
Polymer.Base.extend(Polymer.Bind, {
  _shouldAddListener: function _shouldAddListener(effect) {
    return effect.name && effect.mode === '{' && !effect.negate && effect.kind != 'attribute';
  },
  _annotationEffect: function _annotationEffect(source, value, effect) {
    if (source != effect.value) {
      value = this.get(effect.value);
      this.__data__[effect.value] = value;
    }
    var calc = effect.negate ? !value : value;
    if (!effect.customEvent || this._nodes[effect.index][effect.name] !== calc) {
      return this._applyEffectValue(calc, effect);
    }
  },
  _reflectEffect: function _reflectEffect(source) {
    this.reflectPropertyToAttribute(source);
  },
  _notifyEffect: function _notifyEffect(source, value, effect, old, fromAbove) {
    if (!fromAbove) {
      this._notifyChange(source);
    }
  },
  _functionEffect: function _functionEffect(source, value, fn, old, fromAbove) {
    fn.call(this, source, value, old, fromAbove);
  },
  _observerEffect: function _observerEffect(source, value, effect, old) {
    var fn = this[effect.method];
    if (fn) {
      fn.call(this, value, old);
    } else {
      this._warn(this._logf('_observerEffect', 'observer method `' + effect.method + '` not defined'));
    }
  },
  _complexObserverEffect: function _complexObserverEffect(source, value, effect) {
    var fn = this[effect.method];
    if (fn) {
      var args = Polymer.Bind._marshalArgs(this.__data__, effect, source, value);
      if (args) {
        fn.apply(this, args);
      }
    } else {
      this._warn(this._logf('_complexObserverEffect', 'observer method `' + effect.method + '` not defined'));
    }
  },
  _computeEffect: function _computeEffect(source, value, effect) {
    var args = Polymer.Bind._marshalArgs(this.__data__, effect, source, value);
    if (args) {
      var fn = this[effect.method];
      if (fn) {
        this.__setProperty(effect.property, fn.apply(this, args));
      } else {
        this._warn(this._logf('_computeEffect', 'compute method `' + effect.method + '` not defined'));
      }
    }
  },
  _annotatedComputationEffect: function _annotatedComputationEffect(source, value, effect) {
    var computedHost = this._rootDataHost || this;
    var fn = computedHost[effect.method];
    if (fn) {
      var args = Polymer.Bind._marshalArgs(this.__data__, effect, source, value);
      if (args) {
        var computedvalue = fn.apply(computedHost, args);
        if (effect.negate) {
          computedvalue = !computedvalue;
        }
        this._applyEffectValue(computedvalue, effect);
      }
    } else {
      computedHost._warn(computedHost._logf('_annotatedComputationEffect', 'compute method `' + effect.method + '` not defined'));
    }
  },
  _marshalArgs: function _marshalArgs(model, effect, path, value) {
    var values = [];
    var args = effect.args;
    for (var i = 0, l = args.length; i < l; i++) {
      var arg = args[i];
      var name = arg.name;
      var v;
      if (arg.literal) {
        v = arg.value;
      } else if (arg.structured) {
        v = Polymer.Base.get(name, model);
      } else {
        v = model[name];
      }
      if (args.length > 1 && v === undefined) {
        return;
      }
      if (arg.wildcard) {
        var baseChanged = name.indexOf(path + '.') === 0;
        var matches = effect.trigger.name.indexOf(name) === 0 && !baseChanged;
        values[i] = {
          path: matches ? path : name,
          value: matches ? value : v,
          base: v
        };
      } else {
        values[i] = v;
      }
    }
    return values;
  }
});
Polymer.Base._addFeature({
  _addPropertyEffect: function _addPropertyEffect(property, kind, effect) {
    Polymer.Bind.addPropertyEffect(this, property, kind, effect);
  },
  _prepEffects: function _prepEffects() {
    Polymer.Bind.prepareModel(this);
    this._addAnnotationEffects(this._notes);
  },
  _prepBindings: function _prepBindings() {
    Polymer.Bind.createBindings(this);
  },
  _addPropertyEffects: function _addPropertyEffects(properties) {
    if (properties) {
      for (var p in properties) {
        var prop = properties[p];
        if (prop.observer) {
          this._addObserverEffect(p, prop.observer);
        }
        if (prop.computed) {
          prop.readOnly = true;
          this._addComputedEffect(p, prop.computed);
        }
        if (prop.notify) {
          this._addPropertyEffect(p, 'notify');
        }
        if (prop.reflectToAttribute) {
          this._addPropertyEffect(p, 'reflect');
        }
        if (prop.readOnly) {
          Polymer.Bind.ensurePropertyEffects(this, p);
        }
      }
    }
  },
  _addComputedEffect: function _addComputedEffect(name, expression) {
    var sig = this._parseMethod(expression);
    sig.args.forEach(function (arg) {
      this._addPropertyEffect(arg.model, 'compute', {
        method: sig.method,
        args: sig.args,
        trigger: arg,
        property: name
      });
    }, this);
  },
  _addObserverEffect: function _addObserverEffect(property, observer) {
    this._addPropertyEffect(property, 'observer', {
      method: observer,
      property: property
    });
  },
  _addComplexObserverEffects: function _addComplexObserverEffects(observers) {
    if (observers) {
      observers.forEach(function (observer) {
        this._addComplexObserverEffect(observer);
      }, this);
    }
  },
  _addComplexObserverEffect: function _addComplexObserverEffect(observer) {
    var sig = this._parseMethod(observer);
    sig.args.forEach(function (arg) {
      this._addPropertyEffect(arg.model, 'complexObserver', {
        method: sig.method,
        args: sig.args,
        trigger: arg
      });
    }, this);
  },
  _addAnnotationEffects: function _addAnnotationEffects(notes) {
    this._nodes = [];
    notes.forEach(function (note) {
      var index = this._nodes.push(note) - 1;
      note.bindings.forEach(function (binding) {
        this._addAnnotationEffect(binding, index);
      }, this);
    }, this);
  },
  _addAnnotationEffect: function _addAnnotationEffect(note, index) {
    if (Polymer.Bind._shouldAddListener(note)) {
      Polymer.Bind._addAnnotatedListener(this, index, note.name, note.value, note.event);
    }
    if (note.signature) {
      this._addAnnotatedComputationEffect(note, index);
    } else {
      note.index = index;
      this._addPropertyEffect(note.model, 'annotation', note);
    }
  },
  _addAnnotatedComputationEffect: function _addAnnotatedComputationEffect(note, index) {
    var sig = note.signature;
    if (sig['static']) {
      this.__addAnnotatedComputationEffect('__static__', index, note, sig, null);
    } else {
      sig.args.forEach(function (arg) {
        if (!arg.literal) {
          this.__addAnnotatedComputationEffect(arg.model, index, note, sig, arg);
        }
      }, this);
    }
  },
  __addAnnotatedComputationEffect: function __addAnnotatedComputationEffect(property, index, note, sig, trigger) {
    this._addPropertyEffect(property, 'annotatedComputation', {
      index: index,
      kind: note.kind,
      property: note.name,
      negate: note.negate,
      method: sig.method,
      args: sig.args,
      trigger: trigger
    });
  },
  _parseMethod: function _parseMethod(expression) {
    var m = expression.match(/([^\s]+)\((.*)\)/);
    if (m) {
      var sig = {
        method: m[1],
        'static': true
      };
      if (m[2].trim()) {
        var args = m[2].replace(/\\,/g, '&comma;').split(',');
        return this._parseArgs(args, sig);
      } else {
        sig.args = Polymer.nar;
        return sig;
      }
    }
  },
  _parseArgs: function _parseArgs(argList, sig) {
    sig.args = argList.map(function (rawArg) {
      var arg = this._parseArg(rawArg);
      if (!arg.literal) {
        sig['static'] = false;
      }
      return arg;
    }, this);
    return sig;
  },
  _parseArg: function _parseArg(rawArg) {
    var arg = rawArg.trim().replace(/&comma;/g, ',').replace(/\\(.)/g, '$1');
    var a = {
      name: arg,
      model: this._modelForPath(arg)
    };
    var fc = arg[0];
    if (fc === '-') {
      fc = arg[1];
    }
    if (fc >= '0' && fc <= '9') {
      fc = '#';
    }
    switch (fc) {
      case '\'':
      case '"':
        a.value = arg.slice(1, -1);
        a.literal = true;
        break;
      case '#':
        a.value = Number(arg);
        a.literal = true;
        break;
    }
    if (!a.literal) {
      a.structured = arg.indexOf('.') > 0;
      if (a.structured) {
        a.wildcard = arg.slice(-2) == '.*';
        if (a.wildcard) {
          a.name = arg.slice(0, -2);
        }
      }
    }
    return a;
  },
  _marshalInstanceEffects: function _marshalInstanceEffects() {
    Polymer.Bind.prepareInstance(this);
    Polymer.Bind.setupBindListeners(this);
  },
  _applyEffectValue: function _applyEffectValue(value, info) {
    var node = this._nodes[info.index];
    var property = info.property || info.name || 'textContent';
    if (info.kind == 'attribute') {
      this.serializeValueToAttribute(value, property, node);
    } else {
      if (property === 'className') {
        value = this._scopeElementClass(node, value);
      }
      if (property === 'textContent' || node.localName == 'input' && property == 'value') {
        value = value == undefined ? '' : value;
      }
      return node[property] = value;
    }
  },
  _executeStaticEffects: function _executeStaticEffects() {
    if (this._propertyEffects.__static__) {
      this._effectEffects('__static__', null, this._propertyEffects.__static__);
    }
  }
});
Polymer.Base._addFeature({
  _setupConfigure: function _setupConfigure(initialConfig) {
    this._config = {};
    for (var i in initialConfig) {
      if (initialConfig[i] !== undefined) {
        this._config[i] = initialConfig[i];
      }
    }
    this._handlers = [];
  },
  _marshalAttributes: function _marshalAttributes() {
    this._takeAttributesToModel(this._config);
  },
  _attributeChangedImpl: function _attributeChangedImpl(name) {
    var model = this._clientsReadied ? this : this._config;
    this._setAttributeToProperty(model, name);
  },
  _configValue: function _configValue(name, value) {
    this._config[name] = value;
  },
  _beforeClientsReady: function _beforeClientsReady() {
    this._configure();
  },
  _configure: function _configure() {
    this._configureAnnotationReferences();
    this._aboveConfig = this.mixin({}, this._config);
    var config = {};
    this.behaviors.forEach(function (b) {
      this._configureProperties(b.properties, config);
    }, this);
    this._configureProperties(this.properties, config);
    this._mixinConfigure(config, this._aboveConfig);
    this._config = config;
    this._distributeConfig(this._config);
  },
  _configureProperties: function _configureProperties(properties, config) {
    for (var i in properties) {
      var c = properties[i];
      if (c.value !== undefined) {
        var value = c.value;
        if (typeof value == 'function') {
          value = value.call(this, this._config);
        }
        config[i] = value;
      }
    }
  },
  _mixinConfigure: function _mixinConfigure(a, b) {
    for (var prop in b) {
      if (!this.getPropertyInfo(prop).readOnly) {
        a[prop] = b[prop];
      }
    }
  },
  _distributeConfig: function _distributeConfig(config) {
    var fx$ = this._propertyEffects;
    if (fx$) {
      for (var p in config) {
        var fx = fx$[p];
        if (fx) {
          for (var i = 0, l = fx.length, x; i < l && (x = fx[i]); i++) {
            if (x.kind === 'annotation') {
              var node = this._nodes[x.effect.index];
              if (node._configValue) {
                var value = p === x.effect.value ? config[p] : this.get(x.effect.value, config);
                node._configValue(x.effect.name, value);
              }
            }
          }
        }
      }
    }
  },
  _afterClientsReady: function _afterClientsReady() {
    this._executeStaticEffects();
    this._applyConfig(this._config, this._aboveConfig);
    this._flushHandlers();
  },
  _applyConfig: function _applyConfig(config, aboveConfig) {
    for (var n in config) {
      if (this[n] === undefined) {
        this.__setProperty(n, config[n], n in aboveConfig);
      }
    }
  },
  _notifyListener: function _notifyListener(fn, e) {
    if (!this._clientsReadied) {
      this._queueHandler([fn, e, e.target]);
    } else {
      return fn.call(this, e, e.target);
    }
  },
  _queueHandler: function _queueHandler(args) {
    this._handlers.push(args);
  },
  _flushHandlers: function _flushHandlers() {
    var h$ = this._handlers;
    for (var i = 0, l = h$.length, h; i < l && (h = h$[i]); i++) {
      h[0].call(this, h[1], h[2]);
    }
  }
});
(function () {
  'use strict';
  Polymer.Base._addFeature({
    notifyPath: function notifyPath(path, value, fromAbove) {
      var old = this._propertySetter(path, value);
      if (old !== value && (old === old || value === value)) {
        this._pathEffector(path, value);
        if (!fromAbove) {
          this._notifyPath(path, value);
        }
        return true;
      }
    },
    _getPathParts: function _getPathParts(path) {
      if (Array.isArray(path)) {
        var parts = [];
        for (var i = 0; i < path.length; i++) {
          var args = path[i].toString().split('.');
          for (var j = 0; j < args.length; j++) {
            parts.push(args[j]);
          }
        }
        return parts;
      } else {
        return path.toString().split('.');
      }
    },
    set: function set(path, value, root) {
      var prop = root || this;
      var parts = this._getPathParts(path);
      var array;
      var last = parts[parts.length - 1];
      if (parts.length > 1) {
        for (var i = 0; i < parts.length - 1; i++) {
          var part = parts[i];
          prop = prop[part];
          if (array && parseInt(part) == part) {
            parts[i] = Polymer.Collection.get(array).getKey(prop);
          }
          if (!prop) {
            return;
          }
          array = Array.isArray(prop) ? prop : null;
        }
        if (array && parseInt(last) == last) {
          var coll = Polymer.Collection.get(array);
          var old = prop[last];
          var key = coll.getKey(old);
          parts[i] = key;
          coll.setItem(key, value);
        }
        prop[last] = value;
        if (!root) {
          this.notifyPath(parts.join('.'), value);
        }
      } else {
        prop[path] = value;
      }
    },
    get: function get(path, root) {
      var prop = root || this;
      var parts = this._getPathParts(path);
      var last = parts.pop();
      while (parts.length) {
        prop = prop[parts.shift()];
        if (!prop) {
          return;
        }
      }
      return prop[last];
    },
    _pathEffector: function _pathEffector(path, value) {
      var model = this._modelForPath(path);
      var fx$ = this._propertyEffects[model];
      if (fx$) {
        fx$.forEach(function (fx) {
          var fxFn = this['_' + fx.kind + 'PathEffect'];
          if (fxFn) {
            fxFn.call(this, path, value, fx.effect);
          }
        }, this);
      }
      if (this._boundPaths) {
        this._notifyBoundPaths(path, value);
      }
    },
    _annotationPathEffect: function _annotationPathEffect(path, value, effect) {
      if (effect.value === path || effect.value.indexOf(path + '.') === 0) {
        Polymer.Bind._annotationEffect.call(this, path, value, effect);
      } else if (path.indexOf(effect.value + '.') === 0 && !effect.negate) {
        var node = this._nodes[effect.index];
        if (node && node.notifyPath) {
          var p = this._fixPath(effect.name, effect.value, path);
          node.notifyPath(p, value, true);
        }
      }
    },
    _complexObserverPathEffect: function _complexObserverPathEffect(path, value, effect) {
      if (this._pathMatchesEffect(path, effect)) {
        Polymer.Bind._complexObserverEffect.call(this, path, value, effect);
      }
    },
    _computePathEffect: function _computePathEffect(path, value, effect) {
      if (this._pathMatchesEffect(path, effect)) {
        Polymer.Bind._computeEffect.call(this, path, value, effect);
      }
    },
    _annotatedComputationPathEffect: function _annotatedComputationPathEffect(path, value, effect) {
      if (this._pathMatchesEffect(path, effect)) {
        Polymer.Bind._annotatedComputationEffect.call(this, path, value, effect);
      }
    },
    _pathMatchesEffect: function _pathMatchesEffect(path, effect) {
      var effectArg = effect.trigger.name;
      return effectArg == path || effectArg.indexOf(path + '.') === 0 || effect.trigger.wildcard && path.indexOf(effectArg) === 0;
    },
    linkPaths: function linkPaths(to, from) {
      this._boundPaths = this._boundPaths || {};
      if (from) {
        this._boundPaths[to] = from;
      } else {
        this.unbindPath(to);
      }
    },
    unlinkPaths: function unlinkPaths(path) {
      if (this._boundPaths) {
        delete this._boundPaths[path];
      }
    },
    _notifyBoundPaths: function _notifyBoundPaths(path, value) {
      var from, to;
      for (var a in this._boundPaths) {
        var b = this._boundPaths[a];
        if (path.indexOf(a + '.') == 0) {
          from = a;
          to = b;
          break;
        }
        if (path.indexOf(b + '.') == 0) {
          from = b;
          to = a;
          break;
        }
      }
      if (from && to) {
        var p = this._fixPath(to, from, path);
        this.notifyPath(p, value);
      }
    },
    _fixPath: function _fixPath(property, root, path) {
      return property + path.slice(root.length);
    },
    _notifyPath: function _notifyPath(path, value) {
      var rootName = this._modelForPath(path);
      var dashCaseName = Polymer.CaseMap.camelToDashCase(rootName);
      var eventName = dashCaseName + this._EVENT_CHANGED;
      this.fire(eventName, {
        path: path,
        value: value
      }, { bubbles: false });
    },
    _modelForPath: function _modelForPath(path) {
      var dot = path.indexOf('.');
      return dot < 0 ? path : path.slice(0, dot);
    },
    _EVENT_CHANGED: '-changed',
    _notifySplice: function _notifySplice(array, path, index, added, removed) {
      var splices = [{
        index: index,
        addedCount: added,
        removed: removed,
        object: array,
        type: 'splice'
      }];
      var change = {
        keySplices: Polymer.Collection.applySplices(array, splices),
        indexSplices: splices
      };
      this.set(path + '.splices', change);
      if (added != removed.length) {
        this.notifyPath(path + '.length', array.length);
      }
      change.keySplices = null;
      change.indexSplices = null;
    },
    push: function push(path) {
      var array = this.get(path);
      var args = Array.prototype.slice.call(arguments, 1);
      var len = array.length;
      var ret = array.push.apply(array, args);
      if (args.length) {
        this._notifySplice(array, path, len, args.length, []);
      }
      return ret;
    },
    pop: function pop(path) {
      var array = this.get(path);
      var hadLength = Boolean(array.length);
      var args = Array.prototype.slice.call(arguments, 1);
      var ret = array.pop.apply(array, args);
      if (hadLength) {
        this._notifySplice(array, path, array.length, 0, [ret]);
      }
      return ret;
    },
    splice: function splice(path, start, deleteCount) {
      var array = this.get(path);
      if (start < 0) {
        start = array.length - Math.floor(-start);
      } else {
        start = Math.floor(start);
      }
      if (!start) {
        start = 0;
      }
      var args = Array.prototype.slice.call(arguments, 1);
      var ret = array.splice.apply(array, args);
      var addedCount = Math.max(args.length - 2, 0);
      if (addedCount || ret.length) {
        this._notifySplice(array, path, start, addedCount, ret);
      }
      return ret;
    },
    shift: function shift(path) {
      var array = this.get(path);
      var hadLength = Boolean(array.length);
      var args = Array.prototype.slice.call(arguments, 1);
      var ret = array.shift.apply(array, args);
      if (hadLength) {
        this._notifySplice(array, path, 0, 0, [ret]);
      }
      return ret;
    },
    unshift: function unshift(path) {
      var array = this.get(path);
      var args = Array.prototype.slice.call(arguments, 1);
      var ret = array.unshift.apply(array, args);
      if (args.length) {
        this._notifySplice(array, path, 0, args.length, []);
      }
      return ret;
    }
  });
})();
Polymer.Base._addFeature({
  resolveUrl: function resolveUrl(url) {
    var module = Polymer.DomModule['import'](this.is);
    var root = '';
    if (module) {
      var assetPath = module.getAttribute('assetpath') || '';
      root = Polymer.ResolveUrl.resolveUrl(assetPath, module.ownerDocument.baseURI);
    }
    return Polymer.ResolveUrl.resolveUrl(url, root);
  }
});
Polymer.CssParse = (function () {
  var api = {
    parse: function parse(text) {
      text = this._clean(text);
      return this._parseCss(this._lex(text), text);
    },
    _clean: function _clean(cssText) {
      return cssText.replace(this._rx.comments, '').replace(this._rx.port, '');
    },
    _lex: function _lex(text) {
      var root = {
        start: 0,
        end: text.length
      };
      var n = root;
      for (var i = 0, s = 0, l = text.length; i < l; i++) {
        switch (text[i]) {
          case this.OPEN_BRACE:
            if (!n.rules) {
              n.rules = [];
            }
            var p = n;
            var previous = p.rules[p.rules.length - 1];
            n = {
              start: i + 1,
              parent: p,
              previous: previous
            };
            p.rules.push(n);
            break;
          case this.CLOSE_BRACE:
            n.end = i + 1;
            n = n.parent || root;
            break;
        }
      }
      return root;
    },
    _parseCss: function _parseCss(node, text) {
      var t = text.substring(node.start, node.end - 1);
      node.parsedCssText = node.cssText = t.trim();
      if (node.parent) {
        var ss = node.previous ? node.previous.end : node.parent.start;
        t = text.substring(ss, node.start - 1);
        t = t.substring(t.lastIndexOf(';') + 1);
        var s = node.parsedSelector = node.selector = t.trim();
        node.atRule = s.indexOf(this.AT_START) === 0;
        if (node.atRule) {
          if (s.indexOf(this.MEDIA_START) === 0) {
            node.type = this.types.MEDIA_RULE;
          } else if (s.match(this._rx.keyframesRule)) {
            node.type = this.types.KEYFRAMES_RULE;
          }
        } else {
          if (s.indexOf(this.VAR_START) === 0) {
            node.type = this.types.MIXIN_RULE;
          } else {
            node.type = this.types.STYLE_RULE;
          }
        }
      }
      var r$ = node.rules;
      if (r$) {
        for (var i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
          this._parseCss(r, text);
        }
      }
      return node;
    },
    stringify: function stringify(node, preserveProperties, text) {
      text = text || '';
      var cssText = '';
      if (node.cssText || node.rules) {
        var r$ = node.rules;
        if (r$ && (preserveProperties || !this._hasMixinRules(r$))) {
          for (var i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
            cssText = this.stringify(r, preserveProperties, cssText);
          }
        } else {
          cssText = preserveProperties ? node.cssText : this.removeCustomProps(node.cssText);
          cssText = cssText.trim();
          if (cssText) {
            cssText = '  ' + cssText + '\n';
          }
        }
      }
      if (cssText) {
        if (node.selector) {
          text += node.selector + ' ' + this.OPEN_BRACE + '\n';
        }
        text += cssText;
        if (node.selector) {
          text += this.CLOSE_BRACE + '\n\n';
        }
      }
      return text;
    },
    _hasMixinRules: function _hasMixinRules(rules) {
      return rules[0].selector.indexOf(this.VAR_START) >= 0;
    },
    removeCustomProps: function removeCustomProps(cssText) {
      cssText = this.removeCustomPropAssignment(cssText);
      return this.removeCustomPropApply(cssText);
    },
    removeCustomPropAssignment: function removeCustomPropAssignment(cssText) {
      return cssText.replace(this._rx.customProp, '').replace(this._rx.mixinProp, '');
    },
    removeCustomPropApply: function removeCustomPropApply(cssText) {
      return cssText.replace(this._rx.mixinApply, '').replace(this._rx.varApply, '');
    },
    types: {
      STYLE_RULE: 1,
      KEYFRAMES_RULE: 7,
      MEDIA_RULE: 4,
      MIXIN_RULE: 1000
    },
    OPEN_BRACE: '{',
    CLOSE_BRACE: '}',
    _rx: {
      comments: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
      port: /@import[^;]*;/gim,
      customProp: /(?:^|[\s;])--[^;{]*?:[^{};]*?(?:[;\n]|$)/gim,
      mixinProp: /(?:^|[\s;])--[^;{]*?:[^{;]*?{[^}]*?}(?:[;\n]|$)?/gim,
      mixinApply: /@apply[\s]*\([^)]*?\)[\s]*(?:[;\n]|$)?/gim,
      varApply: /[^;:]*?:[^;]*var[^;]*(?:[;\n]|$)?/gim,
      keyframesRule: /^@[^\s]*keyframes/
    },
    VAR_START: '--',
    MEDIA_START: '@media',
    AT_START: '@'
  };
  return api;
})();
Polymer.StyleUtil = (function () {
  return {
    MODULE_STYLES_SELECTOR: 'style, link[rel=import][type~=css], template',
    INCLUDE_ATTR: 'include',
    toCssText: function toCssText(rules, callback, preserveProperties) {
      if (typeof rules === 'string') {
        rules = this.parser.parse(rules);
      }
      if (callback) {
        this.forEachStyleRule(rules, callback);
      }
      return this.parser.stringify(rules, preserveProperties);
    },
    forRulesInStyles: function forRulesInStyles(styles, callback) {
      if (styles) {
        for (var i = 0, l = styles.length, s; i < l && (s = styles[i]); i++) {
          this.forEachStyleRule(this.rulesForStyle(s), callback);
        }
      }
    },
    rulesForStyle: function rulesForStyle(style) {
      if (!style.__cssRules && style.textContent) {
        style.__cssRules = this.parser.parse(style.textContent);
      }
      return style.__cssRules;
    },
    clearStyleRules: function clearStyleRules(style) {
      style.__cssRules = null;
    },
    forEachStyleRule: function forEachStyleRule(node, callback) {
      if (!node) {
        return;
      }
      var s = node.parsedSelector;
      var skipRules = false;
      if (node.type === this.ruleTypes.STYLE_RULE) {
        callback(node);
      } else if (node.type === this.ruleTypes.KEYFRAMES_RULE || node.type === this.ruleTypes.MIXIN_RULE) {
        skipRules = true;
      }
      var r$ = node.rules;
      if (r$ && !skipRules) {
        for (var i = 0, l = r$.length, r; i < l && (r = r$[i]); i++) {
          this.forEachStyleRule(r, callback);
        }
      }
    },
    applyCss: function applyCss(cssText, moniker, target, afterNode) {
      var style = document.createElement('style');
      if (moniker) {
        style.setAttribute('scope', moniker);
      }
      style.textContent = cssText;
      target = target || document.head;
      if (!afterNode) {
        var n$ = target.querySelectorAll('style[scope]');
        afterNode = n$[n$.length - 1];
      }
      target.insertBefore(style, afterNode && afterNode.nextSibling || target.firstChild);
      return style;
    },
    cssFromModules: function cssFromModules(moduleIds, warnIfNotFound) {
      var modules = moduleIds.trim().split(' ');
      var cssText = '';
      for (var i = 0; i < modules.length; i++) {
        cssText += this.cssFromModule(modules[i], warnIfNotFound);
      }
      return cssText;
    },
    cssFromModule: function cssFromModule(moduleId, warnIfNotFound) {
      var m = Polymer.DomModule['import'](moduleId);
      if (m && !m._cssText) {
        m._cssText = this._cssFromElement(m);
      }
      if (!m && warnIfNotFound) {
        console.warn('Could not find style data in module named', moduleId);
      }
      return m && m._cssText || '';
    },
    _cssFromElement: function _cssFromElement(element) {
      var cssText = '';
      var content = element.content || element;
      var e$ = Array.prototype.slice.call(content.querySelectorAll(this.MODULE_STYLES_SELECTOR));
      for (var i = 0, e; i < e$.length; i++) {
        e = e$[i];
        if (e.localName === 'template') {
          cssText += this._cssFromElement(e);
        } else {
          if (e.localName === 'style') {
            var include = e.getAttribute(this.INCLUDE_ATTR);
            if (include) {
              cssText += this.cssFromModules(include, true);
            }
            e = e.__appliedElement || e;
            e.parentNode.removeChild(e);
            cssText += this.resolveCss(e.textContent, element.ownerDocument);
          } else if (e['import'] && e['import'].body) {
            cssText += this.resolveCss(e['import'].body.textContent, e['import']);
          }
        }
      }
      return cssText;
    },
    resolveCss: Polymer.ResolveUrl.resolveCss,
    parser: Polymer.CssParse,
    ruleTypes: Polymer.CssParse.types
  };
})();
Polymer.StyleTransformer = (function () {
  var nativeShadow = Polymer.Settings.useNativeShadow;
  var styleUtil = Polymer.StyleUtil;
  var api = {
    dom: function dom(node, scope, useAttr, shouldRemoveScope) {
      this._transformDom(node, scope || '', useAttr, shouldRemoveScope);
    },
    _transformDom: function _transformDom(node, selector, useAttr, shouldRemoveScope) {
      if (node.setAttribute) {
        this.element(node, selector, useAttr, shouldRemoveScope);
      }
      var c$ = Polymer.dom(node).childNodes;
      for (var i = 0; i < c$.length; i++) {
        this._transformDom(c$[i], selector, useAttr, shouldRemoveScope);
      }
    },
    element: function element(_element, scope, useAttr, shouldRemoveScope) {
      if (useAttr) {
        if (shouldRemoveScope) {
          _element.removeAttribute(SCOPE_NAME);
        } else {
          _element.setAttribute(SCOPE_NAME, scope);
        }
      } else {
        if (scope) {
          if (_element.classList) {
            if (shouldRemoveScope) {
              _element.classList.remove(SCOPE_NAME);
              _element.classList.remove(scope);
            } else {
              _element.classList.add(SCOPE_NAME);
              _element.classList.add(scope);
            }
          } else if (_element.getAttribute) {
            var c = _element.getAttribute(CLASS);
            if (shouldRemoveScope) {
              if (c) {
                _element.setAttribute(CLASS, c.replace(SCOPE_NAME, '').replace(scope, ''));
              }
            } else {
              _element.setAttribute(CLASS, c + (c ? ' ' : '') + SCOPE_NAME + ' ' + scope);
            }
          }
        }
      }
    },
    elementStyles: function elementStyles(element, callback) {
      var styles = element._styles;
      var cssText = '';
      for (var i = 0, l = styles.length, s, text; i < l && (s = styles[i]); i++) {
        var rules = styleUtil.rulesForStyle(s);
        cssText += nativeShadow ? styleUtil.toCssText(rules, callback) : this.css(rules, element.is, element['extends'], callback, element._scopeCssViaAttr) + '\n\n';
      }
      return cssText.trim();
    },
    css: function css(rules, scope, ext, callback, useAttr) {
      var hostScope = this._calcHostScope(scope, ext);
      scope = this._calcElementScope(scope, useAttr);
      var self = this;
      return styleUtil.toCssText(rules, function (rule) {
        if (!rule.isScoped) {
          self.rule(rule, scope, hostScope);
          rule.isScoped = true;
        }
        if (callback) {
          callback(rule, scope, hostScope);
        }
      });
    },
    _calcElementScope: function _calcElementScope(scope, useAttr) {
      if (scope) {
        return useAttr ? CSS_ATTR_PREFIX + scope + CSS_ATTR_SUFFIX : CSS_CLASS_PREFIX + scope;
      } else {
        return '';
      }
    },
    _calcHostScope: function _calcHostScope(scope, ext) {
      return ext ? '[is=' + scope + ']' : scope;
    },
    rule: function rule(_rule, scope, hostScope) {
      this._transformRule(_rule, this._transformComplexSelector, scope, hostScope);
    },
    _transformRule: function _transformRule(rule, transformer, scope, hostScope) {
      var p$ = rule.selector.split(COMPLEX_SELECTOR_SEP);
      for (var i = 0, l = p$.length, p; i < l && (p = p$[i]); i++) {
        p$[i] = transformer.call(this, p, scope, hostScope);
      }
      rule.selector = rule.transformedSelector = p$.join(COMPLEX_SELECTOR_SEP);
    },
    _transformComplexSelector: function _transformComplexSelector(selector, scope, hostScope) {
      var stop = false;
      var hostContext = false;
      var self = this;
      selector = selector.replace(SIMPLE_SELECTOR_SEP, function (m, c, s) {
        if (!stop) {
          var info = self._transformCompoundSelector(s, c, scope, hostScope);
          stop = stop || info.stop;
          hostContext = hostContext || info.hostContext;
          c = info.combinator;
          s = info.value;
        } else {
          s = s.replace(SCOPE_JUMP, ' ');
        }
        return c + s;
      });
      if (hostContext) {
        selector = selector.replace(HOST_CONTEXT_PAREN, function (m, pre, paren, post) {
          return pre + paren + ' ' + hostScope + post + COMPLEX_SELECTOR_SEP + ' ' + pre + hostScope + paren + post;
        });
      }
      return selector;
    },
    _transformCompoundSelector: function _transformCompoundSelector(selector, combinator, scope, hostScope) {
      var jumpIndex = selector.search(SCOPE_JUMP);
      var hostContext = false;
      if (selector.indexOf(HOST_CONTEXT) >= 0) {
        hostContext = true;
      } else if (selector.indexOf(HOST) >= 0) {
        selector = selector.replace(HOST_PAREN, function (m, host, paren) {
          return hostScope + paren;
        });
        selector = selector.replace(HOST, hostScope);
      } else if (jumpIndex !== 0) {
        selector = scope ? this._transformSimpleSelector(selector, scope) : selector;
      }
      if (selector.indexOf(CONTENT) >= 0) {
        combinator = '';
      }
      var stop;
      if (jumpIndex >= 0) {
        selector = selector.replace(SCOPE_JUMP, ' ');
        stop = true;
      }
      return {
        value: selector,
        combinator: combinator,
        stop: stop,
        hostContext: hostContext
      };
    },
    _transformSimpleSelector: function _transformSimpleSelector(selector, scope) {
      var p$ = selector.split(PSEUDO_PREFIX);
      p$[0] += scope;
      return p$.join(PSEUDO_PREFIX);
    },
    documentRule: function documentRule(rule) {
      rule.selector = rule.parsedSelector;
      this.normalizeRootSelector(rule);
      if (!nativeShadow) {
        this._transformRule(rule, this._transformDocumentSelector);
      }
    },
    normalizeRootSelector: function normalizeRootSelector(rule) {
      if (rule.selector === ROOT) {
        rule.selector = 'body';
      }
    },
    _transformDocumentSelector: function _transformDocumentSelector(selector) {
      return selector.match(SCOPE_JUMP) ? this._transformComplexSelector(selector, SCOPE_DOC_SELECTOR) : this._transformSimpleSelector(selector.trim(), SCOPE_DOC_SELECTOR);
    },
    SCOPE_NAME: 'style-scope'
  };
  var SCOPE_NAME = api.SCOPE_NAME;
  var SCOPE_DOC_SELECTOR = ':not([' + SCOPE_NAME + '])' + ':not(.' + SCOPE_NAME + ')';
  var COMPLEX_SELECTOR_SEP = ',';
  var SIMPLE_SELECTOR_SEP = /(^|[\s>+~]+)([^\s>+~]+)/g;
  var HOST = ':host';
  var ROOT = ':root';
  var HOST_PAREN = /(\:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/g;
  var HOST_CONTEXT = ':host-context';
  var HOST_CONTEXT_PAREN = /(.*)(?:\:host-context)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))(.*)/;
  var CONTENT = '::content';
  var SCOPE_JUMP = /\:\:content|\:\:shadow|\/deep\//;
  var CSS_CLASS_PREFIX = '.';
  var CSS_ATTR_PREFIX = '[' + SCOPE_NAME + '~=';
  var CSS_ATTR_SUFFIX = ']';
  var PSEUDO_PREFIX = ':';
  var CLASS = 'class';
  return api;
})();
Polymer.StyleExtends = (function () {
  var styleUtil = Polymer.StyleUtil;
  return {
    hasExtends: function hasExtends(cssText) {
      return Boolean(cssText.match(this.rx.EXTEND));
    },
    transform: function transform(style) {
      var rules = styleUtil.rulesForStyle(style);
      var self = this;
      styleUtil.forEachStyleRule(rules, function (rule) {
        var map = self._mapRule(rule);
        if (rule.parent) {
          var m;
          while (m = self.rx.EXTEND.exec(rule.cssText)) {
            var extend = m[1];
            var extendor = self._findExtendor(extend, rule);
            if (extendor) {
              self._extendRule(rule, extendor);
            }
          }
        }
        rule.cssText = rule.cssText.replace(self.rx.EXTEND, '');
      });
      return styleUtil.toCssText(rules, function (rule) {
        if (rule.selector.match(self.rx.STRIP)) {
          rule.cssText = '';
        }
      }, true);
    },
    _mapRule: function _mapRule(rule) {
      if (rule.parent) {
        var map = rule.parent.map || (rule.parent.map = {});
        var parts = rule.selector.split(',');
        for (var i = 0, p; i < parts.length; i++) {
          p = parts[i];
          map[p.trim()] = rule;
        }
        return map;
      }
    },
    _findExtendor: function _findExtendor(extend, rule) {
      return rule.parent && rule.parent.map && rule.parent.map[extend] || this._findExtendor(extend, rule.parent);
    },
    _extendRule: function _extendRule(target, source) {
      if (target.parent !== source.parent) {
        this._cloneAndAddRuleToParent(source, target.parent);
      }
      target['extends'] = target['extends'] || (target['extends'] = []);
      target['extends'].push(source);
      source.selector = source.selector.replace(this.rx.STRIP, '');
      source.selector = (source.selector && source.selector + ',\n') + target.selector;
      if (source['extends']) {
        source['extends'].forEach(function (e) {
          this._extendRule(target, e);
        }, this);
      }
    },
    _cloneAndAddRuleToParent: function _cloneAndAddRuleToParent(rule, parent) {
      rule = Object.create(rule);
      rule.parent = parent;
      if (rule['extends']) {
        rule['extends'] = rule['extends'].slice();
      }
      parent.rules.push(rule);
    },
    rx: {
      EXTEND: /@extends\(([^)]*)\)\s*?;/gim,
      STRIP: /%[^,]*$/
    }
  };
})();
(function () {
  var prepElement = Polymer.Base._prepElement;
  var nativeShadow = Polymer.Settings.useNativeShadow;
  var styleUtil = Polymer.StyleUtil;
  var styleTransformer = Polymer.StyleTransformer;
  var styleExtends = Polymer.StyleExtends;
  Polymer.Base._addFeature({
    _prepElement: function _prepElement(element) {
      if (this._encapsulateStyle) {
        styleTransformer.element(element, this.is, this._scopeCssViaAttr);
      }
      prepElement.call(this, element);
    },
    _prepStyles: function _prepStyles() {
      if (this._encapsulateStyle === undefined) {
        this._encapsulateStyle = !nativeShadow && Boolean(this._template);
      }
      this._styles = this._collectStyles();
      var cssText = styleTransformer.elementStyles(this);
      if (cssText && this._template) {
        var style = styleUtil.applyCss(cssText, this.is, nativeShadow ? this._template.content : null);
        if (!nativeShadow) {
          this._scopeStyle = style;
        }
      }
    },
    _collectStyles: function _collectStyles() {
      var styles = [];
      var cssText = '',
          m$ = this.styleModules;
      if (m$) {
        for (var i = 0, l = m$.length, m; i < l && (m = m$[i]); i++) {
          cssText += styleUtil.cssFromModule(m);
        }
      }
      cssText += styleUtil.cssFromModule(this.is);
      if (cssText) {
        var style = document.createElement('style');
        style.textContent = cssText;
        if (styleExtends.hasExtends(style.textContent)) {
          cssText = styleExtends.transform(style);
        }
        styles.push(style);
      }
      return styles;
    },
    _elementAdd: function _elementAdd(node) {
      if (this._encapsulateStyle) {
        if (node.__styleScoped) {
          node.__styleScoped = false;
        } else {
          styleTransformer.dom(node, this.is, this._scopeCssViaAttr);
        }
      }
    },
    _elementRemove: function _elementRemove(node) {
      if (this._encapsulateStyle) {
        styleTransformer.dom(node, this.is, this._scopeCssViaAttr, true);
      }
    },
    scopeSubtree: function scopeSubtree(container, shouldObserve) {
      if (nativeShadow) {
        return;
      }
      var self = this;
      var scopify = function scopify(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          node.className = self._scopeElementClass(node, node.className);
          var n$ = node.querySelectorAll('*');
          Array.prototype.forEach.call(n$, function (n) {
            n.className = self._scopeElementClass(n, n.className);
          });
        }
      };
      scopify(container);
      if (shouldObserve) {
        var mo = new MutationObserver(function (mxns) {
          mxns.forEach(function (m) {
            if (m.addedNodes) {
              for (var i = 0; i < m.addedNodes.length; i++) {
                scopify(m.addedNodes[i]);
              }
            }
          });
        });
        mo.observe(container, {
          childList: true,
          subtree: true
        });
        return mo;
      }
    }
  });
})();
Polymer.StyleProperties = (function () {
  'use strict';
  var nativeShadow = Polymer.Settings.useNativeShadow;
  var matchesSelector = Polymer.DomApi.matchesSelector;
  var styleUtil = Polymer.StyleUtil;
  var styleTransformer = Polymer.StyleTransformer;
  return {
    decorateStyles: function decorateStyles(styles) {
      var self = this,
          props = {};
      styleUtil.forRulesInStyles(styles, function (rule) {
        self.decorateRule(rule);
        self.collectPropertiesInCssText(rule.propertyInfo.cssText, props);
      });
      var names = [];
      for (var i in props) {
        names.push(i);
      }
      return names;
    },
    decorateRule: function decorateRule(rule) {
      if (rule.propertyInfo) {
        return rule.propertyInfo;
      }
      var info = {},
          properties = {};
      var hasProperties = this.collectProperties(rule, properties);
      if (hasProperties) {
        info.properties = properties;
        rule.rules = null;
      }
      info.cssText = this.collectCssText(rule);
      rule.propertyInfo = info;
      return info;
    },
    collectProperties: function collectProperties(rule, properties) {
      var info = rule.propertyInfo;
      if (info) {
        if (info.properties) {
          Polymer.Base.mixin(properties, info.properties);
          return true;
        }
      } else {
        var m,
            rx = this.rx.VAR_ASSIGN;
        var cssText = rule.parsedCssText;
        var any;
        while (m = rx.exec(cssText)) {
          properties[m[1]] = (m[2] || m[3]).trim();
          any = true;
        }
        return any;
      }
    },
    collectCssText: function collectCssText(rule) {
      var customCssText = '';
      var cssText = rule.parsedCssText;
      cssText = cssText.replace(this.rx.BRACKETED, '').replace(this.rx.VAR_ASSIGN, '');
      var parts = cssText.split(';');
      for (var i = 0, p; i < parts.length; i++) {
        p = parts[i];
        if (p.match(this.rx.MIXIN_MATCH) || p.match(this.rx.VAR_MATCH)) {
          customCssText += p + ';\n';
        }
      }
      return customCssText;
    },
    collectPropertiesInCssText: function collectPropertiesInCssText(cssText, props) {
      var m;
      while (m = this.rx.VAR_CAPTURE.exec(cssText)) {
        props[m[1]] = true;
        var def = m[2];
        if (def && def.match(this.rx.IS_VAR)) {
          props[def] = true;
        }
      }
    },
    reify: function reify(props) {
      var names = Object.getOwnPropertyNames(props);
      for (var i = 0, n; i < names.length; i++) {
        n = names[i];
        props[n] = this.valueForProperty(props[n], props);
      }
    },
    valueForProperty: function valueForProperty(property, props) {
      if (property) {
        if (property.indexOf(';') >= 0) {
          property = this.valueForProperties(property, props);
        } else {
          var self = this;
          var fn = function fn(all, prefix, value, fallback) {
            var propertyValue = self.valueForProperty(props[value], props) || (props[fallback] ? self.valueForProperty(props[fallback], props) : fallback);
            return prefix + (propertyValue || '');
          };
          property = property.replace(this.rx.VAR_MATCH, fn);
        }
      }
      return property && property.trim() || '';
    },
    valueForProperties: function valueForProperties(property, props) {
      var parts = property.split(';');
      for (var i = 0, p, m; i < parts.length; i++) {
        if (p = parts[i]) {
          m = p.match(this.rx.MIXIN_MATCH);
          if (m) {
            p = this.valueForProperty(props[m[1]], props);
          } else {
            var pp = p.split(':');
            if (pp[1]) {
              pp[1] = pp[1].trim();
              pp[1] = this.valueForProperty(pp[1], props) || pp[1];
            }
            p = pp.join(':');
          }
          parts[i] = p && p.lastIndexOf(';') === p.length - 1 ? p.slice(0, -1) : p || '';
        }
      }
      return parts.join(';');
    },
    applyProperties: function applyProperties(rule, props) {
      var output = '';
      if (!rule.propertyInfo) {
        this.decorateRule(rule);
      }
      if (rule.propertyInfo.cssText) {
        output = this.valueForProperties(rule.propertyInfo.cssText, props);
      }
      rule.cssText = output;
    },
    propertyDataFromStyles: function propertyDataFromStyles(styles, element) {
      var props = {},
          self = this;
      var o = [],
          i = 0;
      styleUtil.forRulesInStyles(styles, function (rule) {
        if (!rule.propertyInfo) {
          self.decorateRule(rule);
        }
        if (element && rule.propertyInfo.properties && matchesSelector.call(element, rule.transformedSelector || rule.parsedSelector)) {
          self.collectProperties(rule, props);
          addToBitMask(i, o);
        }
        i++;
      });
      return {
        properties: props,
        key: o
      };
    },
    scopePropertiesFromStyles: function scopePropertiesFromStyles(styles) {
      if (!styles._scopeStyleProperties) {
        styles._scopeStyleProperties = this.selectedPropertiesFromStyles(styles, this.SCOPE_SELECTORS);
      }
      return styles._scopeStyleProperties;
    },
    hostPropertiesFromStyles: function hostPropertiesFromStyles(styles) {
      if (!styles._hostStyleProperties) {
        styles._hostStyleProperties = this.selectedPropertiesFromStyles(styles, this.HOST_SELECTORS);
      }
      return styles._hostStyleProperties;
    },
    selectedPropertiesFromStyles: function selectedPropertiesFromStyles(styles, selectors) {
      var props = {},
          self = this;
      styleUtil.forRulesInStyles(styles, function (rule) {
        if (!rule.propertyInfo) {
          self.decorateRule(rule);
        }
        for (var i = 0; i < selectors.length; i++) {
          if (rule.parsedSelector === selectors[i]) {
            self.collectProperties(rule, props);
            return;
          }
        }
      });
      return props;
    },
    transformStyles: function transformStyles(element, properties, scopeSelector) {
      var self = this;
      var hostSelector = styleTransformer._calcHostScope(element.is, element['extends']);
      var rxHostSelector = element['extends'] ? '\\' + hostSelector.slice(0, -1) + '\\]' : hostSelector;
      var hostRx = new RegExp(this.rx.HOST_PREFIX + rxHostSelector + this.rx.HOST_SUFFIX);
      return styleTransformer.elementStyles(element, function (rule) {
        self.applyProperties(rule, properties);
        if (rule.cssText && !nativeShadow) {
          self._scopeSelector(rule, hostRx, hostSelector, element._scopeCssViaAttr, scopeSelector);
        }
      });
    },
    _scopeSelector: function _scopeSelector(rule, hostRx, hostSelector, viaAttr, scopeId) {
      rule.transformedSelector = rule.transformedSelector || rule.selector;
      var selector = rule.transformedSelector;
      var scope = viaAttr ? '[' + styleTransformer.SCOPE_NAME + '~=' + scopeId + ']' : '.' + scopeId;
      var parts = selector.split(',');
      for (var i = 0, l = parts.length, p; i < l && (p = parts[i]); i++) {
        parts[i] = p.match(hostRx) ? p.replace(hostSelector, hostSelector + scope) : scope + ' ' + p;
      }
      rule.selector = parts.join(',');
    },
    applyElementScopeSelector: function applyElementScopeSelector(element, selector, old, viaAttr) {
      var c = viaAttr ? element.getAttribute(styleTransformer.SCOPE_NAME) : element.className;
      var v = old ? c.replace(old, selector) : (c ? c + ' ' : '') + this.XSCOPE_NAME + ' ' + selector;
      if (c !== v) {
        if (viaAttr) {
          element.setAttribute(styleTransformer.SCOPE_NAME, v);
        } else {
          element.className = v;
        }
      }
    },
    applyElementStyle: function applyElementStyle(element, properties, selector, style) {
      var cssText = style ? style.textContent || '' : this.transformStyles(element, properties, selector);
      var s = element._customStyle;
      if (s && !nativeShadow && s !== style) {
        s._useCount--;
        if (s._useCount <= 0 && s.parentNode) {
          s.parentNode.removeChild(s);
        }
      }
      if (nativeShadow || (!style || !style.parentNode)) {
        if (nativeShadow && element._customStyle) {
          element._customStyle.textContent = cssText;
          style = element._customStyle;
        } else if (cssText) {
          style = styleUtil.applyCss(cssText, selector, nativeShadow ? element.root : null, element._scopeStyle);
        }
      }
      if (style) {
        style._useCount = style._useCount || 0;
        if (element._customStyle != style) {
          style._useCount++;
        }
        element._customStyle = style;
      }
      return style;
    },
    mixinCustomStyle: function mixinCustomStyle(props, customStyle) {
      var v;
      for (var i in customStyle) {
        v = customStyle[i];
        if (v || v === 0) {
          props[i] = v;
        }
      }
    },
    rx: {
      VAR_ASSIGN: /(?:^|[;\n]\s*)(--[\w-]*?):\s*(?:([^;{]*)|{([^}]*)})(?:(?=[;\n])|$)/gi,
      MIXIN_MATCH: /(?:^|\W+)@apply[\s]*\(([^)]*)\)/i,
      VAR_MATCH: /(^|\W+)var\([\s]*([^,)]*)[\s]*,?[\s]*((?:[^,)]*)|(?:[^;]*\([^;)]*\)))[\s]*?\)/gi,
      VAR_CAPTURE: /\([\s]*(--[^,\s)]*)(?:,[\s]*(--[^,\s)]*))?(?:\)|,)/gi,
      IS_VAR: /^--/,
      BRACKETED: /\{[^}]*\}/g,
      HOST_PREFIX: '(?:^|[^.#[:])',
      HOST_SUFFIX: '($|[.:[\\s>+~])'
    },
    HOST_SELECTORS: [':host'],
    SCOPE_SELECTORS: [':root'],
    XSCOPE_NAME: 'x-scope'
  };
  function addToBitMask(n, bits) {
    var o = parseInt(n / 32);
    var v = 1 << n % 32;
    bits[o] = (bits[o] || 0) | v;
  }
})();
(function () {
  Polymer.StyleCache = function () {
    this.cache = {};
  };
  Polymer.StyleCache.prototype = {
    MAX: 100,
    store: function store(is, data, keyValues, keyStyles) {
      data.keyValues = keyValues;
      data.styles = keyStyles;
      var s$ = this.cache[is] = this.cache[is] || [];
      s$.push(data);
      if (s$.length > this.MAX) {
        s$.shift();
      }
    },
    retrieve: function retrieve(is, keyValues, keyStyles) {
      var cache = this.cache[is];
      if (cache) {
        for (var i = cache.length - 1, data; i >= 0; i--) {
          data = cache[i];
          if (keyStyles === data.styles && this._objectsEqual(keyValues, data.keyValues)) {
            return data;
          }
        }
      }
    },
    clear: function clear() {
      this.cache = {};
    },
    _objectsEqual: function _objectsEqual(target, source) {
      var t, s;
      for (var i in target) {
        t = target[i], s = source[i];
        if (!(typeof t === 'object' && t ? this._objectsStrictlyEqual(t, s) : t === s)) {
          return false;
        }
      }
      if (Array.isArray(target)) {
        return target.length === source.length;
      }
      return true;
    },
    _objectsStrictlyEqual: function _objectsStrictlyEqual(target, source) {
      return this._objectsEqual(target, source) && this._objectsEqual(source, target);
    }
  };
})();
Polymer.StyleDefaults = (function () {
  var styleProperties = Polymer.StyleProperties;
  var styleUtil = Polymer.StyleUtil;
  var StyleCache = Polymer.StyleCache;
  var api = Object.defineProperties({
    _styles: [],
    _properties: null,
    customStyle: {},
    _styleCache: new StyleCache(),
    addStyle: function addStyle(style) {
      this._styles.push(style);
      this._properties = null;
    },

    _needsStyleProperties: function _needsStyleProperties() {},
    _computeStyleProperties: function _computeStyleProperties() {
      return this._styleProperties;
    },
    updateStyles: function updateStyles(properties) {
      this._properties = null;
      if (properties) {
        Polymer.Base.mixin(this.customStyle, properties);
      }
      this._styleCache.clear();
      for (var i = 0, s; i < this._styles.length; i++) {
        s = this._styles[i];
        s = s.__importElement || s;
        s._apply();
      }
    }
  }, {
    _styleProperties: {
      get: function get() {
        if (!this._properties) {
          styleProperties.decorateStyles(this._styles);
          this._styles._scopeStyleProperties = null;
          this._properties = styleProperties.scopePropertiesFromStyles(this._styles);
          styleProperties.mixinCustomStyle(this._properties, this.customStyle);
          styleProperties.reify(this._properties);
        }
        return this._properties;
      },
      configurable: true,
      enumerable: true
    }
  });
  return api;
})();
(function () {
  'use strict';
  var _serializeValueToAttribute = Polymer.Base.serializeValueToAttribute;
  var propertyUtils = Polymer.StyleProperties;
  var styleTransformer = Polymer.StyleTransformer;
  var styleUtil = Polymer.StyleUtil;
  var styleDefaults = Polymer.StyleDefaults;
  var nativeShadow = Polymer.Settings.useNativeShadow;
  Polymer.Base._addFeature({
    _prepStyleProperties: function _prepStyleProperties() {
      this._ownStylePropertyNames = this._styles ? propertyUtils.decorateStyles(this._styles) : [];
    },
    customStyle: {},
    _setupStyleProperties: function _setupStyleProperties() {
      this.customStyle = {};
    },
    _needsStyleProperties: function _needsStyleProperties() {
      return Boolean(this._ownStylePropertyNames && this._ownStylePropertyNames.length);
    },
    _beforeAttached: function _beforeAttached() {
      if (!this._scopeSelector && this._needsStyleProperties()) {
        this._updateStyleProperties();
      }
    },
    _findStyleHost: function _findStyleHost() {
      var e = this,
          root;
      while (root = Polymer.dom(e).getOwnerRoot()) {
        if (Polymer.isInstance(root.host)) {
          return root.host;
        }
        e = root.host;
      }
      return styleDefaults;
    },
    _updateStyleProperties: function _updateStyleProperties() {
      var info,
          scope = this._findStyleHost();
      if (!scope._styleCache) {
        scope._styleCache = new Polymer.StyleCache();
      }
      var scopeData = propertyUtils.propertyDataFromStyles(scope._styles, this);
      scopeData.key.customStyle = this.customStyle;
      info = scope._styleCache.retrieve(this.is, scopeData.key, this._styles);
      var scopeCached = Boolean(info);
      if (scopeCached) {
        this._styleProperties = info._styleProperties;
      } else {
        this._computeStyleProperties(scopeData.properties);
      }
      this._computeOwnStyleProperties();
      if (!scopeCached) {
        info = styleCache.retrieve(this.is, this._ownStyleProperties, this._styles);
      }
      var globalCached = Boolean(info) && !scopeCached;
      var style = this._applyStyleProperties(info);
      if (!scopeCached) {
        style = style && nativeShadow ? style.cloneNode(true) : style;
        info = {
          style: style,
          _scopeSelector: this._scopeSelector,
          _styleProperties: this._styleProperties
        };
        scopeData.key.customStyle = {};
        this.mixin(scopeData.key.customStyle, this.customStyle);
        scope._styleCache.store(this.is, info, scopeData.key, this._styles);
        if (!globalCached) {
          styleCache.store(this.is, Object.create(info), this._ownStyleProperties, this._styles);
        }
      }
    },
    _computeStyleProperties: function _computeStyleProperties(scopeProps) {
      var scope = this._findStyleHost();
      if (!scope._styleProperties) {
        scope._computeStyleProperties();
      }
      var props = Object.create(scope._styleProperties);
      this.mixin(props, propertyUtils.hostPropertiesFromStyles(this._styles));
      scopeProps = scopeProps || propertyUtils.propertyDataFromStyles(scope._styles, this).properties;
      this.mixin(props, scopeProps);
      this.mixin(props, propertyUtils.scopePropertiesFromStyles(this._styles));
      propertyUtils.mixinCustomStyle(props, this.customStyle);
      propertyUtils.reify(props);
      this._styleProperties = props;
    },
    _computeOwnStyleProperties: function _computeOwnStyleProperties() {
      var props = {};
      for (var i = 0, n; i < this._ownStylePropertyNames.length; i++) {
        n = this._ownStylePropertyNames[i];
        props[n] = this._styleProperties[n];
      }
      this._ownStyleProperties = props;
    },
    _scopeCount: 0,
    _applyStyleProperties: function _applyStyleProperties(info) {
      var oldScopeSelector = this._scopeSelector;
      this._scopeSelector = info ? info._scopeSelector : this.is + '-' + this.__proto__._scopeCount++;
      var style = propertyUtils.applyElementStyle(this, this._styleProperties, this._scopeSelector, info && info.style);
      if (!nativeShadow) {
        propertyUtils.applyElementScopeSelector(this, this._scopeSelector, oldScopeSelector, this._scopeCssViaAttr);
      }
      return style;
    },
    serializeValueToAttribute: function serializeValueToAttribute(value, attribute, node) {
      node = node || this;
      if (attribute === 'class' && !nativeShadow) {
        var host = node === this ? this.domHost || this.dataHost : this;
        if (host) {
          value = host._scopeElementClass(node, value);
        }
      }
      node = Polymer.dom(node);
      _serializeValueToAttribute.call(this, value, attribute, node);
    },
    _scopeElementClass: function _scopeElementClass(element, selector) {
      if (!nativeShadow && !this._scopeCssViaAttr) {
        selector += (selector ? ' ' : '') + SCOPE_NAME + ' ' + this.is + (element._scopeSelector ? ' ' + XSCOPE_NAME + ' ' + element._scopeSelector : '');
      }
      return selector;
    },
    updateStyles: function updateStyles(properties) {
      if (this.isAttached) {
        if (properties) {
          this.mixin(this.customStyle, properties);
        }
        if (this._needsStyleProperties()) {
          this._updateStyleProperties();
        } else {
          this._styleProperties = null;
        }
        if (this._styleCache) {
          this._styleCache.clear();
        }
        this._updateRootStyles();
      }
    },
    _updateRootStyles: function _updateRootStyles(root) {
      root = root || this.root;
      var c$ = Polymer.dom(root)._query(function (e) {
        return e.shadyRoot || e.shadowRoot;
      });
      for (var i = 0, l = c$.length, c; i < l && (c = c$[i]); i++) {
        if (c.updateStyles) {
          c.updateStyles();
        }
      }
    }
  });
  Polymer.updateStyles = function (properties) {
    styleDefaults.updateStyles(properties);
    Polymer.Base._updateRootStyles(document);
  };
  var styleCache = new Polymer.StyleCache();
  Polymer.customStyleCache = styleCache;
  var SCOPE_NAME = styleTransformer.SCOPE_NAME;
  var XSCOPE_NAME = propertyUtils.XSCOPE_NAME;
})();
Polymer.Base._addFeature({
  _registerFeatures: function _registerFeatures() {
    this._prepIs();
    this._prepAttributes();
    this._prepConstructor();
    this._prepTemplate();
    this._prepStyles();
    this._prepStyleProperties();
    this._prepAnnotations();
    this._prepEffects();
    this._prepBehaviors();
    this._prepBindings();
    this._prepShady();
  },
  _prepBehavior: function _prepBehavior(b) {
    this._addPropertyEffects(b.properties);
    this._addComplexObserverEffects(b.observers);
    this._addHostAttributes(b.hostAttributes);
  },
  _initFeatures: function _initFeatures() {
    this._poolContent();
    this._setupConfigure();
    this._setupStyleProperties();
    this._pushHost();
    this._stampTemplate();
    this._popHost();
    this._marshalAnnotationReferences();
    this._setupDebouncers();
    this._marshalInstanceEffects();
    this._marshalHostAttributes();
    this._marshalBehaviors();
    this._marshalAttributes();
    this._tryReady();
  },
  _marshalBehavior: function _marshalBehavior(b) {
    this._listenListeners(b.listeners);
  }
});
(function () {
  var nativeShadow = Polymer.Settings.useNativeShadow;
  var propertyUtils = Polymer.StyleProperties;
  var styleUtil = Polymer.StyleUtil;
  var cssParse = Polymer.CssParse;
  var styleDefaults = Polymer.StyleDefaults;
  var styleTransformer = Polymer.StyleTransformer;
  Polymer({
    is: 'custom-style',
    'extends': 'style',
    properties: { include: String },
    ready: function ready() {
      this._tryApply();
    },
    attached: function attached() {
      this._tryApply();
    },
    _tryApply: function _tryApply() {
      if (!this._appliesToDocument) {
        if (this.parentNode && this.parentNode.localName !== 'dom-module') {
          this._appliesToDocument = true;
          var e = this.__appliedElement || this;
          styleDefaults.addStyle(e);
          if (e.textContent || this.include) {
            this._apply();
          } else {
            var observer = new MutationObserver((function () {
              observer.disconnect();
              this._apply();
            }).bind(this));
            observer.observe(e, { childList: true });
          }
        }
      }
    },
    _apply: function _apply() {
      var e = this.__appliedElement || this;
      if (this.include) {
        e.textContent = styleUtil.cssFromModules(this.include, true) + e.textContent;
      }
      if (e.textContent) {
        styleUtil.forEachStyleRule(styleUtil.rulesForStyle(e), function (rule) {
          styleTransformer.documentRule(rule);
        });
        this._applyCustomProperties(e);
      }
    },
    _applyCustomProperties: function _applyCustomProperties(element) {
      this._computeStyleProperties();
      var props = this._styleProperties;
      var rules = styleUtil.rulesForStyle(element);
      element.textContent = styleUtil.toCssText(rules, function (rule) {
        var css = rule.cssText = rule.parsedCssText;
        if (rule.propertyInfo && rule.propertyInfo.cssText) {
          css = cssParse.removeCustomPropAssignment(css);
          rule.cssText = propertyUtils.valueForProperties(css, props);
        }
      });
    }
  });
})();
Polymer.Templatizer = {
  properties: { __hideTemplateChildren__: { observer: '_showHideChildren' } },
  _instanceProps: Polymer.nob,
  _parentPropPrefix: '_parent_',
  templatize: function templatize(template) {
    if (!template._content) {
      template._content = template.content;
    }
    if (template._content._ctor) {
      this.ctor = template._content._ctor;
      this._prepParentProperties(this.ctor.prototype, template);
      return;
    }
    var archetype = Object.create(Polymer.Base);
    this._customPrepAnnotations(archetype, template);
    archetype._prepEffects();
    this._customPrepEffects(archetype);
    archetype._prepBehaviors();
    archetype._prepBindings();
    this._prepParentProperties(archetype, template);
    archetype._notifyPath = this._notifyPathImpl;
    archetype._scopeElementClass = this._scopeElementClassImpl;
    archetype.listen = this._listenImpl;
    archetype._showHideChildren = this._showHideChildrenImpl;
    var _constructor = this._constructorImpl;
    var ctor = function TemplateInstance(model, host) {
      _constructor.call(this, model, host);
    };
    ctor.prototype = archetype;
    archetype.constructor = ctor;
    template._content._ctor = ctor;
    this.ctor = ctor;
  },
  _getRootDataHost: function _getRootDataHost() {
    return this.dataHost && this.dataHost._rootDataHost || this.dataHost;
  },
  _showHideChildrenImpl: function _showHideChildrenImpl(hide) {
    var c = this._children;
    for (var i = 0; i < c.length; i++) {
      var n = c[i];
      if (Boolean(hide) != Boolean(n.__hideTemplateChildren__)) {
        if (n.nodeType === Node.TEXT_NODE) {
          if (hide) {
            n.__polymerTextContent__ = n.textContent;
            n.textContent = '';
          } else {
            n.textContent = n.__polymerTextContent__;
          }
        } else if (n.style) {
          if (hide) {
            n.__polymerDisplay__ = n.style.display;
            n.style.display = 'none';
          } else {
            n.style.display = n.__polymerDisplay__;
          }
        }
      }
      n.__hideTemplateChildren__ = hide;
    }
  },
  _debounceTemplate: function _debounceTemplate(fn) {
    Polymer.dom.addDebouncer(this.debounce('_debounceTemplate', fn));
  },
  _flushTemplates: function _flushTemplates(debouncerExpired) {
    Polymer.dom.flush();
  },
  _customPrepEffects: function _customPrepEffects(archetype) {
    var parentProps = archetype._parentProps;
    for (var prop in parentProps) {
      archetype._addPropertyEffect(prop, 'function', this._createHostPropEffector(prop));
    }
    for (var prop in this._instanceProps) {
      archetype._addPropertyEffect(prop, 'function', this._createInstancePropEffector(prop));
    }
  },
  _customPrepAnnotations: function _customPrepAnnotations(archetype, template) {
    archetype._template = template;
    var c = template._content;
    if (!c._notes) {
      var rootDataHost = archetype._rootDataHost;
      if (rootDataHost) {
        Polymer.Annotations.prepElement = rootDataHost._prepElement.bind(rootDataHost);
      }
      c._notes = Polymer.Annotations.parseAnnotations(template);
      Polymer.Annotations.prepElement = null;
      this._processAnnotations(c._notes);
    }
    archetype._notes = c._notes;
    archetype._parentProps = c._parentProps;
  },
  _prepParentProperties: function _prepParentProperties(archetype, template) {
    var parentProps = this._parentProps = archetype._parentProps;
    if (this._forwardParentProp && parentProps) {
      var proto = archetype._parentPropProto;
      var prop;
      if (!proto) {
        for (prop in this._instanceProps) {
          delete parentProps[prop];
        }
        proto = archetype._parentPropProto = Object.create(null);
        if (template != this) {
          Polymer.Bind.prepareModel(proto);
        }
        for (prop in parentProps) {
          var parentProp = this._parentPropPrefix + prop;
          var effects = [{
            kind: 'function',
            effect: this._createForwardPropEffector(prop)
          }, { kind: 'notify' }];
          Polymer.Bind._createAccessors(proto, parentProp, effects);
        }
      }
      if (template != this) {
        Polymer.Bind.prepareInstance(template);
        template._forwardParentProp = this._forwardParentProp.bind(this);
      }
      this._extendTemplate(template, proto);
    }
  },
  _createForwardPropEffector: function _createForwardPropEffector(prop) {
    return function (source, value) {
      this._forwardParentProp(prop, value);
    };
  },
  _createHostPropEffector: function _createHostPropEffector(prop) {
    var prefix = this._parentPropPrefix;
    return function (source, value) {
      this.dataHost[prefix + prop] = value;
    };
  },
  _createInstancePropEffector: function _createInstancePropEffector(prop) {
    return function (source, value, old, fromAbove) {
      if (!fromAbove) {
        this.dataHost._forwardInstanceProp(this, prop, value);
      }
    };
  },
  _extendTemplate: function _extendTemplate(template, proto) {
    Object.getOwnPropertyNames(proto).forEach(function (n) {
      var val = template[n];
      var pd = Object.getOwnPropertyDescriptor(proto, n);
      Object.defineProperty(template, n, pd);
      if (val !== undefined) {
        template._propertySetter(n, val);
      }
    });
  },
  _showHideChildren: function _showHideChildren(hidden) {},
  _forwardInstancePath: function _forwardInstancePath(inst, path, value) {},
  _forwardInstanceProp: function _forwardInstanceProp(inst, prop, value) {},
  _notifyPathImpl: function _notifyPathImpl(path, value) {
    var dataHost = this.dataHost;
    var dot = path.indexOf('.');
    var root = dot < 0 ? path : path.slice(0, dot);
    dataHost._forwardInstancePath.call(dataHost, this, path, value);
    if (root in dataHost._parentProps) {
      dataHost.notifyPath(dataHost._parentPropPrefix + path, value);
    }
  },
  _pathEffector: function _pathEffector(path, value, fromAbove) {
    if (this._forwardParentPath) {
      if (path.indexOf(this._parentPropPrefix) === 0) {
        this._forwardParentPath(path.substring(8), value);
      }
    }
    Polymer.Base._pathEffector.apply(this, arguments);
  },
  _constructorImpl: function _constructorImpl(model, host) {
    this._rootDataHost = host._getRootDataHost();
    this._setupConfigure(model);
    this._pushHost(host);
    this.root = this.instanceTemplate(this._template);
    this.root.__noContent = !this._notes._hasContent;
    this.root.__styleScoped = true;
    this._popHost();
    this._marshalAnnotatedNodes();
    this._marshalInstanceEffects();
    this._marshalAnnotatedListeners();
    var children = [];
    for (var n = this.root.firstChild; n; n = n.nextSibling) {
      children.push(n);
      n._templateInstance = this;
    }
    this._children = children;
    if (host.__hideTemplateChildren__) {
      this._showHideChildren(true);
    }
    this._tryReady();
  },
  _listenImpl: function _listenImpl(node, eventName, methodName) {
    var model = this;
    var host = this._rootDataHost;
    var handler = host._createEventHandler(node, eventName, methodName);
    var decorated = function decorated(e) {
      e.model = model;
      handler(e);
    };
    host._listen(node, eventName, decorated);
  },
  _scopeElementClassImpl: function _scopeElementClassImpl(node, value) {
    var host = this._rootDataHost;
    if (host) {
      return host._scopeElementClass(node, value);
    }
  },
  stamp: function stamp(model) {
    model = model || {};
    if (this._parentProps) {
      for (var prop in this._parentProps) {
        model[prop] = this[this._parentPropPrefix + prop];
      }
    }
    return new this.ctor(model, this);
  },
  modelForElement: function modelForElement(el) {
    var model;
    while (el) {
      if (model = el._templateInstance) {
        if (model.dataHost != this) {
          el = model.dataHost;
        } else {
          return model;
        }
      } else {
        el = el.parentNode;
      }
    }
  }
};
Polymer({
  is: 'dom-template',
  'extends': 'template',
  behaviors: [Polymer.Templatizer],
  ready: function ready() {
    this.templatize(this);
  }
});
Polymer._collections = new WeakMap();
Polymer.Collection = function (userArray) {
  Polymer._collections.set(userArray, this);
  this.userArray = userArray;
  this.store = userArray.slice();
  this.initMap();
};
Polymer.Collection.prototype = {
  constructor: Polymer.Collection,
  initMap: function initMap() {
    var omap = this.omap = new WeakMap();
    var pmap = this.pmap = {};
    var s = this.store;
    for (var i = 0; i < s.length; i++) {
      var item = s[i];
      if (item && typeof item == 'object') {
        omap.set(item, i);
      } else {
        pmap[item] = i;
      }
    }
  },
  add: function add(item) {
    var key = this.store.push(item) - 1;
    if (item && typeof item == 'object') {
      this.omap.set(item, key);
    } else {
      this.pmap[item] = key;
    }
    return key;
  },
  removeKey: function removeKey(key) {
    this._removeFromMap(this.store[key]);
    delete this.store[key];
  },
  _removeFromMap: function _removeFromMap(item) {
    if (item && typeof item == 'object') {
      this.omap['delete'](item);
    } else {
      delete this.pmap[item];
    }
  },
  remove: function remove(item) {
    var key = this.getKey(item);
    this.removeKey(key);
    return key;
  },
  getKey: function getKey(item) {
    if (item && typeof item == 'object') {
      return this.omap.get(item);
    } else {
      return this.pmap[item];
    }
  },
  getKeys: function getKeys() {
    return Object.keys(this.store);
  },
  setItem: function setItem(key, item) {
    var old = this.store[key];
    if (old) {
      this._removeFromMap(old);
    }
    if (item && typeof item == 'object') {
      this.omap.set(item, key);
    } else {
      this.pmap[item] = key;
    }
    this.store[key] = item;
  },
  getItem: function getItem(key) {
    return this.store[key];
  },
  getItems: function getItems() {
    var items = [],
        store = this.store;
    for (var key in store) {
      items.push(store[key]);
    }
    return items;
  },
  _applySplices: function _applySplices(splices) {
    var keyMap = {},
        key,
        i;
    splices.forEach(function (s) {
      s.addedKeys = [];
      for (i = 0; i < s.removed.length; i++) {
        key = this.getKey(s.removed[i]);
        keyMap[key] = keyMap[key] ? null : -1;
      }
      for (i = 0; i < s.addedCount; i++) {
        var item = this.userArray[s.index + i];
        key = this.getKey(item);
        key = key === undefined ? this.add(item) : key;
        keyMap[key] = keyMap[key] ? null : 1;
        s.addedKeys.push(key);
      }
    }, this);
    var removed = [];
    var added = [];
    for (var key in keyMap) {
      if (keyMap[key] < 0) {
        this.removeKey(key);
        removed.push(key);
      }
      if (keyMap[key] > 0) {
        added.push(key);
      }
    }
    return [{
      removed: removed,
      added: added
    }];
  }
};
Polymer.Collection.get = function (userArray) {
  return Polymer._collections.get(userArray) || new Polymer.Collection(userArray);
};
Polymer.Collection.applySplices = function (userArray, splices) {
  var coll = Polymer._collections.get(userArray);
  return coll ? coll._applySplices(splices) : null;
};
Polymer({
  is: 'dom-repeat',
  'extends': 'template',
  properties: {
    items: { type: Array },
    as: {
      type: String,
      value: 'item'
    },
    indexAs: {
      type: String,
      value: 'index'
    },
    sort: {
      type: Function,
      observer: '_sortChanged'
    },
    filter: {
      type: Function,
      observer: '_filterChanged'
    },
    observe: {
      type: String,
      observer: '_observeChanged'
    },
    delay: Number
  },
  behaviors: [Polymer.Templatizer],
  observers: ['_itemsChanged(items.*)'],
  created: function created() {
    this._instances = [];
  },
  detached: function detached() {
    for (var i = 0; i < this._instances.length; i++) {
      this._detachRow(i);
    }
  },
  attached: function attached() {
    var parentNode = Polymer.dom(this).parentNode;
    for (var i = 0; i < this._instances.length; i++) {
      Polymer.dom(parentNode).insertBefore(this._instances[i].root, this);
    }
  },
  ready: function ready() {
    this._instanceProps = { __key__: true };
    this._instanceProps[this.as] = true;
    this._instanceProps[this.indexAs] = true;
    if (!this.ctor) {
      this.templatize(this);
    }
  },
  _sortChanged: function _sortChanged() {
    var dataHost = this._getRootDataHost();
    var sort = this.sort;
    this._sortFn = sort && (typeof sort == 'function' ? sort : function () {
      return dataHost[sort].apply(dataHost, arguments);
    });
    this._needFullRefresh = true;
    if (this.items) {
      this._debounceTemplate(this._render);
    }
  },
  _filterChanged: function _filterChanged() {
    var dataHost = this._getRootDataHost();
    var filter = this.filter;
    this._filterFn = filter && (typeof filter == 'function' ? filter : function () {
      return dataHost[filter].apply(dataHost, arguments);
    });
    this._needFullRefresh = true;
    if (this.items) {
      this._debounceTemplate(this._render);
    }
  },
  _observeChanged: function _observeChanged() {
    this._observePaths = this.observe && this.observe.replace('.*', '.').split(' ');
  },
  _itemsChanged: function _itemsChanged(change) {
    if (change.path == 'items') {
      if (Array.isArray(this.items)) {
        this.collection = Polymer.Collection.get(this.items);
      } else if (!this.items) {
        this.collection = null;
      } else {
        this._error(this._logf('dom-repeat', 'expected array for `items`,' + ' found', this.items));
      }
      this._keySplices = [];
      this._indexSplices = [];
      this._needFullRefresh = true;
      this._debounceTemplate(this._render);
    } else if (change.path == 'items.splices') {
      this._keySplices = this._keySplices.concat(change.value.keySplices);
      this._indexSplices = this._indexSplices.concat(change.value.indexSplices);
      this._debounceTemplate(this._render);
    } else {
      var subpath = change.path.slice(6);
      this._forwardItemPath(subpath, change.value);
      this._checkObservedPaths(subpath);
    }
  },
  _checkObservedPaths: function _checkObservedPaths(path) {
    if (this._observePaths) {
      path = path.substring(path.indexOf('.') + 1);
      var paths = this._observePaths;
      for (var i = 0; i < paths.length; i++) {
        if (path.indexOf(paths[i]) === 0) {
          this._needFullRefresh = true;
          if (this.delay) {
            this.debounce('render', this._render, this.delay);
          } else {
            this._debounceTemplate(this._render);
          }
          return;
        }
      }
    }
  },
  render: function render() {
    this._needFullRefresh = true;
    this._debounceTemplate(this._render);
    this._flushTemplates();
  },
  _render: function _render() {
    var c = this.collection;
    if (this._needFullRefresh) {
      this._applyFullRefresh();
      this._needFullRefresh = false;
    } else {
      if (this._sortFn) {
        this._applySplicesUserSort(this._keySplices);
      } else {
        if (this._filterFn) {
          this._applyFullRefresh();
        } else {
          this._applySplicesArrayOrder(this._indexSplices);
        }
      }
    }
    this._keySplices = [];
    this._indexSplices = [];
    var keyToIdx = this._keyToInstIdx = {};
    for (var i = 0; i < this._instances.length; i++) {
      var inst = this._instances[i];
      keyToIdx[inst.__key__] = i;
      inst.__setProperty(this.indexAs, i, true);
    }
    this.fire('dom-change');
  },
  _applyFullRefresh: function _applyFullRefresh() {
    var c = this.collection;
    var keys;
    if (this._sortFn) {
      keys = c ? c.getKeys() : [];
    } else {
      keys = [];
      var items = this.items;
      if (items) {
        for (var i = 0; i < items.length; i++) {
          keys.push(c.getKey(items[i]));
        }
      }
    }
    if (this._filterFn) {
      keys = keys.filter(function (a) {
        return this._filterFn(c.getItem(a));
      }, this);
    }
    if (this._sortFn) {
      keys.sort((function (a, b) {
        return this._sortFn(c.getItem(a), c.getItem(b));
      }).bind(this));
    }
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var inst = this._instances[i];
      if (inst) {
        inst.__setProperty('__key__', key, true);
        inst.__setProperty(this.as, c.getItem(key), true);
      } else {
        this._instances.push(this._insertRow(i, key));
      }
    }
    for (; i < this._instances.length; i++) {
      this._detachRow(i);
    }
    this._instances.splice(keys.length, this._instances.length - keys.length);
  },
  _keySort: function _keySort(a, b) {
    return this.collection.getKey(a) - this.collection.getKey(b);
  },
  _numericSort: function _numericSort(a, b) {
    return a - b;
  },
  _applySplicesUserSort: function _applySplicesUserSort(splices) {
    var c = this.collection;
    var instances = this._instances;
    var keyMap = {};
    var pool = [];
    var sortFn = this._sortFn || this._keySort.bind(this);
    splices.forEach(function (s) {
      for (var i = 0; i < s.removed.length; i++) {
        var key = s.removed[i];
        keyMap[key] = keyMap[key] ? null : -1;
      }
      for (var i = 0; i < s.added.length; i++) {
        var key = s.added[i];
        keyMap[key] = keyMap[key] ? null : 1;
      }
    }, this);
    var removedIdxs = [];
    var addedKeys = [];
    for (var key in keyMap) {
      if (keyMap[key] === -1) {
        removedIdxs.push(this._keyToInstIdx[key]);
      }
      if (keyMap[key] === 1) {
        addedKeys.push(key);
      }
    }
    if (removedIdxs.length) {
      removedIdxs.sort(this._numericSort);
      for (var i = removedIdxs.length - 1; i >= 0; i--) {
        var idx = removedIdxs[i];
        if (idx !== undefined) {
          pool.push(this._detachRow(idx));
          instances.splice(idx, 1);
        }
      }
    }
    if (addedKeys.length) {
      if (this._filterFn) {
        addedKeys = addedKeys.filter(function (a) {
          return this._filterFn(c.getItem(a));
        }, this);
      }
      addedKeys.sort((function (a, b) {
        return this._sortFn(c.getItem(a), c.getItem(b));
      }).bind(this));
      var start = 0;
      for (var i = 0; i < addedKeys.length; i++) {
        start = this._insertRowUserSort(start, addedKeys[i], pool);
      }
    }
  },
  _insertRowUserSort: function _insertRowUserSort(start, key, pool) {
    var c = this.collection;
    var item = c.getItem(key);
    var end = this._instances.length - 1;
    var idx = -1;
    var sortFn = this._sortFn || this._keySort.bind(this);
    while (start <= end) {
      var mid = start + end >> 1;
      var midKey = this._instances[mid].__key__;
      var cmp = sortFn(c.getItem(midKey), item);
      if (cmp < 0) {
        start = mid + 1;
      } else if (cmp > 0) {
        end = mid - 1;
      } else {
        idx = mid;
        break;
      }
    }
    if (idx < 0) {
      idx = end + 1;
    }
    this._instances.splice(idx, 0, this._insertRow(idx, key, pool));
    return idx;
  },
  _applySplicesArrayOrder: function _applySplicesArrayOrder(splices) {
    var pool = [];
    var c = this.collection;
    splices.forEach(function (s) {
      for (var i = 0; i < s.removed.length; i++) {
        var inst = this._detachRow(s.index + i);
        if (!inst.isPlaceholder) {
          pool.push(inst);
        }
      }
      this._instances.splice(s.index, s.removed.length);
      for (var i = 0; i < s.addedKeys.length; i++) {
        var inst = {
          isPlaceholder: true,
          key: s.addedKeys[i]
        };
        this._instances.splice(s.index + i, 0, inst);
      }
    }, this);
    for (var i = this._instances.length - 1; i >= 0; i--) {
      var inst = this._instances[i];
      if (inst.isPlaceholder) {
        this._instances[i] = this._insertRow(i, inst.key, pool, true);
      }
    }
  },
  _detachRow: function _detachRow(idx) {
    var inst = this._instances[idx];
    if (!inst.isPlaceholder) {
      var parentNode = Polymer.dom(this).parentNode;
      for (var i = 0; i < inst._children.length; i++) {
        var el = inst._children[i];
        Polymer.dom(inst.root).appendChild(el);
      }
    }
    return inst;
  },
  _insertRow: function _insertRow(idx, key, pool, replace) {
    var inst;
    if (inst = pool && pool.pop()) {
      inst.__setProperty(this.as, this.collection.getItem(key), true);
      inst.__setProperty('__key__', key, true);
    } else {
      inst = this._generateRow(idx, key);
    }
    var beforeRow = this._instances[replace ? idx + 1 : idx];
    var beforeNode = beforeRow ? beforeRow._children[0] : this;
    var parentNode = Polymer.dom(this).parentNode;
    Polymer.dom(parentNode).insertBefore(inst.root, beforeNode);
    return inst;
  },
  _generateRow: function _generateRow(idx, key) {
    var model = { __key__: key };
    model[this.as] = this.collection.getItem(key);
    model[this.indexAs] = idx;
    var inst = this.stamp(model);
    return inst;
  },
  _showHideChildren: function _showHideChildren(hidden) {
    for (var i = 0; i < this._instances.length; i++) {
      this._instances[i]._showHideChildren(hidden);
    }
  },
  _forwardInstanceProp: function _forwardInstanceProp(inst, prop, value) {
    if (prop == this.as) {
      var idx;
      if (this._sortFn || this._filterFn) {
        idx = this.items.indexOf(this.collection.getItem(inst.__key__));
      } else {
        idx = inst[this.indexAs];
      }
      this.set('items.' + idx, value);
    }
  },
  _forwardInstancePath: function _forwardInstancePath(inst, path, value) {
    if (path.indexOf(this.as + '.') === 0) {
      this.notifyPath('items.' + inst.__key__ + '.' + path.slice(this.as.length + 1), value);
    }
  },
  _forwardParentProp: function _forwardParentProp(prop, value) {
    this._instances.forEach(function (inst) {
      inst.__setProperty(prop, value, true);
    }, this);
  },
  _forwardParentPath: function _forwardParentPath(path, value) {
    this._instances.forEach(function (inst) {
      inst.notifyPath(path, value, true);
    }, this);
  },
  _forwardItemPath: function _forwardItemPath(path, value) {
    if (this._keyToInstIdx) {
      var dot = path.indexOf('.');
      var key = path.substring(0, dot < 0 ? path.length : dot);
      var idx = this._keyToInstIdx[key];
      var inst = this._instances[idx];
      if (inst) {
        if (dot >= 0) {
          path = this.as + '.' + path.substring(dot + 1);
          inst.notifyPath(path, value, true);
        } else {
          inst.__setProperty(this.as, value, true);
        }
      }
    }
  },
  itemForElement: function itemForElement(el) {
    var instance = this.modelForElement(el);
    return instance && instance[this.as];
  },
  keyForElement: function keyForElement(el) {
    var instance = this.modelForElement(el);
    return instance && instance.__key__;
  },
  indexForElement: function indexForElement(el) {
    var instance = this.modelForElement(el);
    return instance && instance[this.indexAs];
  }
});
Polymer({
  is: 'array-selector',
  properties: {
    items: {
      type: Array,
      observer: 'clearSelection'
    },
    multi: {
      type: Boolean,
      value: false,
      observer: 'clearSelection'
    },
    selected: {
      type: Object,
      notify: true
    },
    selectedItem: {
      type: Object,
      notify: true
    },
    toggle: {
      type: Boolean,
      value: false
    }
  },
  clearSelection: function clearSelection() {
    if (Array.isArray(this.selected)) {
      for (var i = 0; i < this.selected.length; i++) {
        this.unlinkPaths('selected.' + i);
      }
    } else {
      this.unlinkPaths('selected');
    }
    if (this.multi) {
      if (!this.selected || this.selected.length) {
        this.selected = [];
        this._selectedColl = Polymer.Collection.get(this.selected);
      }
    } else {
      this.selected = null;
      this._selectedColl = null;
    }
    this.selectedItem = null;
  },
  isSelected: function isSelected(item) {
    if (this.multi) {
      return this._selectedColl.getKey(item) !== undefined;
    } else {
      return this.selected == item;
    }
  },
  deselect: function deselect(item) {
    if (this.multi) {
      if (this.isSelected(item)) {
        var skey = this._selectedColl.getKey(item);
        this.arrayDelete('selected', item);
        this.unlinkPaths('selected.' + skey);
      }
    } else {
      this.selected = null;
      this.selectedItem = null;
      this.unlinkPaths('selected');
      this.unlinkPaths('selectedItem');
    }
  },
  select: function select(item) {
    var icol = Polymer.Collection.get(this.items);
    var key = icol.getKey(item);
    if (this.multi) {
      if (this.isSelected(item)) {
        if (this.toggle) {
          this.deselect(item);
        }
      } else {
        this.push('selected', item);
        skey = this._selectedColl.getKey(item);
        this.linkPaths('selected.' + skey, 'items.' + key);
      }
    } else {
      if (this.toggle && item == this.selected) {
        this.deselect();
      } else {
        this.selected = item;
        this.selectedItem = item;
        this.linkPaths('selected', 'items.' + key);
        this.linkPaths('selectedItem', 'items.' + key);
      }
    }
  }
});
Polymer({
  is: 'dom-if',
  'extends': 'template',
  properties: {
    'if': {
      type: Boolean,
      value: false,
      observer: '_queueRender'
    },
    restamp: {
      type: Boolean,
      value: false,
      observer: '_queueRender'
    }
  },
  behaviors: [Polymer.Templatizer],
  _queueRender: function _queueRender() {
    this._debounceTemplate(this._render);
  },
  detached: function detached() {
    this._teardownInstance();
  },
  attached: function attached() {
    if (this['if'] && this.ctor) {
      this.async(this._ensureInstance);
    }
  },
  render: function render() {
    this._flushTemplates();
  },
  _render: function _render() {
    if (this['if']) {
      if (!this.ctor) {
        this.templatize(this);
      }
      this._ensureInstance();
      this._showHideChildren();
    } else if (this.restamp) {
      this._teardownInstance();
    }
    if (!this.restamp && this._instance) {
      this._showHideChildren();
    }
    if (this['if'] != this._lastIf) {
      this.fire('dom-change');
      this._lastIf = this['if'];
    }
  },
  _ensureInstance: function _ensureInstance() {
    if (!this._instance) {
      this._instance = this.stamp();
      var root = this._instance.root;
      var parent = Polymer.dom(Polymer.dom(this).parentNode);
      parent.insertBefore(root, this);
    }
  },
  _teardownInstance: function _teardownInstance() {
    if (this._instance) {
      var c = this._instance._children;
      if (c) {
        var parent = Polymer.dom(Polymer.dom(c[0]).parentNode);
        c.forEach(function (n) {
          parent.removeChild(n);
        });
      }
      this._instance = null;
    }
  },
  _showHideChildren: function _showHideChildren() {
    var hidden = this.__hideTemplateChildren__ || !this['if'];
    if (this._instance) {
      this._instance._showHideChildren(hidden);
    }
  },
  _forwardParentProp: function _forwardParentProp(prop, value) {
    if (this._instance) {
      this._instance[prop] = value;
    }
  },
  _forwardParentPath: function _forwardParentPath(path, value) {
    if (this._instance) {
      this._instance.notifyPath(path, value, true);
    }
  }
});
Polymer({
  is: 'dom-bind',
  'extends': 'template',
  created: function created() {
    Polymer.RenderStatus.whenReady(this._markImportsReady.bind(this));
  },
  _ensureReady: function _ensureReady() {
    if (!this._readied) {
      this._readySelf();
    }
  },
  _markImportsReady: function _markImportsReady() {
    this._importsReady = true;
    this._ensureReady();
  },
  _registerFeatures: function _registerFeatures() {
    this._prepConstructor();
  },
  _insertChildren: function _insertChildren() {
    var parentDom = Polymer.dom(Polymer.dom(this).parentNode);
    parentDom.insertBefore(this.root, this);
  },
  _removeChildren: function _removeChildren() {
    if (this._children) {
      for (var i = 0; i < this._children.length; i++) {
        this.root.appendChild(this._children[i]);
      }
    }
  },
  _initFeatures: function _initFeatures() {},
  _scopeElementClass: function _scopeElementClass(element, selector) {
    if (this.dataHost) {
      return this.dataHost._scopeElementClass(element, selector);
    } else {
      return selector;
    }
  },
  _prepConfigure: function _prepConfigure() {
    var config = {};
    for (var prop in this._propertyEffects) {
      config[prop] = this[prop];
    }
    this._setupConfigure = this._setupConfigure.bind(this, config);
  },
  attached: function attached() {
    if (this._importsReady) {
      this.render();
    }
  },
  detached: function detached() {
    this._removeChildren();
  },
  render: function render() {
    this._ensureReady();
    if (!this._children) {
      this._template = this;
      this._prepAnnotations();
      this._prepEffects();
      this._prepBehaviors();
      this._prepConfigure();
      this._prepBindings();
      Polymer.Base._initFeatures.call(this);
      this._children = Array.prototype.slice.call(this.root.childNodes);
    }
    this._insertChildren();
    this.fire('dom-change');
  }
});
(function () {

  'use strict';

  var StockTicker = (function () {
    function StockTicker() {
      _classCallCheck(this, StockTicker);
    }

    _createClass(StockTicker, [{
      key: 'beforeRegister',
      value: function beforeRegister() {
        // Takes camelcase class name "StockTicker" -> "stock-ticker".
        var is = this.constructor.name.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();

        this.is = name;
        this.properties = {
          symbols: {
            type: Array,
            value: function value() {
              return [];
            },
            observer: '_updateQuotes'
          },
          tickers: {
            type: Array,
            value: function value() {
              return [];
            }
          }
        };
      }
    }, {
      key: '_updateQuotes',
      value: function _updateQuotes() {
        var _this = this;

        if (!this.symbols.length) {
          return;
        }

        var url = 'https://finance.google.com/finance/info?client=ig&q=' + this.symbols;
        url = 'http://crossorigin.me/' + url;

        fetch(url).then(function (resp) {
          return resp.text();
        }).then(function (text) {
          // Remove // prefix from response and parse as JSON.
          var tickers = JSON.parse(text.slice(text.indexOf('[')));
          _this.tickers = tickers;
        });
      }
    }, {
      key: '_computeColor',
      value: function _computeColor(gain) {
        return 'color:' + (gain >= 0 ? '#4CAF50' : '#F44336');
      }
    }, {
      key: '_computeArrow',
      value: function _computeArrow(gain) {
        return '' + (gain >= 0 ? '▲' : '▼');
      }
    }, {
      key: '_computeHref',
      value: function _computeHref(ticker) {
        return 'https://www.google.com/finance?q=' + ticker;
      }
    }, {
      key: '_computePoints',
      value: function _computePoints(points) {
        return Math.abs(points);
      }
    }, {
      key: '_computePercent',
      value: function _computePercent(percent) {
        return percent.slice(1);
      }
    }]);

    return StockTicker;
  })();

  Polymer(StockTicker);
})();
// Raw ES6 class w/ Custom ELements
//
// Features
// 1. Classes!
// 2. custom element lifecycle callbacks
// 3. shadow dom - created in the former
// 4. template strings (single and multiline)
// 5. let - logical scoping
// 6. for of loop
// 7. fetch() API
// 8. arrow functions
// 9. Custom elements document.register() - passed a class

'use strict';

var StockTicker = (function (_HTMLElement) {
  _inherits(StockTicker, _HTMLElement);

  function StockTicker() {
    _classCallCheck(this, StockTicker);

    _get(Object.getPrototypeOf(StockTicker.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(StockTicker, [{
    key: 'createdCallback',
    value: function createdCallback() {
      this.createShadowRoot().innerHTML = '\n      <style>\n        :host {\n          display: block;\n        }\n        h1, h3 {\n          margin: 0;\n          font-weight: 400;\n        }\n        h1 {\n          margin-right: 12px;\n        }\n        header {\n          display: flex;\n          align-items: center;\n        }\n        footer {\n          margin-top: 10px;\n          margin-bottom: 24px;\n          font-size: 12px;\n        }\n        a {\n          text-decoration: none;\n          color: currentColor;\n        }\n      </style>\n     <div id="quotes"><div>\n    ';
      this.updateQuotes();
    }
  }, {
    key: 'updateQuotes',
    value: function updateQuotes() {
      var _this2 = this;

      if (!this.symbols.length) {
        return;
      }

      var url = 'https://finance.google.com/finance/info?client=ig&q=' + this.symbols;
      url = 'http://crossorigin.me/' + url;

      return fetch(url).then(function (resp) {
        return resp.text();
      }).then(function (text) {
        var parsedText = text.slice(text.indexOf('['));
        var tickers = JSON.parse(parsedText);

        var html = '';
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = tickers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var t = _step.value;

            // Skip unknown symbols.
            if (!t.t) {
              continue;
            }

            var gain = t.c >= 0;
            var arrow = gain ? '&#9650;' : '&#9660;';
            var color = gain ? '#4CAF50' : '#F44336';

            html += '\n          <header>\n            <h1>' + t.t + ' - ' + t.l + '</h1>\n            <h3 style="color:' + color + '">\n              ' + arrow + ' ' + t.c.slice(1) + ' (' + Math.abs(t.cp) + '%)\n            </h3>\n          </header>\n        ';

            if (t.ec) {
              var _gain = t.ec >= 0;
              var _arrow = _gain ? '&#9650;' : '&#9660;';
              var _color = _gain ? '#4CAF50' : '#F44336';

              html += '\n            <div>\n              <span>After-hours: ' + t.el + '</span>\n              <span style="color:' + _color + '">\n                ' + _arrow + ' ' + t.ec.slice(1) + ' (' + Math.abs(t.ecp) + '%)\n              </span>\n            </div>\n          ';
            }

            html += '\n          <footer>' + t.e + ' - data provided by\n            <a href="https://www.google.com/finance?q=' + t.t + '" target="_blank">Google Finance</a>\n          </footer>\n        ';
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        _this2.shadowRoot.lastElementChild.innerHTML = html;

        return tickers;
      });
    }
  }, {
    key: 'symbols',
    get: function get() {
      var s = this.getAttribute('symbols');
      return s ? JSON.parse(s) : [];
    },
    set: function set(val) {
      this.setAttribute('symbols', JSON.stringify(val));
      this.updateQuotes();
    }
  }], [{
    key: 'is',
    get: function get() {
      return 'stock-ticker-raw';
    }
  }]);

  return StockTicker;
})(HTMLElement);

document.registerElement(StockTicker.is, StockTicker);
//'use strict';

// let b = document.querySelector('button');
// b.addEventListener('click', e => {
//   let el = document.querySelector('stock-ticker');
//   el.symbols = ['MSFT'];
// });
