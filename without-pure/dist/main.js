(() => {
  "use strict";
  var t,
    e = {
      894: (t, e, i) => {
        i.d(e, { ts: () => o }), (t = i.hmd(t));
        const r = (() => {
            const e = (t, e) => Object.prototype.hasOwnProperty.call(t, e);
            let r;
            !(function (t) {
              (t[(t.GROUP = 1)] = "GROUP"),
                (t[(t.CAT = 2)] = "CAT"),
                (t[(t.SYMBOL = 3)] = "SYMBOL"),
                (t[(t.OR = 4)] = "OR"),
                (t[(t.STAR = 5)] = "STAR"),
                (t[(t.LITERAL = 6)] = "LITERAL"),
                (t[(t.SLASH = 7)] = "SLASH"),
                (t[(t.DOT = 8)] = "DOT");
            })(r || (r = {}));
            const o = "undefined" != typeof window,
              n = {
                CJS: {
                  define(e) {
                    t.exports = e;
                  },
                  isSupported: () => !0,
                },
                AMD: {
                  define(t) {
                    define([], function () {
                      return t;
                    });
                  },
                  isSupported: () => "function" == typeof define && !!i.amdO,
                },
                UMD: {
                  define(t) {
                    if (n.AMD.isSupported()) n.AMD.define(t);
                    else if (n.CJS.isSupported())
                      try {
                        n.CJS.define(t);
                      } catch (t) {
                        if ("TypeError" !== t.name) throw t;
                      }
                  },
                  isSupported: () => n.AMD.isSupported() || n.CJS.isSupported(),
                },
                ESM: { define() {}, isSupported: () => !0 },
                NIL: { define() {}, isSupported: () => !0 },
                DTS: {
                  define(t) {
                    n.ESM.define(t);
                  },
                  isSupported: () => n.ESM.isSupported(),
                },
              };
            class s extends Error {
              constructor(...t) {
                super(`Route missing required keys: ${t.join(", ")}`),
                  (this.keys = t),
                  Object.setPrototypeOf(this, Object.getPrototypeOf(this)),
                  (this.name = s.name);
              }
            }
            const a = /[^a-zA-Z0-9\-._~!$&'()*+,;=:@]/g,
              l = [
                "anchor",
                "trailing_slash",
                "subdomain",
                "host",
                "port",
                "protocol",
              ],
              u = new (class {
                constructor() {
                  this.configuration = {
                    prefix: "",
                    default_url_options: {},
                    special_options_key: "_options",
                    serializer: this.default_serializer.bind(this),
                  };
                }
                default_serializer(t, i) {
                  if (this.is_nullable(t)) return "";
                  if (!i && !this.is_object(t))
                    throw new Error(
                      "Url parameters should be a javascript hash",
                    );
                  i = i || "";
                  const r = [];
                  if (this.is_array(t))
                    for (const e of t)
                      r.push(this.default_serializer(e, i + "[]"));
                  else if (this.is_object(t))
                    for (let o in t) {
                      if (!e(t, o)) continue;
                      let n = t[o];
                      this.is_nullable(n) && i && (n = ""),
                        this.is_not_nullable(n) &&
                          (i && (o = i + "[" + o + "]"),
                          r.push(this.default_serializer(n, o)));
                    }
                  else
                    this.is_not_nullable(t) &&
                      r.push(
                        encodeURIComponent(i) +
                          "=" +
                          encodeURIComponent("" + t),
                      );
                  return r.join("&");
                }
                serialize(t) {
                  return this.configuration.serializer(t);
                }
                extract_options(t, e) {
                  const i = e[e.length - 1];
                  return (e.length > t && 0 === i) ||
                    (this.is_object(i) && !this.looks_like_serialized_model(i))
                    ? (this.is_object(i) &&
                        delete i[this.configuration.special_options_key],
                      { args: e.slice(0, e.length - 1), options: i })
                    : { args: e, options: {} };
                }
                looks_like_serialized_model(t) {
                  return (
                    this.is_object(t) &&
                    !(this.configuration.special_options_key in t) &&
                    ("id" in t || "to_param" in t || "toParam" in t)
                  );
                }
                path_identifier(t) {
                  const e = this.unwrap_path_identifier(t);
                  return this.is_nullable(e) || !1 === e ? "" : "" + e;
                }
                unwrap_path_identifier(t) {
                  let e = t;
                  return this.is_object(t)
                    ? ((e =
                        "to_param" in t
                          ? t.to_param
                          : "toParam" in t
                          ? t.toParam
                          : "id" in t
                          ? t.id
                          : t),
                      this.is_callable(e) ? e.call(t) : e)
                    : t;
                }
                partition_parameters(t, i, r, o) {
                  let { args: n, options: s } = this.extract_options(
                    t.length,
                    o,
                  );
                  if (n.length > t.length)
                    throw new Error("Too many parameters provided for path");
                  let a = n.length > i.length;
                  const l = { ...this.configuration.default_url_options };
                  for (const i in s) {
                    const r = s[i];
                    e(s, i) && ((a = !0), t.includes(i) && (l[i] = r));
                  }
                  s = { ...this.configuration.default_url_options, ...r, ...s };
                  const u = {};
                  let c = {};
                  for (const t in s) {
                    if (!e(s, t)) continue;
                    const o = s[t];
                    if ("params" === t) {
                      if (!this.is_object(o))
                        throw new Error(
                          "params value should always be an object",
                        );
                      c = { ...c, ...o };
                    } else
                      this.is_reserved_option(t)
                        ? (u[t] = o)
                        : this.is_nullable(o) ||
                          (o === r[t] && !i.includes(t)) ||
                          (c[t] = o);
                  }
                  const d = a ? t : i;
                  let p = 0;
                  for (const t of d)
                    if (p < n.length) {
                      const i = n[p];
                      e(l, t) || ((c[t] = i), ++p);
                    }
                  return { keyword_parameters: u, query_parameters: c };
                }
                build_route(t, i, r, o, n, a) {
                  const { keyword_parameters: l, query_parameters: u } =
                      this.partition_parameters(t, i, r, a),
                    c = i.filter((t) => !e(u, t) || this.is_nullable(u[t]));
                  if (c.length) throw new s(...c);
                  let d = this.get_prefix() + this.visit(o, u);
                  l.trailing_slash && (d = d.replace(/(.*?)[/]?$/, "$1/"));
                  const p = this.serialize(u);
                  return (
                    p.length && (d += "?" + p),
                    (d += l.anchor ? "#" + l.anchor : ""),
                    n && (d = this.route_url(l) + d),
                    d
                  );
                }
                visit(t, e, i = !1) {
                  switch (t[0]) {
                    case r.GROUP:
                      return this.visit(t[1], e, !0);
                    case r.CAT:
                      return this.visit_cat(t, e, i);
                    case r.SYMBOL:
                      return this.visit_symbol(t, e, i);
                    case r.STAR:
                      return this.visit_globbing(t[1], e, !0);
                    case r.LITERAL:
                    case r.SLASH:
                    case r.DOT:
                      return t[1];
                    default:
                      throw new Error("Unknown Rails node type");
                  }
                }
                is_not_nullable(t) {
                  return !this.is_nullable(t);
                }
                is_nullable(t) {
                  return null == t;
                }
                visit_cat([t, e, i], r, o) {
                  const n = this.visit(e, r, o);
                  let s = this.visit(i, r, o);
                  return o &&
                    ((this.is_optional_node(e[0]) && !n) ||
                      (this.is_optional_node(i[0]) && !s))
                    ? ""
                    : ("/" === n[n.length - 1] &&
                        "/" === s[0] &&
                        (s = s.substring(1)),
                      n + s);
                }
                visit_symbol([t, e], i, r) {
                  const o = this.path_identifier(i[e]);
                  if ((delete i[e], o.length)) return this.encode_segment(o);
                  if (r) return "";
                  throw new s(e);
                }
                encode_segment(t) {
                  return t.replace(a, (t) => encodeURIComponent(t));
                }
                is_optional_node(t) {
                  return [r.STAR, r.SYMBOL, r.CAT].includes(t);
                }
                build_path_spec(t, e = !1) {
                  let i;
                  switch (t[0]) {
                    case r.GROUP:
                      return "(" + this.build_path_spec(t[1]) + ")";
                    case r.CAT:
                      return (
                        this.build_path_spec(t[1]) + this.build_path_spec(t[2])
                      );
                    case r.STAR:
                      return this.build_path_spec(t[1], !0);
                    case r.SYMBOL:
                      return (
                        (i = t[1]),
                        e ? (i.startsWith("*") ? "" : "*") + i : ":" + i
                      );
                    case r.SLASH:
                    case r.DOT:
                    case r.LITERAL:
                      return t[1];
                    default:
                      throw new Error("Unknown Rails node type");
                  }
                }
                visit_globbing(t, e, i) {
                  const r = t[1];
                  let o = e[r];
                  if ((delete e[r], this.is_nullable(o)))
                    return this.visit(t, e, i);
                  this.is_array(o) && (o = o.join("/"));
                  const n = this.path_identifier(o);
                  return encodeURI(n);
                }
                get_prefix() {
                  const t = this.configuration.prefix;
                  return t.match("/$") ? t.substring(0, t.length - 1) : t;
                }
                route(t, e, i = !1) {
                  const r = [],
                    o = [],
                    n = {};
                  for (const [e, { r: i, d: s }] of Object.entries(t))
                    o.push(e),
                      i && r.push(e),
                      this.is_not_nullable(s) && (n[e] = s);
                  const s = (...t) => this.build_route(o, r, n, e, i, t);
                  return (
                    (s.requiredParams = () => r),
                    (s.toString = () => this.build_path_spec(e)),
                    s
                  );
                }
                route_url(t) {
                  const e = t.host || this.current_host();
                  if (!e) return "";
                  const i = t.subdomain ? t.subdomain + "." : "",
                    r = t.protocol || this.current_protocol();
                  let o = t.port || (t.host ? void 0 : this.current_port());
                  return (o = o ? ":" + o : ""), r + "://" + i + e + o;
                }
                current_host() {
                  var t;
                  return (
                    (o &&
                      (null ===
                        (t =
                          null === window || void 0 === window
                            ? void 0
                            : window.location) || void 0 === t
                        ? void 0
                        : t.hostname)) ||
                    ""
                  );
                }
                current_protocol() {
                  var t, e;
                  return (
                    (o &&
                      (null ===
                        (e =
                          null ===
                            (t =
                              null === window || void 0 === window
                                ? void 0
                                : window.location) || void 0 === t
                            ? void 0
                            : t.protocol) || void 0 === e
                        ? void 0
                        : e.replace(/:$/, ""))) ||
                    "http"
                  );
                }
                current_port() {
                  var t;
                  return (
                    (o &&
                      (null ===
                        (t =
                          null === window || void 0 === window
                            ? void 0
                            : window.location) || void 0 === t
                        ? void 0
                        : t.port)) ||
                    ""
                  );
                }
                is_object(t) {
                  return (
                    "object" == typeof t &&
                    "[object Object]" === Object.prototype.toString.call(t)
                  );
                }
                is_array(t) {
                  return t instanceof Array;
                }
                is_callable(t) {
                  return "function" == typeof t && !!t.call;
                }
                is_reserved_option(t) {
                  return l.includes(t);
                }
                configure(t) {
                  return (
                    (this.configuration = { ...this.configuration, ...t }),
                    this.configuration
                  );
                }
                config() {
                  return { ...this.configuration };
                }
                is_module_supported(t) {
                  return n[t].isSupported();
                }
                ensure_module_supported(t) {
                  if (!this.is_module_supported(t))
                    throw new Error(`${t} is not supported by runtime`);
                }
                define_module(t, e) {
                  this.ensure_module_supported(t), n[t].define(e);
                }
              })(),
              c = {
                r: (t, e, i) => u.route(t, e, i),
                configure: (t) => u.configure(t),
                config: () => u.config(),
                serialize: (t) => u.serialize(t),
              };
            return u.define_module("ESM", c), c;
          })(),
          o =
            (r.configure,
            r.config,
            r.serialize,
            r.r(
              { format: {} },
              [
                2,
                [7, "/"],
                [
                  2,
                  [6, "users"],
                  [
                    2,
                    [7, "/"],
                    [
                      2,
                      [6, "invitation"],
                      [
                        2,
                        [7, "/"],
                        [2, [6, "accept"], [1, [2, [8, "."], [3, "format"]]]],
                      ],
                    ],
                  ],
                ],
              ],
              !0,
            ));
        r.r({ format: {} }, [
          2,
          [7, "/"],
          [
            2,
            [6, "users"],
            [
              2,
              [7, "/"],
              [
                2,
                [6, "invitation"],
                [
                  2,
                  [7, "/"],
                  [2, [6, "accept"], [1, [2, [8, "."], [3, "format"]]]],
                ],
              ],
            ],
          ],
        ]),
          r.r(
            { organization_id: { r: !0 }, format: { d: "json" } },
            [
              2,
              [7, "/"],
              [
                2,
                [6, "api"],
                [
                  2,
                  [7, "/"],
                  [
                    2,
                    [6, "v2"],
                    [
                      2,
                      [7, "/"],
                      [
                        2,
                        [6, "organizations"],
                        [
                          2,
                          [7, "/"],
                          [
                            2,
                            [3, "organization_id"],
                            [
                              2,
                              [7, "/"],
                              [
                                2,
                                [6, "inquiries"],
                                [
                                  2,
                                  [7, "/"],
                                  [
                                    2,
                                    [6, "acknowledge"],
                                    [1, [2, [8, "."], [3, "format"]]],
                                  ],
                                ],
                              ],
                            ],
                          ],
                        ],
                      ],
                    ],
                  ],
                ],
              ],
            ],
            !0,
          ),
          r.r({ organization_id: { r: !0 }, format: { d: "json" } }, [
            2,
            [7, "/"],
            [
              2,
              [6, "api"],
              [
                2,
                [7, "/"],
                [
                  2,
                  [6, "v2"],
                  [
                    2,
                    [7, "/"],
                    [
                      2,
                      [6, "organizations"],
                      [
                        2,
                        [7, "/"],
                        [
                          2,
                          [3, "organization_id"],
                          [
                            2,
                            [7, "/"],
                            [
                              2,
                              [6, "inquiries"],
                              [
                                2,
                                [7, "/"],
                                [
                                  2,
                                  [6, "acknowledge"],
                                  [1, [2, [8, "."], [3, "format"]]],
                                ],
                              ],
                            ],
                          ],
                        ],
                      ],
                    ],
                  ],
                ],
              ],
            ],
          ]),
          r.r(
            { format: { d: "json" } },
            [
              2,
              [7, "/"],
              [
                2,
                [6, "api"],
                [
                  2,
                  [7, "/"],
                  [
                    2,
                    [6, "mobile_device_usage"],
                    [
                      2,
                      [7, "/"],
                      [
                        2,
                        [6, "external_tools"],
                        [1, [2, [8, "."], [3, "format"]]],
                      ],
                    ],
                  ],
                ],
              ],
            ],
            !0,
          ),
          r.r({ format: { d: "json" } }, [
            2,
            [7, "/"],
            [
              2,
              [6, "api"],
              [
                2,
                [7, "/"],
                [
                  2,
                  [6, "mobile_device_usage"],
                  [
                    2,
                    [7, "/"],
                    [
                      2,
                      [6, "external_tools"],
                      [1, [2, [8, "."], [3, "format"]]],
                    ],
                  ],
                ],
              ],
            ],
          ]),
          r.r(
            { format: { d: "json" } },
            [
              2,
              [7, "/"],
              [
                2,
                [6, "api"],
                [
                  2,
                  [7, "/"],
                  [
                    2,
                    [6, "v2"],
                    [
                      2,
                      [7, "/"],
                      [2, [6, "colleges"], [1, [2, [8, "."], [3, "format"]]]],
                    ],
                  ],
                ],
              ],
            ],
            !0,
          ),
          r.r({ format: { d: "json" } }, [
            2,
            [7, "/"],
            [
              2,
              [6, "api"],
              [
                2,
                [7, "/"],
                [
                  2,
                  [6, "v2"],
                  [
                    2,
                    [7, "/"],
                    [2, [6, "colleges"], [1, [2, [8, "."], [3, "format"]]]],
                  ],
                ],
              ],
            ],
          ]),
          r.r(
            { id: { r: !0 }, format: { d: "json" } },
            [
              2,
              [7, "/"],
              [
                2,
                [6, "api"],
                [
                  2,
                  [7, "/"],
                  [
                    2,
                    [6, "v2"],
                    [
                      2,
                      [7, "/"],
                      [
                        2,
                        [6, "comments"],
                        [
                          2,
                          [7, "/"],
                          [2, [3, "id"], [1, [2, [8, "."], [3, "format"]]]],
                        ],
                      ],
                    ],
                  ],
                ],
              ],
            ],
            !0,
          ),
          r.r({ id: { r: !0 }, format: { d: "json" } }, [
            2,
            [7, "/"],
            [
              2,
              [6, "api"],
              [
                2,
                [7, "/"],
                [
                  2,
                  [6, "v2"],
                  [
                    2,
                    [7, "/"],
                    [
                      2,
                      [6, "comments"],
                      [
                        2,
                        [7, "/"],
                        [2, [3, "id"], [1, [2, [8, "."], [3, "format"]]]],
                      ],
                    ],
                  ],
                ],
              ],
            ],
          ]),
          r.r(
            { format: { d: "json" } },
            [
              2,
              [7, "/"],
              [
                2,
                [6, "api"],
                [
                  2,
                  [7, "/"],
                  [
                    2,
                    [6, "v2"],
                    [
                      2,
                      [7, "/"],
                      [2, [6, "comments"], [1, [2, [8, "."], [3, "format"]]]],
                    ],
                  ],
                ],
              ],
            ],
            !0,
          ),
          r.r({ format: { d: "json" } }, [
            2,
            [7, "/"],
            [
              2,
              [6, "api"],
              [
                2,
                [7, "/"],
                [
                  2,
                  [6, "v2"],
                  [
                    2,
                    [7, "/"],
                    [2, [6, "comments"], [1, [2, [8, "."], [3, "format"]]]],
                  ],
                ],
              ],
            ],
          ]),
          r.r(
            { format: { d: "json" } },
            [
              2,
              [7, "/"],
              [
                2,
                [6, "api"],
                [
                  2,
                  [7, "/"],
                  [
                    2,
                    [6, "v2"],
                    [
                      2,
                      [7, "/"],
                      [2, [6, "companies"], [1, [2, [8, "."], [3, "format"]]]],
                    ],
                  ],
                ],
              ],
            ],
            !0,
          ),
          r.r({ format: { d: "json" } }, [
            2,
            [7, "/"],
            [
              2,
              [6, "api"],
              [
                2,
                [7, "/"],
                [
                  2,
                  [6, "v2"],
                  [
                    2,
                    [7, "/"],
                    [2, [6, "companies"], [1, [2, [8, "."], [3, "format"]]]],
                  ],
                ],
              ],
            ],
          ]),
          r.r(
            { id: { r: !0 }, format: { d: "json" } },
            [
              2,
              [7, "/"],
              [
                2,
                [6, "api"],
                [
                  2,
                  [7, "/"],
                  [
                    2,
                    [6, "v2"],
                    [
                      2,
                      [7, "/"],
                      [
                        2,
                        [6, "companies"],
                        [
                          2,
                          [7, "/"],
                          [2, [3, "id"], [1, [2, [8, "."], [3, "format"]]]],
                        ],
                      ],
                    ],
                  ],
                ],
              ],
            ],
            !0,
          ),
          r.r({ id: { r: !0 }, format: { d: "json" } }, [
            2,
            [7, "/"],
            [
              2,
              [6, "api"],
              [
                2,
                [7, "/"],
                [
                  2,
                  [6, "v2"],
                  [
                    2,
                    [7, "/"],
                    [
                      2,
                      [6, "companies"],
                      [
                        2,
                        [7, "/"],
                        [2, [3, "id"], [1, [2, [8, "."], [3, "format"]]]],
                      ],
                    ],
                  ],
                ],
              ],
            ],
          ]);
      },
    },
    i = {};
  function r(t) {
    var o = i[t];
    if (void 0 !== o) return o.exports;
    var n = (i[t] = { id: t, loaded: !1, exports: {} });
    return e[t](n, n.exports, r), (n.loaded = !0), n.exports;
  }
  (r.amdO = {}),
    (r.d = (t, e) => {
      for (var i in e)
        r.o(e, i) &&
          !r.o(t, i) &&
          Object.defineProperty(t, i, { enumerable: !0, get: e[i] });
    }),
    (r.hmd = (t) => (
      (t = Object.create(t)).children || (t.children = []),
      Object.defineProperty(t, "exports", {
        enumerable: !0,
        set: () => {
          throw new Error(
            "ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: " +
              t.id,
          );
        },
      }),
      t
    )),
    (r.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e)),
    (t = r(894)),
    console.log(t.ts);
})();
