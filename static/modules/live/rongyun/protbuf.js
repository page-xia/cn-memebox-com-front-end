
(function(b, a) {
    if (typeof define === "function" && define.amd) {
        define(["ByteBuffer"], a)
    } else {
        if (typeof require === "function" && typeof module === "object" && module && module.exports) {
            module.exports = a(require("ByteBuffer"), true)
        } else {
            (b.dcodeIO = b.dcodeIO || {})["ProtoBuf"] = a(b.dcodeIO["ByteBuffer"])
        }
    }
})(this, function(c, b) {
    var e = {};
    e.ByteBuffer = c;
    e.Long = c.Long || null;
    e.VERSION = "5.0.1";
    e.WIRE_TYPES = {};
    e.WIRE_TYPES.VARINT = 0;
    e.WIRE_TYPES.BITS64 = 1;
    e.WIRE_TYPES.LDELIM = 2;
    e.WIRE_TYPES.STARTGROUP = 3;
    e.WIRE_TYPES.ENDGROUP = 4;
    e.WIRE_TYPES.BITS32 = 5;
    e.PACKABLE_WIRE_TYPES = [e.WIRE_TYPES.VARINT, e.WIRE_TYPES.BITS64, e.WIRE_TYPES.BITS32];
    e.TYPES = {
        int32: {
            name: "int32",
            wireType: e.WIRE_TYPES.VARINT,
            defaultValue: 0
        },
        uint32: {
            name: "uint32",
            wireType: e.WIRE_TYPES.VARINT,
            defaultValue: 0
        },
        sint32: {
            name: "sint32",
            wireType: e.WIRE_TYPES.VARINT,
            defaultValue: 0
        },
        int64: {
            name: "int64",
            wireType: e.WIRE_TYPES.VARINT,
            defaultValue: e.Long ? e.Long.ZERO : undefined
        },
        uint64: {
            name: "uint64",
            wireType: e.WIRE_TYPES.VARINT,
            defaultValue: e.Long ? e.Long.UZERO : undefined
        },
        sint64: {
            name: "sint64",
            wireType: e.WIRE_TYPES.VARINT,
            defaultValue: e.Long ? e.Long.ZERO : undefined
        },
        bool: {
            name: "bool",
            wireType: e.WIRE_TYPES.VARINT,
            defaultValue: false
        },
        "double": {
            name: "double",
            wireType: e.WIRE_TYPES.BITS64,
            defaultValue: 0
        },
        string: {
            name: "string",
            wireType: e.WIRE_TYPES.LDELIM,
            defaultValue: ""
        },
        bytes: {
            name: "bytes",
            wireType: e.WIRE_TYPES.LDELIM,
            defaultValue: null
        },
        fixed32: {
            name: "fixed32",
            wireType: e.WIRE_TYPES.BITS32,
            defaultValue: 0
        },
        sfixed32: {
            name: "sfixed32",
            wireType: e.WIRE_TYPES.BITS32,
            defaultValue: 0
        },
        fixed64: {
            name: "fixed64",
            wireType: e.WIRE_TYPES.BITS64,
            defaultValue: e.Long ? e.Long.UZERO : undefined
        },
        sfixed64: {
            name: "sfixed64",
            wireType: e.WIRE_TYPES.BITS64,
            defaultValue: e.Long ? e.Long.ZERO : undefined
        },
        "float": {
            name: "float",
            wireType: e.WIRE_TYPES.BITS32,
            defaultValue: 0
        },
        "enum": {
            name: "enum",
            wireType: e.WIRE_TYPES.VARINT,
            defaultValue: 0
        },
        message: {
            name: "message",
            wireType: e.WIRE_TYPES.LDELIM,
            defaultValue: null
        },
        group: {
            name: "group",
            wireType: e.WIRE_TYPES.STARTGROUP,
            defaultValue: null
        }
    };
    e.MAP_KEY_TYPES = [e.TYPES.int32, e.TYPES.sint32, e.TYPES.sfixed32, e.TYPES.uint32, e.TYPES.fixed32, e.TYPES.int64, e.TYPES.sint64, e.TYPES.sfixed64, e.TYPES.uint64, e.TYPES.fixed64, e.TYPES.bool, e.TYPES.string, e.TYPES.bytes];
    e.ID_MIN = 1;
    e.ID_MAX = 536870911;
    e.convertFieldsToCamelCase = false;
    e.populateAccessors = true;
    e.populateDefaults = true;
    e.Util = (function() {
        var f = {};
        f.IS_NODE = !! (typeof process === "object" && process + "" === "[object process]" && !process.browser);
        f.XHR = function() {
            var g = [function() {
                return new XMLHttpRequest()
            }, function() {
                return new ActiveXObject("Msxml2.XMLHTTP")
            }, function() {
                return new ActiveXObject("Msxml3.XMLHTTP")
            }, function() {
                return new ActiveXObject("Microsoft.XMLHTTP")
            }];
            var k = null;
            for (var h = 0; h < g.length; h++) {
                try {
                    k = g[h]()
                } catch (j) {
                    continue
                }
                break
            }
            if (!k) {
                throw Error("XMLHttpRequest is not supported")
            }
            return k
        };
        f.fetch = function(j, l) {
            if (l && typeof l != "function") {
                l = null
            }
            if (f.IS_NODE) {
                // var g = require("fs");
                // if (l) {
                //     g.readFile(j, function(m, n) {
                //         if (m) {
                //             l(null)
                //         } else {
                //             l("" + n)
                //         }
                //     })
                // } else {
                //     try {
                //         return g.readFileSync(j)
                //     } catch (h) {
                //         return null
                //     }
                // }
            } else {
                var k = f.XHR();
                k.open("GET", j, l ? true : false);
                k.setRequestHeader("Accept", "text/plain");
                if (typeof k.overrideMimeType === "function") {
                    k.overrideMimeType("text/plain")
                }
                if (l) {
                    k.onreadystatechange = function() {
                        if (k.readyState != 4) {
                            return
                        }
                        if (k.status == 200 || (k.status == 0 && typeof k.responseText === "string")) {
                            l(k.responseText)
                        } else {
                            l(null)
                        }
                    };
                    if (k.readyState == 4) {
                        return
                    }
                    k.send(null)
                } else {
                    k.send(null);
                    if (k.status == 200 || (k.status == 0 && typeof k.responseText === "string")) {
                        return k.responseText
                    }
                    return null
                }
            }
        };
        f.toCamelCase = function(g) {
            return g.replace(/_([a-zA-Z])/g, function(j, h) {
                return h.toUpperCase()
            })
        };
        return f
    })();
    e.Lang = {
        DELIM: /[\s\{\}=;:\[\],'"\(\)<>]/g,
        RULE: /^(?:required|optional|repeated|map)$/,
        TYPE: /^(?:double|float|int32|uint32|sint32|int64|uint64|sint64|fixed32|sfixed32|fixed64|sfixed64|bool|string|bytes)$/,
        NAME: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
        TYPEDEF: /^[a-zA-Z][a-zA-Z_0-9]*$/,
        TYPEREF: /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)+$/,
        FQTYPEREF: /^(?:\.[a-zA-Z][a-zA-Z_0-9]*)+$/,
        NUMBER: /^-?(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+|([0-9]*(\.[0-9]*)?([Ee][+-]?[0-9]+)?)|inf|nan)$/,
        NUMBER_DEC: /^(?:[1-9][0-9]*|0)$/,
        NUMBER_HEX: /^0[xX][0-9a-fA-F]+$/,
        NUMBER_OCT: /^0[0-7]+$/,
        NUMBER_FLT: /^([0-9]*(\.[0-9]*)?([Ee][+-]?[0-9]+)?|inf|nan)$/,
        BOOL: /^(?:true|false)$/i,
        ID: /^(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+)$/,
        NEGID: /^\-?(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+)$/,
        WHITESPACE: /\s/,
        STRING: /(?:"([^"\\]*(?:\\.[^"\\]*)*)")|(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g,
        STRING_DQ: /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g,
        STRING_SQ: /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g
    };
    e.DotProto = (function(l, k) {
        var n = {};
        var m = function(q) {
            this.source = q + "";
            this.index = 0;
            this.line = 1;
            this.stack = [];
            this._stringOpen = null
        };
        var p = m.prototype;
        p._readString = function() {
            var r = this._stringOpen === '"' ? k.STRING_DQ : k.STRING_SQ;
            r.lastIndex = this.index - 1;
            var q = r.exec(this.source);
            if (!q) {
                throw Error("unterminated string")
            }
            this.index = r.lastIndex;
            this.stack.push(this._stringOpen);
            this._stringOpen = null;
            return q[1]
        };
        p.next = function() {
            if (this.stack.length > 0) {
                return this.stack.shift()
            }
            if (this.index >= this.source.length) {
                return null
            }
            if (this._stringOpen !== null) {
                return this._readString()
            }
            var u, t, s;
            do {
                u = false;
                while (k.WHITESPACE.test(s = this.source.charAt(this.index))) {
                    if (s === "\n") {
                        ++this.line
                    }
                    if (++this.index === this.source.length) {
                        return null
                    }
                }
                if (this.source.charAt(this.index) === "/") {
                    ++this.index;
                    if (this.source.charAt(this.index) === "/") {
                        while (this.source.charAt(++this.index) !== "\n") {
                            if (this.index == this.source.length) {
                                return null
                            }
                        }++this.index;
                        ++this.line;
                        u = true
                    } else {
                        if ((s = this.source.charAt(this.index)) === "*") {
                            do {
                                if (s === "\n") {
                                    ++this.line
                                }
                                if (++this.index === this.source.length) {
                                    return null
                                }
                                t = s;
                                s = this.source.charAt(this.index)
                            } while (t !== "*" || s !== "/");
                            ++this.index;
                            u = true
                        } else {
                            return "/"
                        }
                    }
                }
            } while (u);
            if (this.index === this.source.length) {
                return null
            }
            var q = this.index;
            k.DELIM.lastIndex = 0;
            var v = k.DELIM.test(this.source.charAt(q++));
            if (!v) {
                while (q < this.source.length && !k.DELIM.test(this.source.charAt(q))) {
                    ++q
                }
            }
            var r = this.source.substring(this.index, this.index = q);
            if (r === '"' || r === "'") {
                this._stringOpen = r
            }
            return r
        };
        p.peek = function() {
            if (this.stack.length === 0) {
                var q = this.next();
                if (q === null) {
                    return null
                }
                this.stack.push(q)
            }
            return this.stack[0]
        };
        p.skip = function(q) {
            var r = this.next();
            if (r !== q) {
                throw Error("illegal '" + r + "', '" + q + "' expected")
            }
        };
        p.omit = function(q) {
            if (this.peek() === q) {
                this.next();
                return true
            }
            return false
        };
        p.toString = function() {
            return "Tokenizer (" + this.index + "/" + this.source.length + " at line " + this.line + ")"
        };
        n.Tokenizer = m;
        var j = function(q) {
            this.tn = new m(q);
            this.proto3 = false
        };
        var g = j.prototype;
        g.parse = function() {
            var q = {
                name: "[ROOT]",
                "package": null,
                messages: [],
                enums: [],
                imports: [],
                options: {},
                services: []
            };
            var s, r = true;
            try {
                while (s = this.tn.next()) {
                    switch (s) {
                        case "package":
                            if (!r || q["package"] !== null) {
                                throw Error("unexpected 'package'")
                            }
                            s = this.tn.next();
                            if (!k.TYPEREF.test(s)) {
                                throw Error("illegal package name: " + s)
                            }
                            this.tn.skip(";");
                            q["package"] = s;
                            break;
                        case "import":
                            if (!r) {
                                throw Error("unexpected 'import'")
                            }
                            s = this.tn.peek();
                            if (s === "public") {
                                this.tn.next()
                            }
                            s = this._readString();
                            this.tn.skip(";");
                            q.imports.push(s);
                            break;
                        case "syntax":
                            if (!r) {
                                throw Error("unexpected 'syntax'")
                            }
                            this.tn.skip("=");
                            if ((q.syntax = this._readString()) === "proto3") {
                                this.proto3 = true
                            }
                            this.tn.skip(";");
                            break;
                        case "message":
                            this._parseMessage(q, null);
                            r = false;
                            break;
                        case "enum":
                            this._parseEnum(q);
                            r = false;
                            break;
                        case "option":
                            this._parseOption(q);
                            break;
                        case "service":
                            this._parseService(q);
                            break;
                        case "extend":
                            this._parseExtend(q);
                            break;
                        default:
                            throw Error("unexpected '" + s + "'")
                    }
                }
            } catch (t) {
                t.message = "Parse error at line " + this.tn.line + ": " + t.message;
                throw t
            }
            delete q.name;
            return q
        };
        j.parse = function(q) {
            return new j(q).parse()
        };

        function f(s, r) {
            var t = -1,
                q = 1;
            if (s.charAt(0) == "-") {
                q = -1;
                s = s.substring(1)
            }
            if (k.NUMBER_DEC.test(s)) {
                t = parseInt(s)
            } else {
                if (k.NUMBER_HEX.test(s)) {
                    t = parseInt(s.substring(2), 16)
                } else {
                    if (k.NUMBER_OCT.test(s)) {
                        t = parseInt(s.substring(1), 8)
                    } else {
                        throw Error("illegal id value: " + (q < 0 ? "-" : "") + s)
                    }
                }
            }
            t = (q * t) | 0;
            if (!r && t < 0) {
                throw Error("illegal id value: " + (q < 0 ? "-" : "") + s)
            }
            return t
        }
        function o(r) {
            var q = 1;
            if (r.charAt(0) == "-") {
                q = -1;
                r = r.substring(1)
            }
            if (k.NUMBER_DEC.test(r)) {
                return q * parseInt(r, 10)
            } else {
                if (k.NUMBER_HEX.test(r)) {
                    return q * parseInt(r.substring(2), 16)
                } else {
                    if (k.NUMBER_OCT.test(r)) {
                        return q * parseInt(r.substring(1), 8)
                    } else {
                        if (r === "inf") {
                            return q * Infinity
                        } else {
                            if (r === "nan") {
                                return NaN
                            } else {
                                if (k.NUMBER_FLT.test(r)) {
                                    return q * parseFloat(r)
                                }
                            }
                        }
                    }
                }
            }
            throw Error("illegal number value: " + (q < 0 ? "-" : "") + r)
        }
        g._readString = function() {
            var r = "",
                q, s;
            do {
                s = this.tn.next();
                if (s !== "'" && s !== '"') {
                    throw Error("illegal string delimiter: " + s)
                }
                r += this.tn.next();
                this.tn.skip(s);
                q = this.tn.peek()
            } while (q === '"' || q === '"');
            return r
        };
        g._readValue = function(q) {
            var r = this.tn.peek(),
                s;
            if (r === '"' || r === "'") {
                return this._readString()
            }
            this.tn.next();
            if (k.NUMBER.test(r)) {
                return o(r)
            }
            if (k.BOOL.test(r)) {
                return (r.toLowerCase() === "true")
            }
            if (q && k.TYPEREF.test(r)) {
                return r
            }
            throw Error("illegal value: " + r)
        };
        g._parseOption = function(s, u) {
            var r = this.tn.next(),
                t = false;
            if (r === "(") {
                t = true;
                r = this.tn.next()
            }
            if (!k.TYPEREF.test(r)) {
                throw Error("illegal option name: " + r)
            }
            var q = r;
            if (t) {
                this.tn.skip(")");
                q = "(" + q + ")";
                r = this.tn.peek();
                if (k.FQTYPEREF.test(r)) {
                    q += r;
                    this.tn.next()
                }
            }
            this.tn.skip("=");
            this._parseOptionValue(s, q);
            if (!u) {
                this.tn.skip(";")
            }
        };

        function h(r, q, s) {
            if (typeof r[q] === "undefined") {
                r[q] = s
            } else {
                if (!Array.isArray(r[q])) {
                    r[q] = [r[q]]
                }
                r[q].push(s)
            }
        }
        g._parseOptionValue = function(s, q) {
            var r = this.tn.peek();
            if (r !== "{") {
                h(s.options, q, this._readValue(true))
            } else {
                this.tn.skip("{");
                while ((r = this.tn.next()) !== "}") {
                    if (!k.NAME.test(r)) {
                        throw Error("illegal option name: " + q + "." + r)
                    }
                    if (this.tn.omit(":")) {
                        h(s.options, q + "." + r, this._readValue(true))
                    } else {
                        this._parseOptionValue(s, q + "." + r)
                    }
                }
            }
        };
        g._parseService = function(s) {
            var r = this.tn.next();
            if (!k.NAME.test(r)) {
                throw Error("illegal service name at line " + this.tn.line + ": " + r)
            }
            var q = r;
            var t = {
                name: q,
                rpc: {},
                options: {}
            };
            this.tn.skip("{");
            while ((r = this.tn.next()) !== "}") {
                if (r === "option") {
                    this._parseOption(t)
                } else {
                    if (r === "rpc") {
                        this._parseServiceRPC(t)
                    } else {
                        throw Error("illegal service token: " + r)
                    }
                }
            }
            this.tn.omit(";");
            s.services.push(t)
        };
        g._parseServiceRPC = function(t) {
            var s = "rpc",
                r = this.tn.next();
            if (!k.NAME.test(r)) {
                throw Error("illegal rpc service method name: " + r)
            }
            var q = r;
            var u = {
                request: null,
                response: null,
                request_stream: false,
                response_stream: false,
                options: {}
            };
            this.tn.skip("(");
            r = this.tn.next();
            if (r.toLowerCase() === "stream") {
                u.request_stream = true;
                r = this.tn.next()
            }
            if (!k.TYPEREF.test(r)) {
                throw Error("illegal rpc service request type: " + r)
            }
            u.request = r;
            this.tn.skip(")");
            r = this.tn.next();
            if (r.toLowerCase() !== "returns") {
                throw Error("illegal rpc service request type delimiter: " + r)
            }
            this.tn.skip("(");
            r = this.tn.next();
            if (r.toLowerCase() === "stream") {
                u.response_stream = true;
                r = this.tn.next()
            }
            u.response = r;
            this.tn.skip(")");
            r = this.tn.peek();
            if (r === "{") {
                this.tn.next();
                while ((r = this.tn.next()) !== "}") {
                    if (r === "option") {
                        this._parseOption(u)
                    } else {
                        throw Error("illegal rpc service token: " + r)
                    }
                }
                this.tn.omit(";")
            } else {
                this.tn.skip(";")
            }
            if (typeof t[s] === "undefined") {
                t[s] = {}
            }
            t[s][q] = u
        };
        g._parseMessage = function(s, r) {
            var u = !! r,
                q = this.tn.next();
            var t = {
                name: "",
                fields: [],
                enums: [],
                messages: [],
                options: {},
                services: [],
                oneofs: {}
            };
            if (!k.NAME.test(q)) {
                throw Error("illegal " + (u ? "group" : "message") + " name: " + q)
            }
            t.name = q;
            if (u) {
                this.tn.skip("=");
                r.id = f(this.tn.next());
                t.isGroup = true
            }
            q = this.tn.peek();
            if (q === "[" && r) {
                this._parseFieldOptions(r)
            }
            this.tn.skip("{");
            while ((q = this.tn.next()) !== "}") {
                if (k.RULE.test(q)) {
                    this._parseMessageField(t, q)
                } else {
                    if (q === "oneof") {
                        this._parseMessageOneOf(t)
                    } else {
                        if (q === "enum") {
                            this._parseEnum(t)
                        } else {
                            if (q === "message") {
                                this._parseMessage(t)
                            } else {
                                if (q === "option") {
                                    this._parseOption(t)
                                } else {
                                    if (q === "service") {
                                        this._parseService(t)
                                    } else {
                                        if (q === "extensions") {
                                            t.extensions = this._parseExtensionRanges()
                                        } else {
                                            if (q === "reserved") {
                                                this._parseIgnored()
                                            } else {
                                                if (q === "extend") {
                                                    this._parseExtend(t)
                                                } else {
                                                    if (k.TYPEREF.test(q)) {
                                                        if (!this.proto3) {
                                                            throw Error("illegal field rule: " + q)
                                                        }
                                                        this._parseMessageField(t, "optional", q)
                                                    } else {
                                                        throw Error("illegal message token: " + q)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.tn.omit(";");
            s.messages.push(t);
            return t
        };
        g._parseIgnored = function() {
            while (this.tn.peek() !== ";") {
                this.tn.next()
            }
            this.tn.skip(";")
        };
        g._parseMessageField = function(v, u, t) {
            if (!k.RULE.test(u)) {
                throw Error("illegal message field rule: " + u)
            }
            var s = {
                rule: u,
                type: "",
                name: "",
                options: {},
                id: 0
            };
            var r;
            if (u === "map") {
                if (t) {
                    throw Error("illegal type: " + t)
                }
                this.tn.skip("<");
                r = this.tn.next();
                if (!k.TYPE.test(r) && !k.TYPEREF.test(r)) {
                    throw Error("illegal message field type: " + r)
                }
                s.keytype = r;
                this.tn.skip(",");
                r = this.tn.next();
                if (!k.TYPE.test(r) && !k.TYPEREF.test(r)) {
                    throw Error("illegal message field: " + r)
                }
                s.type = r;
                this.tn.skip(">");
                r = this.tn.next();
                if (!k.NAME.test(r)) {
                    throw Error("illegal message field name: " + r)
                }
                s.name = r;
                this.tn.skip("=");
                s.id = f(this.tn.next());
                r = this.tn.peek();
                if (r === "[") {
                    this._parseFieldOptions(s)
                }
                this.tn.skip(";")
            } else {
                t = typeof t !== "undefined" ? t : this.tn.next();
                if (t === "group") {
                    var q = this._parseMessage(v, s);
                    if (!/^[A-Z]/.test(q.name)) {
                        throw Error("illegal group name: " + q.name)
                    }
                    s.type = q.name;
                    s.name = q.name.toLowerCase();
                    this.tn.omit(";")
                } else {
                    if (!k.TYPE.test(t) && !k.TYPEREF.test(t)) {
                        throw Error("illegal message field type: " + t)
                    }
                    s.type = t;
                    r = this.tn.next();
                    if (!k.NAME.test(r)) {
                        throw Error("illegal message field name: " + r)
                    }
                    s.name = r;
                    this.tn.skip("=");
                    s.id = f(this.tn.next());
                    r = this.tn.peek();
                    if (r === "[") {
                        this._parseFieldOptions(s)
                    }
                    this.tn.skip(";")
                }
            }
            v.fields.push(s);
            return s
        };
        g._parseMessageOneOf = function(u) {
            var t = this.tn.next();
            if (!k.NAME.test(t)) {
                throw Error("illegal oneof name: " + t)
            }
            var r = t,
                s;
            var q = [];
            this.tn.skip("{");
            while ((t = this.tn.next()) !== "}") {
                s = this._parseMessageField(u, "optional", t);
                s.oneof = r;
                q.push(s.id)
            }
            this.tn.omit(";");
            u.oneofs[r] = q
        };
        g._parseFieldOptions = function(r) {
            this.tn.skip("[");
            var q, s = true;
            while ((q = this.tn.peek()) !== "]") {
                if (!s) {
                    this.tn.skip(",")
                }
                this._parseOption(r, true);
                s = false
            }
            this.tn.next()
        };
        g._parseEnum = function(t) {
            var q = {
                name: "",
                values: [],
                options: {}
            };
            var r = this.tn.next();
            if (!k.NAME.test(r)) {
                throw Error("illegal name: " + r)
            }
            q.name = r;
            this.tn.skip("{");
            while ((r = this.tn.next()) !== "}") {
                if (r === "option") {
                    this._parseOption(q)
                } else {
                    if (!k.NAME.test(r)) {
                        throw Error("illegal name: " + r)
                    }
                    this.tn.skip("=");
                    var s = {
                        name: r,
                        id: f(this.tn.next(), true)
                    };
                    r = this.tn.peek();
                    if (r === "[") {
                        this._parseFieldOptions({
                            options: {}
                        })
                    }
                    this.tn.skip(";");
                    q.values.push(s)
                }
            }
            this.tn.omit(";");
            t.enums.push(q)
        };
        g._parseExtensionRanges = function() {
            var q = [];
            var s, r, t;
            do {
                r = [];
                while (true) {
                    s = this.tn.next();
                    switch (s) {
                        case "min":
                            t = l.ID_MIN;
                            break;
                        case "max":
                            t = l.ID_MAX;
                            break;
                        default:
                            t = o(s);
                            break
                    }
                    r.push(t);
                    if (r.length === 2) {
                        break
                    }
                    if (this.tn.peek() !== "to") {
                        r.push(t);
                        break
                    }
                    this.tn.next()
                }
                q.push(r)
            } while (this.tn.omit(","));
            this.tn.skip(";");
            return q
        };
        g._parseExtend = function(s) {
            var q = this.tn.next();
            if (!k.TYPEREF.test(q)) {
                throw Error("illegal extend reference: " + q)
            }
            var r = {
                ref: q,
                fields: []
            };
            this.tn.skip("{");
            while ((q = this.tn.next()) !== "}") {
                if (k.RULE.test(q)) {
                    this._parseMessageField(r, q)
                } else {
                    if (k.TYPEREF.test(q)) {
                        if (!this.proto3) {
                            throw Error("illegal field rule: " + q)
                        }
                        this._parseMessageField(r, "optional", q)
                    } else {
                        throw Error("illegal extend token: " + q)
                    }
                }
            }
            this.tn.omit(";");
            s.messages.push(r);
            return r
        };
        g.toString = function() {
            return "Parser at line " + this.tn.line
        };
        n.Parser = j;
        return n
    })(e, e.Lang);
    e.Reflect = (function(o) {
        var j = {};
        var k = function(G, I, H) {
            this.builder = G;
            this.parent = I;
            this.name = H;
            this.className
        };
        var h = k.prototype;
        h.fqn = function() {
            var G = this.name,
                H = this;
            do {
                H = H.parent;
                if (H == null) {
                    break
                }
                G = H.name + "." + G
            } while (true);
            return G
        };
        h.toString = function(G) {
            return (G ? this.className + " " : "") + this.fqn()
        };
        h.build = function() {
            throw Error(this.toString(true) + " cannot be built directly")
        };
        j.T = k;
        var s = function(H, K, J, I, G) {
            k.call(this, H, K, J);
            this.className = "Namespace";
            this.children = [];
            this.options = I || {};
            this.syntax = G || "proto2"
        };
        var x = s.prototype = Object.create(k.prototype);
        x.getChildren = function(J) {
            J = J || null;
            if (J == null) {
                return this.children.slice()
            }
            var I = [];
            for (var H = 0, G = this.children.length; H < G; ++H) {
                if (this.children[H] instanceof J) {
                    I.push(this.children[H])
                }
            }
            return I
        };
        x.addChild = function(H) {
            var G;
            if (G = this.getChild(H.name)) {
                if (G instanceof f.Field && G.name !== G.originalName && this.getChild(G.originalName) === null) {
                    G.name = G.originalName
                } else {
                    if (H instanceof f.Field && H.name !== H.originalName && this.getChild(H.originalName) === null) {
                        H.name = H.originalName
                    } else {
                        throw Error("Duplicate name in namespace " + this.toString(true) + ": " + H.name)
                    }
                }
            }
            this.children.push(H)
        };
        x.getChild = function(J) {
            var I = typeof J === "number" ? "id" : "name";
            for (var H = 0, G = this.children.length; H < G; ++H) {
                if (this.children[H][I] === J) {
                    return this.children[H]
                }
            }
            return null
        };
        x.resolve = function(J, G) {
            var H = typeof J === "string" ? J.split(".") : J,
                L = this,
                I = 0;
            if (H[I] === "") {
                while (L.parent !== null) {
                    L = L.parent
                }
                I++
            }
            var K;
            do {
                do {
                    if (!(L instanceof j.Namespace)) {
                        L = null;
                        break
                    }
                    K = L.getChild(H[I]);
                    if (!K || !(K instanceof j.T) || (G && !(K instanceof j.Namespace))) {
                        L = null;
                        break
                    }
                    L = K;
                    I++
                } while (I < H.length);
                if (L != null) {
                    break
                }
                if (this.parent !== null) {
                    return this.parent.resolve(J, G)
                }
            } while (L != null);
            return L
        };
        x.qn = function(I) {
            var H = [],
                K = I;
            do {
                H.unshift(K.name);
                K = K.parent
            } while (K !== null);
            for (var G = 1; G <= H.length; G++) {
                var J = H.slice(H.length - G);
                if (I === this.resolve(J, I instanceof j.Namespace)) {
                    return J.join(".")
                }
            }
            return I.fqn()
        };
        x.build = function() {
            var J = {};
            var I = this.children;
            for (var H = 0, G = I.length, K; H < G; ++H) {
                K = I[H];
                if (K instanceof s) {
                    J[K.name] = K.build()
                }
            }
            if (Object.defineProperty) {
                Object.defineProperty(J, "$options", {
                    value: this.buildOpt()
                })
            }
            return J
        };
        x.buildOpt = function() {
            var J = {}, K = Object.keys(this.options);
            for (var I = 0, G = K.length; I < G; ++I) {
                var H = K[I],
                    L = this.options[K[I]];
                J[H] = L
            }
            return J
        };
        x.getOption = function(G) {
            if (typeof G === "undefined") {
                return this.options
            }
            return typeof this.options[G] !== "undefined" ? this.options[G] : null
        };
        j.Namespace = s;
        var v = function(J, H, I, G) {
            this.type = J;
            this.resolvedType = H;
            this.isMapKey = I;
            this.syntax = G;
            if (I && o.MAP_KEY_TYPES.indexOf(J) < 0) {
                throw Error("Invalid map key type: " + J.name)
            }
        };
        var A = v.prototype;

        function z(G) {
            if (typeof G === "string") {
                G = o.TYPES[G]
            }
            if (typeof G.defaultValue === "undefined") {
                throw Error("default value for type " + G.name + " is not supported")
            }
            if (G == o.TYPES.bytes) {
                return new c(0)
            }
            return G.defaultValue
        }
        v.defaultFieldValue = z;

        function n(H, G) {
            if (H && typeof H.low === "number" && typeof H.high === "number" && typeof H.unsigned === "boolean" && H.low === H.low && H.high === H.high) {
                return new o.Long(H.low, H.high, typeof G === "undefined" ? H.unsigned : G)
            }
            if (typeof H === "string") {
                return o.Long.fromString(H, G || false, 10)
            }
            if (typeof H === "number") {
                return o.Long.fromNumber(H, G || false)
            }
            throw Error("not convertible to Long")
        }
        A.verifyValue = function(J) {
            var G = function(N, M) {
                throw Error("Illegal value for " + this.toString(true) + " of type " + this.type.name + ": " + N + " (" + M + ")")
            }.bind(this);
            switch (this.type) {
                case o.TYPES.int32:
                case o.TYPES.sint32:
                case o.TYPES.sfixed32:
                    if (typeof J !== "number" || (J === J && J % 1 !== 0)) {
                        G(typeof J, "not an integer")
                    }
                    return J > 4294967295 ? J | 0 : J;
                case o.TYPES.uint32:
                case o.TYPES.fixed32:
                    if (typeof J !== "number" || (J === J && J % 1 !== 0)) {
                        G(typeof J, "not an integer")
                    }
                    return J < 0 ? J >>> 0 : J;
                case o.TYPES.int64:
                case o.TYPES.sint64:
                case o.TYPES.sfixed64:
                    if (o.Long) {
                        try {
                            return n(J, false)
                        } catch (L) {
                            G(typeof J, L.message)
                        }
                    } else {
                        G(typeof J, "requires Long.js")
                    }
                case o.TYPES.uint64:
                case o.TYPES.fixed64:
                    if (o.Long) {
                        try {
                            return n(J, true)
                        } catch (L) {
                            G(typeof J, L.message)
                        }
                    } else {
                        G(typeof J, "requires Long.js")
                    }
                case o.TYPES.bool:
                    if (typeof J !== "boolean") {
                        G(typeof J, "not a boolean")
                    }
                    return J;
                case o.TYPES["float"]:
                case o.TYPES["double"]:
                    if (typeof J !== "number") {
                        G(typeof J, "not a number")
                    }
                    return J;
                case o.TYPES.string:
                    if (typeof J !== "string" && !(J && J instanceof String)) {
                        G(typeof J, "not a string")
                    }
                    return "" + J;
                case o.TYPES.bytes:
                    if (c.isByteBuffer(J)) {
                        return J
                    }
                    return c.wrap(J);
                case o.TYPES["enum"]:
                    var H = this.resolvedType.getChildren(o.Reflect.Enum.Value);
                    for (I = 0; I < H.length; I++) {
                        if (H[I].name == J) {
                            return H[I].id
                        } else {
                            if (H[I].id == J) {
                                return H[I].id
                            }
                        }
                    }
                    if (this.syntax === "proto3") {
                        if (typeof J !== "number" || (J === J && J % 1 !== 0)) {
                            G(typeof J, "not an integer")
                        }
                        if (J > 4294967295 || J < 0) {
                            G(typeof J, "not in range for uint32")
                        }
                        return J
                    } else {
                        G(J, "not a valid enum value")
                    }
                case o.TYPES.group:
                case o.TYPES.message:
                    if (!J || typeof J !== "object") {
                        G(typeof J, "object expected")
                    }
                    if (J instanceof this.resolvedType.clazz) {
                        return J
                    }
                    if (J instanceof o.Builder.Message) {
                        var K = {};
                        for (var I in J) {
                            if (J.hasOwnProperty(I)) {
                                K[I] = J[I]
                            }
                        }
                        J = K
                    }
                    return new(this.resolvedType.clazz)(J)
            }
            throw Error("[INTERNAL] Illegal value for " + this.toString(true) + ": " + J + " (undefined type " + this.type + ")")
        };
        A.calculateLength = function(I, G) {
            if (G === null) {
                return 0
            }
            var H;
            switch (this.type) {
                case o.TYPES.int32:
                    return G < 0 ? c.calculateVarint64(G) : c.calculateVarint32(G);
                case o.TYPES.uint32:
                    return c.calculateVarint32(G);
                case o.TYPES.sint32:
                    return c.calculateVarint32(c.zigZagEncode32(G));
                case o.TYPES.fixed32:
                case o.TYPES.sfixed32:
                case o.TYPES["float"]:
                    return 4;
                case o.TYPES.int64:
                case o.TYPES.uint64:
                    return c.calculateVarint64(G);
                case o.TYPES.sint64:
                    return c.calculateVarint64(c.zigZagEncode64(G));
                case o.TYPES.fixed64:
                case o.TYPES.sfixed64:
                    return 8;
                case o.TYPES.bool:
                    return 1;
                case o.TYPES["enum"]:
                    return c.calculateVarint32(G);
                case o.TYPES["double"]:
                    return 8;
                case o.TYPES.string:
                    H = c.calculateUTF8Bytes(G);
                    return c.calculateVarint32(H) + H;
                case o.TYPES.bytes:
                    if (G.remaining() < 0) {
                        throw Error("Illegal value for " + this.toString(true) + ": " + G.remaining() + " bytes remaining")
                    }
                    return c.calculateVarint32(G.remaining()) + G.remaining();
                case o.TYPES.message:
                    H = this.resolvedType.calculate(G);
                    return c.calculateVarint32(H) + H;
                case o.TYPES.group:
                    H = this.resolvedType.calculate(G);
                    return H + c.calculateVarint32((I << 3) | o.WIRE_TYPES.ENDGROUP)
            }
            throw Error("[INTERNAL] Illegal value to encode in " + this.toString(true) + ": " + G + " (unknown type)")
        };
        A.encodeValue = function(K, H, G) {
            if (H === null) {
                return G
            }
            switch (this.type) {
                case o.TYPES.int32:
                    if (H < 0) {
                        G.writeVarint64(H)
                    } else {
                        G.writeVarint32(H)
                    }
                    break;
                case o.TYPES.uint32:
                    G.writeVarint32(H);
                    break;
                case o.TYPES.sint32:
                    G.writeVarint32ZigZag(H);
                    break;
                case o.TYPES.fixed32:
                    G.writeUint32(H);
                    break;
                case o.TYPES.sfixed32:
                    G.writeInt32(H);
                    break;
                case o.TYPES.int64:
                case o.TYPES.uint64:
                    G.writeVarint64(H);
                    break;
                case o.TYPES.sint64:
                    G.writeVarint64ZigZag(H);
                    break;
                case o.TYPES.fixed64:
                    G.writeUint64(H);
                    break;
                case o.TYPES.sfixed64:
                    G.writeInt64(H);
                    break;
                case o.TYPES.bool:
                    if (typeof H === "string") {
                        G.writeVarint32(H.toLowerCase() === "false" ? 0 : !! H)
                    } else {
                        G.writeVarint32(H ? 1 : 0)
                    }
                    break;
                case o.TYPES["enum"]:
                    G.writeVarint32(H);
                    break;
                case o.TYPES["float"]:
                    G.writeFloat32(H);
                    break;
                case o.TYPES["double"]:
                    G.writeFloat64(H);
                    break;
                case o.TYPES.string:
                    G.writeVString(H);
                    break;
                case o.TYPES.bytes:
                    if (H.remaining() < 0) {
                        throw Error("Illegal value for " + this.toString(true) + ": " + H.remaining() + " bytes remaining")
                    }
                    var I = H.offset;
                    G.writeVarint32(H.remaining());
                    G.append(H);
                    H.offset = I;
                    break;
                case o.TYPES.message:
                    var J = new c().LE();
                    this.resolvedType.encode(H, J);
                    G.writeVarint32(J.offset);
                    G.append(J.flip());
                    break;
                case o.TYPES.group:
                    this.resolvedType.encode(H, G);
                    G.writeVarint32((K << 3) | o.WIRE_TYPES.ENDGROUP);
                    break;
                default:
                    throw Error("[INTERNAL] Illegal value to encode in " + this.toString(true) + ": " + H + " (unknown type)")
            }
            return G
        };
        A.decode = function(H, G, K) {
            if (G != this.type.wireType) {
                throw Error("Unexpected wire type for element")
            }
            var I, J;
            switch (this.type) {
                case o.TYPES.int32:
                    return H.readVarint32() | 0;
                case o.TYPES.uint32:
                    return H.readVarint32() >>> 0;
                case o.TYPES.sint32:
                    return H.readVarint32ZigZag() | 0;
                case o.TYPES.fixed32:
                    return H.readUint32() >>> 0;
                case o.TYPES.sfixed32:
                    return H.readInt32() | 0;
                case o.TYPES.int64:
                    return H.readVarint64();
                case o.TYPES.uint64:
                    return H.readVarint64().toUnsigned();
                case o.TYPES.sint64:
                    return H.readVarint64ZigZag();
                case o.TYPES.fixed64:
                    return H.readUint64();
                case o.TYPES.sfixed64:
                    return H.readInt64();
                case o.TYPES.bool:
                    return !!H.readVarint32();
                case o.TYPES["enum"]:
                    return H.readVarint32();
                case o.TYPES["float"]:
                    return H.readFloat();
                case o.TYPES["double"]:
                    return H.readDouble();
                case o.TYPES.string:
                    return H.readVString();
                case o.TYPES.bytes:
                    J = H.readVarint32();
                    if (H.remaining() < J) {
                        throw Error("Illegal number of bytes for " + this.toString(true) + ": " + J + " required but got only " + H.remaining())
                    }
                    I = H.clone();
                    I.limit = I.offset + J;
                    H.offset += J;
                    return I;
                case o.TYPES.message:
                    J = H.readVarint32();
                    return this.resolvedType.decode(H, J);
                case o.TYPES.group:
                    return this.resolvedType.decode(H, -1, K)
            }
            throw Error("[INTERNAL] Illegal decode type")
        };
        A.valueFromString = function(G) {
            if (!this.isMapKey) {
                throw Error("valueFromString() called on non-map-key element")
            }
            switch (this.type) {
                case o.TYPES.int32:
                case o.TYPES.sint32:
                case o.TYPES.sfixed32:
                case o.TYPES.uint32:
                case o.TYPES.fixed32:
                    return this.verifyValue(parseInt(G));
                case o.TYPES.int64:
                case o.TYPES.sint64:
                case o.TYPES.sfixed64:
                case o.TYPES.uint64:
                case o.TYPES.fixed64:
                    return this.verifyValue(G);
                case o.TYPES.bool:
                    return G === "true";
                case o.TYPES.string:
                    return this.verifyValue(G);
                case o.TYPES.bytes:
                    return c.fromBinary(G)
            }
        };
        A.valueToString = function(G) {
            if (!this.isMapKey) {
                throw Error("valueToString() called on non-map-key element")
            }
            if (this.type === o.TYPES.bytes) {
                return G.toString("binary")
            } else {
                return G.toString()
            }
        };
        j.Element = v;
        var f = function(H, K, J, I, L, G) {
            s.call(this, H, K, J, I, G);
            this.className = "Message";
            this.extensions = undefined;
            this.clazz = null;
            this.isGroup = !! L;
            this._fields = null;
            this._fieldsById = null;
            this._fieldsByName = null
        };
        var F = f.prototype = Object.create(s.prototype);
        F.build = function(G) {
            if (this.clazz && !G) {
                return this.clazz
            }
            var I = (function(S, M) {
                var Q = M.getChildren(S.Reflect.Message.Field),
                    W = M.getChildren(S.Reflect.Message.OneOf);
                var U = function(Z, ad) {
                    S.Builder.Message.call(this);
                    for (var aa = 0, T = W.length; aa < T; ++aa) {
                        this[W[aa].name] = null
                    }
                    for (aa = 0, T = Q.length; aa < T; ++aa) {
                        var ac = Q[aa];
                        this[ac.name] = ac.repeated ? [] : (ac.map ? new S.Map(ac) : null);
                        if ((ac.required || M.syntax === "proto3") && ac.defaultValue !== null) {
                            this[ac.name] = ac.defaultValue
                        }
                    }
                    if (arguments.length > 0) {
                        var ab;
                        if (arguments.length === 1 && Z !== null && typeof Z === "object" && (typeof Z.encode !== "function" || Z instanceof U) && !Array.isArray(Z) && !(Z instanceof S.Map) && !c.isByteBuffer(Z) && !(Z instanceof ArrayBuffer) && !(S.Long && Z instanceof S.Long)) {
                            this.$set(Z)
                        } else {
                            for (aa = 0, T = arguments.length; aa < T; ++aa) {
                                if (typeof(ab = arguments[aa]) !== "undefined") {
                                    this.$set(Q[aa].name, ab)
                                }
                            }
                        }
                    }
                };
                var P = U.prototype = Object.create(S.Builder.Message.prototype);
                P.add = function(T, Z, ab) {
                    var aa = M._fieldsByName[T];
                    if (!ab) {
                        if (!aa) {
                            throw Error(this + "#" + T + " is undefined")
                        }
                        if (!(aa instanceof S.Reflect.Message.Field)) {
                            throw Error(this + "#" + T + " is not a field: " + aa.toString(true))
                        }
                        if (!aa.repeated) {
                            throw Error(this + "#" + T + " is not a repeated field")
                        }
                        Z = aa.verifyValue(Z, true)
                    }
                    if (this[T] === null) {
                        this[T] = []
                    }
                    this[T].push(Z);
                    return this
                };
                P.$add = P.add;
                P.set = function(ad, Z, ac) {
                    if (ad && typeof ad === "object") {
                        ac = Z;
                        for (var ab in ad) {
                            if (ad.hasOwnProperty(ab) && typeof(Z = ad[ab]) !== "undefined") {
                                this.$set(ab, Z, ac)
                            }
                        }
                        return this
                    }
                    var aa = M._fieldsByName[ad];
                    if (!ac) {
                        if (!aa) {
                            throw Error(this + "#" + ad + " is not a field: undefined")
                        }
                        if (!(aa instanceof S.Reflect.Message.Field)) {
                            throw Error(this + "#" + ad + " is not a field: " + aa.toString(true))
                        }
                        this[aa.name] = (Z = aa.verifyValue(Z))
                    } else {
                        this[ad] = Z
                    }
                    if (aa && aa.oneof) {
                        var T = this[aa.oneof.name];
                        if (Z !== null) {
                            if (T !== null && T !== aa.name) {
                                this[T] = null
                            }
                            this[aa.oneof.name] = aa.name
                        } else {
                            if (T === ad) {
                                this[aa.oneof.name] = null
                            }
                        }
                    }
                    return this
                };
                P.$set = P.set;
                P.get = function(T, aa) {
                    if (aa) {
                        return this[T]
                    }
                    var Z = M._fieldsByName[T];
                    if (!Z || !(Z instanceof S.Reflect.Message.Field)) {
                        throw Error(this + "#" + T + " is not a field: undefined")
                    }
                    if (!(Z instanceof S.Reflect.Message.Field)) {
                        throw Error(this + "#" + T + " is not a field: " + Z.toString(true))
                    }
                    return this[Z.name]
                };
                P.$get = P.get;
                for (var N = 0; N < Q.length; N++) {
                    var V = Q[N];
                    if (V instanceof S.Reflect.Message.ExtensionField) {
                        continue
                    }
                    if (M.builder.options.populateAccessors) {
                        (function(ab) {
                            var Z = ab.originalName.replace(/(_[a-zA-Z])/g, function(ad) {
                                return ad.toUpperCase().replace("_", "")
                            });
                            Z = Z.substring(0, 1).toUpperCase() + Z.substring(1);
                            var aa = ab.originalName.replace(/([A-Z])/g, function(ad) {
                                return "_" + ad
                            });
                            var ac = function(ad, ae) {
                                this[ab.name] = ae ? ad : ab.verifyValue(ad);
                                return this
                            };
                            var T = function() {
                                return this[ab.name]
                            };
                            if (M.getChild("set" + Z) === null) {
                                P["set" + Z] = ac
                            }
                            if (M.getChild("set_" + aa) === null) {
                                P["set_" + aa] = ac
                            }
                            if (M.getChild("get" + Z) === null) {
                                P["get" + Z] = T
                            }
                            if (M.getChild("get_" + aa) === null) {
                                P["get_" + aa] = T
                            }
                        })(V)
                    }
                }
                P.encode = function(Z, ab) {
                    if (typeof Z === "boolean") {
                        ab = Z, Z = undefined
                    }
                    var T = false;
                    if (!Z) {
                        Z = new c(), T = true
                    }
                    var aa = Z.littleEndian;
                    try {
                        M.encode(this, Z.LE(), ab);
                        return (T ? Z.flip() : Z).LE(aa)
                    } catch (ac) {
                        Z.LE(aa);
                        throw (ac)
                    }
                };
                U.encode = function(aa, T, Z) {
                    return new U(aa).encode(T, Z)
                };
                P.calculate = function() {
                    return M.calculate(this)
                };
                P.encodeDelimited = function(Z) {
                    var T = false;
                    if (!Z) {
                        Z = new c(), T = true
                    }
                    var aa = new c().LE();
                    M.encode(this, aa).flip();
                    Z.writeVarint32(aa.remaining());
                    Z.append(aa);
                    return T ? Z.flip() : Z
                };
                P.encodeAB = function() {
                    try {
                        return this.encode().toArrayBuffer()
                    } catch (T) {
                        if (T.encoded) {
                            T.encoded = T.encoded.toArrayBuffer()
                        }
                        throw (T)
                    }
                };
                P.toArrayBuffer = P.encodeAB;
                P.encodeNB = function() {
                    try {
                        return this.encode().toBuffer()
                    } catch (T) {
                        if (T.encoded) {
                            T.encoded = T.encoded.toBuffer()
                        }
                        throw (T)
                    }
                };
                P.toBuffer = P.encodeNB;
                P.encode64 = function() {
                    try {
                        return this.encode().toBase64()
                    } catch (T) {
                        if (T.encoded) {
                            T.encoded = T.encoded.toBase64()
                        }
                        throw (T)
                    }
                };
                P.toBase64 = P.encode64;
                P.encodeHex = function() {
                    try {
                        return this.encode().toHex()
                    } catch (T) {
                        if (T.encoded) {
                            T.encoded = T.encoded.toHex()
                        }
                        throw (T)
                    }
                };
                P.toHex = P.encodeHex;

                function X(aa, ae, ac, ai) {
                    if (aa === null || typeof aa !== "object") {
                        if (ai && ai instanceof S.Reflect.Enum) {
                            var T = S.Reflect.Enum.getName(ai.object, aa);
                            if (T !== null) {
                                return T
                            }
                        }
                        return aa
                    }
                    if (c.isByteBuffer(aa)) {
                        return ae ? aa.toBase64() : aa.toBuffer()
                    }
                    if (S.Long.isLong(aa)) {
                        return ac ? aa.toString() : S.Long.fromValue(aa)
                    }
                    var ag;
                    if (Array.isArray(aa)) {
                        ag = [];
                        aa.forEach(function(ak, aj) {
                            ag[aj] = X(ak, ae, ac, ai)
                        });
                        return ag
                    }
                    ag = {};
                    if (aa instanceof S.Map) {
                        var ab = aa.entries();
                        for (var ad = ab.next(); !ad.done; ad = ab.next()) {
                            ag[aa.keyElem.valueToString(ad.value[0])] = X(ad.value[1], ae, ac, aa.valueElem.resolvedType)
                        }
                        return ag
                    }
                    var af = aa.$type,
                        ah = undefined;
                    for (var Z in aa) {
                        if (aa.hasOwnProperty(Z)) {
                            if (af && (ah = af.getChild(Z))) {
                                ag[Z] = X(aa[Z], ae, ac, ah.resolvedType)
                            } else {
                                ag[Z] = X(aa[Z], ae, ac)
                            }
                        }
                    }
                    return ag
                }
                P.toRaw = function(T, Z) {
                    return X(this, !! T, !! Z, this.$type)
                };
                P.encodeJSON = function() {
                    return JSON.stringify(X(this, true, true, this.$type))
                };
                U.decode = function(T, Z) {
                    if (typeof T === "string") {
                        T = c.wrap(T, Z ? Z : "base64")
                    }
                    T = c.isByteBuffer(T) ? T : c.wrap(T);
                    var aa = T.littleEndian;
                    try {
                        var ac = M.decode(T.LE());
                        T.LE(aa);
                        return ac
                    } catch (ab) {
                        T.LE(aa);
                        throw (ab)
                    }
                };
                U.decodeDelimited = function(Z, aa) {
                    if (typeof Z === "string") {
                        Z = c.wrap(Z, aa ? aa : "base64")
                    }
                    Z = c.isByteBuffer(Z) ? Z : c.wrap(Z);
                    if (Z.remaining() < 1) {
                        return null
                    }
                    var ad = Z.offset,
                        T = Z.readVarint32();
                    if (Z.remaining() < T) {
                        Z.offset = ad;
                        return null
                    }
                    try {
                        var ac = M.decode(Z.slice(Z.offset, Z.offset + T).LE());
                        Z.offset += T;
                        return ac
                    } catch (ab) {
                        Z.offset += T;
                        throw ab
                    }
                };
                U.decode64 = function(T) {
                    return U.decode(T, "base64")
                };
                U.decodeHex = function(T) {
                    return U.decode(T, "hex")
                };
                U.decodeJSON = function(T) {
                    return new U(JSON.parse(T))
                };
                P.toString = function() {
                    return M.toString()
                };
                var L;
                var O;
                var Y;
                var R;
                if (Object.defineProperty) {
                    Object.defineProperty(U, "$options", {
                        value: M.buildOpt()
                    }), Object.defineProperty(P, "$options", {
                        value: U["$options"]
                    }), Object.defineProperty(U, "$type", {
                        value: M
                    }), Object.defineProperty(P, "$type", {
                        value: M
                    })
                }
                return U
            })(o, this);
            this._fields = [];
            this._fieldsById = {};
            this._fieldsByName = {};
            for (var J = 0, H = this.children.length, K; J < H; J++) {
                K = this.children[J];
                if (K instanceof t || K instanceof f || K instanceof r) {
                    if (I.hasOwnProperty(K.name)) {
                        throw Error("Illegal reflect child of " + this.toString(true) + ": " + K.toString(true) + " cannot override static property '" + K.name + "'")
                    }
                    I[K.name] = K.build()
                } else {
                    if (K instanceof f.Field) {
                        K.build(), this._fields.push(K), this._fieldsById[K.id] = K, this._fieldsByName[K.name] = K
                    } else {
                        if (!(K instanceof f.OneOf) && !(K instanceof q)) {
                            throw Error("Illegal reflect child of " + this.toString(true) + ": " + this.children[J].toString(true))
                        }
                    }
                }
            }
            return this.clazz = I
        };
        F.encode = function(O, K, L) {
            var G = null,
                N;
            for (var M = 0, J = this._fields.length, H; M < J; ++M) {
                N = this._fields[M];
                H = O[N.name];
                if (N.required && H === null) {
                    if (G === null) {
                        G = N
                    }
                } else {
                    N.encode(L ? H : N.verifyValue(H), K, O)
                }
            }
            if (G !== null) {
                var I = Error("Missing at least one required field for " + this.toString(true) + ": " + G);
                I.encoded = K;
                throw (I)
            }
            return K
        };
        F.calculate = function(I) {
            for (var L = 0, H = 0, G = this._fields.length, J, K; H < G; ++H) {
                J = this._fields[H];
                K = I[J.name];
                if (J.required && K === null) {
                    throw Error("Missing at least one required field for " + this.toString(true) + ": " + J)
                } else {
                    L += J.calculate(K, I)
                }
            }
            return L
        };

        function D(J, I) {
            var H = I.readVarint32(),
                G = H & 7,
                K = H >>> 3;
            switch (G) {
                case o.WIRE_TYPES.VARINT:
                    do {
                        H = I.readUint8()
                    } while ((H & 128) === 128);
                    break;
                case o.WIRE_TYPES.BITS64:
                    I.offset += 8;
                    break;
                case o.WIRE_TYPES.LDELIM:
                    H = I.readVarint32();
                    I.offset += H;
                    break;
                case o.WIRE_TYPES.STARTGROUP:
                    D(K, I);
                    break;
                case o.WIRE_TYPES.ENDGROUP:
                    if (K === J) {
                        return false
                    } else {
                        throw Error("Illegal GROUPEND after unknown group: " + K + " (" + J + " expected)")
                    }
                case o.WIRE_TYPES.BITS32:
                    I.offset += 4;
                    break;
                default:
                    throw Error("Illegal wire type in unknown group " + J + ": " + G)
            }
            return true
        }
        F.decode = function(M, I, O) {
            I = typeof I === "number" ? I : -1;
            var G = M.offset,
                J = new(this.clazz)(),
                U, T, H, R;
            while (M.offset < G + I || (I === -1 && M.remaining() > 0)) {
                U = M.readVarint32();
                T = U & 7;
                H = U >>> 3;
                if (T === o.WIRE_TYPES.ENDGROUP) {
                    if (H !== O) {
                        throw Error("Illegal group end indicator for " + this.toString(true) + ": " + H + " (" + (O ? O + " expected" : "not a group") + ")")
                    }
                    break
                }
                if (!(R = this._fieldsById[H])) {
                    switch (T) {
                        case o.WIRE_TYPES.VARINT:
                            M.readVarint32();
                            break;
                        case o.WIRE_TYPES.BITS32:
                            M.offset += 4;
                            break;
                        case o.WIRE_TYPES.BITS64:
                            M.offset += 8;
                            break;
                        case o.WIRE_TYPES.LDELIM:
                            var P = M.readVarint32();
                            M.offset += P;
                            break;
                        case o.WIRE_TYPES.STARTGROUP:
                            while (D(H, M)) {}
                            break;
                        default:
                            throw Error("Illegal wire type for unknown field " + H + " in " + this.toString(true) + "#decode: " + T)
                    }
                    continue
                }
                if (R.repeated && !R.options.packed) {
                    J[R.name].push(R.decode(T, M))
                } else {
                    if (R.map) {
                        var Q = R.decode(T, M);
                        J[R.name].set(Q[0], Q[1])
                    } else {
                        J[R.name] = R.decode(T, M);
                        if (R.oneof) {
                            var S = J[R.oneof.name];
                            if (S !== null && S !== R.name) {
                                J[S] = null
                            }
                            J[R.oneof.name] = R.name
                        }
                    }
                }
            }
            for (var N = 0, L = this._fields.length; N < L; ++N) {
                R = this._fields[N];
                if (J[R.name] === null) {
                    if (this.syntax === "proto3") {
                        J[R.name] = R.defaultValue
                    } else {
                        if (R.required) {
                            var K = Error("Missing at least one required field for " + this.toString(true) + ": " + R.name);
                            K.decoded = J;
                            throw (K)
                        } else {
                            if (o.populateDefaults && R.defaultValue !== null) {
                                J[R.name] = R.defaultValue
                            }
                        }
                    }
                }
            }
            return J
        };
        j.Message = f;
        var m = function(K, O, N, I, M, G, H, P, L, J) {
            k.call(this, K, O, G);
            this.className = "Message.Field";
            this.required = N === "required";
            this.repeated = N === "repeated";
            this.map = N === "map";
            this.keyType = I || null;
            this.type = M;
            this.resolvedType = null;
            this.id = H;
            this.options = P || {};
            this.defaultValue = null;
            this.oneof = L || null;
            this.syntax = J || "proto2";
            this.originalName = this.name;
            this.element = null;
            this.keyElement = null;
            if (this.builder.options.convertFieldsToCamelCase && !(this instanceof f.ExtensionField)) {
                this.name = o.Util.toCamelCase(this.name)
            }
        };
        var E = m.prototype = Object.create(k.prototype);
        E.build = function() {
            this.element = new v(this.type, this.resolvedType, false, this.syntax);
            if (this.map) {
                this.keyElement = new v(this.keyType, undefined, true, this.syntax)
            }
            if (this.syntax === "proto3" && !this.repeated && !this.map) {
                this.defaultValue = v.defaultFieldValue(this.type)
            } else {
                if (typeof this.options["default"] !== "undefined") {
                    this.defaultValue = this.verifyValue(this.options["default"])
                }
            }
        };
        E.verifyValue = function(K, H) {
            H = H || false;
            var G = function(M, L) {
                throw Error("Illegal value for " + this.toString(true) + " of type " + this.type.name + ": " + M + " (" + L + ")")
            }.bind(this);
            if (K === null) {
                if (this.required) {
                    G(typeof K, "required")
                }
                if (this.syntax === "proto3" && this.type !== o.TYPES.message) {
                    G(typeof K, "proto3 field without field presence cannot be null")
                }
                return null
            }
            var J;
            if (this.repeated && !H) {
                if (!Array.isArray(K)) {
                    K = [K]
                }
                var I = [];
                for (J = 0; J < K.length; J++) {
                    I.push(this.element.verifyValue(K[J]))
                }
                return I
            }
            if (this.map && !H) {
                if (!(K instanceof o.Map)) {
                    if (!(K instanceof Object)) {
                        G(typeof K, "expected ProtoBuf.Map or raw object for map field")
                    }
                    return new o.Map(this, K)
                } else {
                    return K
                }
            }
            if (!this.repeated && Array.isArray(K)) {
                G(typeof K, "no array expected")
            }
            return this.element.verifyValue(K)
        };
        E.hasWirePresence = function(H, G) {
            if (this.syntax !== "proto3") {
                return (H !== null)
            }
            if (this.oneof && G[this.oneof.name] === this.name) {
                return true
            }
            switch (this.type) {
                case o.TYPES.int32:
                case o.TYPES.sint32:
                case o.TYPES.sfixed32:
                case o.TYPES.uint32:
                case o.TYPES.fixed32:
                    return H !== 0;
                case o.TYPES.int64:
                case o.TYPES.sint64:
                case o.TYPES.sfixed64:
                case o.TYPES.uint64:
                case o.TYPES.fixed64:
                    return H.low !== 0 || H.high !== 0;
                case o.TYPES.bool:
                    return H;
                case o.TYPES["float"]:
                case o.TYPES["double"]:
                    return H !== 0;
                case o.TYPES.string:
                    return H.length > 0;
                case o.TYPES.bytes:
                    return H.remaining() > 0;
                case o.TYPES["enum"]:
                    return H !== 0;
                case o.TYPES.message:
                    return H !== null;
                default:
                    return true
            }
        };
        E.encode = function(N, J, O) {
            if (this.type === null || typeof this.type !== "object") {
                throw Error("[INTERNAL] Unresolved type in " + this.toString(true) + ": " + this.type)
            }
            if (N === null || (this.repeated && N.length == 0)) {
                return J
            }
            try {
                if (this.repeated) {
                    var K;
                    if (this.options.packed && o.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {
                        J.writeVarint32((this.id << 3) | o.WIRE_TYPES.LDELIM);
                        J.ensureCapacity(J.offset += 1);
                        var G = J.offset;
                        for (K = 0; K < N.length; K++) {
                            this.element.encodeValue(this.id, N[K], J)
                        }
                        var L = J.offset - G,
                            I = c.calculateVarint32(L);
                        if (I > 1) {
                            var H = J.slice(G, J.offset);
                            G += I - 1;
                            J.offset = G;
                            J.append(H)
                        }
                        J.writeVarint32(L, G - I)
                    } else {
                        for (K = 0; K < N.length; K++) {
                            J.writeVarint32((this.id << 3) | this.type.wireType), this.element.encodeValue(this.id, N[K], J)
                        }
                    }
                } else {
                    if (this.map) {
                        N.forEach(function(S, Q, P) {
                            var R = c.calculateVarint32((1 << 3) | this.keyType.wireType) + this.keyElement.calculateLength(1, Q) + c.calculateVarint32((2 << 3) | this.type.wireType) + this.element.calculateLength(2, S);
                            J.writeVarint32((this.id << 3) | o.WIRE_TYPES.LDELIM);
                            J.writeVarint32(R);
                            J.writeVarint32((1 << 3) | this.keyType.wireType);
                            this.keyElement.encodeValue(1, Q, J);
                            J.writeVarint32((2 << 3) | this.type.wireType);
                            this.element.encodeValue(2, S, J)
                        }, this)
                    } else {
                        if (this.hasWirePresence(N, O)) {
                            J.writeVarint32((this.id << 3) | this.type.wireType);
                            this.element.encodeValue(this.id, N, J)
                        }
                    }
                }
            } catch (M) {
                throw Error("Illegal value for " + this.toString(true) + ": " + N + " (" + M + ")")
            }
            return J
        };
        E.calculate = function(J, I) {
            J = this.verifyValue(J);
            if (this.type === null || typeof this.type !== "object") {
                throw Error("[INTERNAL] Unresolved type in " + this.toString(true) + ": " + this.type)
            }
            if (J === null || (this.repeated && J.length == 0)) {
                return 0
            }
            var L = 0;
            try {
                if (this.repeated) {
                    var H, G;
                    if (this.options.packed && o.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {
                        L += c.calculateVarint32((this.id << 3) | o.WIRE_TYPES.LDELIM);
                        G = 0;
                        for (H = 0; H < J.length; H++) {
                            G += this.element.calculateLength(this.id, J[H])
                        }
                        L += c.calculateVarint32(G);
                        L += G
                    } else {
                        for (H = 0; H < J.length; H++) {
                            L += c.calculateVarint32((this.id << 3) | this.type.wireType), L += this.element.calculateLength(this.id, J[H])
                        }
                    }
                } else {
                    if (this.map) {
                        J.forEach(function(P, N, M) {
                            var O = c.calculateVarint32((1 << 3) | this.keyType.wireType) + this.keyElement.calculateLength(1, N) + c.calculateVarint32((2 << 3) | this.type.wireType) + this.element.calculateLength(2, P);
                            L += c.calculateVarint32((this.id << 3) | o.WIRE_TYPES.LDELIM);
                            L += c.calculateVarint32(O);
                            L += O
                        }, this)
                    } else {
                        if (this.hasWirePresence(J, I)) {
                            L += c.calculateVarint32((this.id << 3) | this.type.wireType);
                            L += this.element.calculateLength(this.id, J)
                        }
                    }
                }
            } catch (K) {
                throw Error("Illegal value for " + this.toString(true) + ": " + J + " (" + K + ")")
            }
            return L
        };
        E.decode = function(M, H, J) {
            var L, I;
            var P = (!this.map && M == this.type.wireType) || (!J && this.repeated && this.options.packed && M == o.WIRE_TYPES.LDELIM) || (this.map && M == o.WIRE_TYPES.LDELIM);
            if (!P) {
                throw Error("Illegal wire type for field " + this.toString(true) + ": " + M + " (" + this.type.wireType + " expected)")
            }
            if (M == o.WIRE_TYPES.LDELIM && this.repeated && this.options.packed && o.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {
                if (!J) {
                    I = H.readVarint32();
                    I = H.offset + I;
                    var O = [];
                    while (H.offset < I) {
                        O.push(this.decode(this.type.wireType, H, true))
                    }
                    return O
                }
            }
            if (this.map) {
                var N = v.defaultFieldValue(this.keyType);
                L = v.defaultFieldValue(this.type);
                I = H.readVarint32();
                if (H.remaining() < I) {
                    throw Error("Illegal number of bytes for " + this.toString(true) + ": " + I + " required but got only " + H.remaining())
                }
                var K = H.clone();
                K.limit = K.offset + I;
                H.offset += I;
                while (K.remaining() > 0) {
                    var Q = K.readVarint32();
                    M = Q & 7;
                    var G = Q >>> 3;
                    if (G === 1) {
                        N = this.keyElement.decode(K, M, G)
                    } else {
                        if (G === 2) {
                            L = this.element.decode(K, M, G)
                        } else {
                            throw Error("Unexpected tag in map field key/value submessage")
                        }
                    }
                }
                return [N, L]
            }
            return this.element.decode(H, M, this.id)
        };
        j.Message.Field = m;
        var w = function(G, K, L, J, I, M, H) {
            m.call(this, G, K, L, null, J, I, M, H);
            this.extension
        };
        w.prototype = Object.create(m.prototype);
        j.Message.ExtensionField = w;
        var y = function(G, I, H) {
            k.call(this, G, I, H);
            this.fields = []
        };
        j.Message.OneOf = y;
        var t = function(H, K, J, I, G) {
            s.call(this, H, K, J, I, G);
            this.className = "Enum";
            this.object = null
        };
        t.getName = function(G, K) {
            var J = Object.keys(G);
            for (var I = 0, H; I < J.length; ++I) {
                if (G[H = J[I]] === K) {
                    return H
                }
            }
            return null
        };
        var l = t.prototype = Object.create(s.prototype);
        l.build = function(G) {
            if (this.object && !G) {
                return this.object
            }
            var J = new o.Builder.Enum(),
                I = this.getChildren(t.Value);
            for (var K = 0, H = I.length; K < H; ++K) {
                J[I[K]["name"]] = I[K]["id"]
            }
            if (Object.defineProperty) {
                Object.defineProperty(J, "$options", {
                    value: this.buildOpt(),
                    enumerable: false
                })
            }
            return this.object = J
        };
        j.Enum = t;
        var C = function(G, I, H, J) {
            k.call(this, G, I, H);
            this.className = "Enum.Value";
            this.id = J
        };
        C.prototype = Object.create(k.prototype);
        j.Enum.Value = C;
        var q = function(G, I, H, J) {
            k.call(this, G, I, H);
            this.field = J
        };
        q.prototype = Object.create(k.prototype);
        j.Extension = q;
        var r = function(H, G, J, I) {
            s.call(this, H, G, J, I);
            this.className = "Service";
            this.clazz = null
        };
        var B = r.prototype = Object.create(s.prototype);
        B.build = function(G) {
            if (this.clazz && !G) {
                return this.clazz
            }
            return this.clazz = (function(O, J) {
                var I = function(R) {
                    O.Builder.Service.call(this);
                    this.rpcImpl = R || function(S, T, U) {
                            setTimeout(U.bind(this, Error("Not implemented, see: https://github.com/dcodeIO/ProtoBuf.js/wiki/Services")), 0)
                        }
                };
                var P = I.prototype = Object.create(O.Builder.Service.prototype);
                var M = J.getChildren(O.Reflect.Service.RPCMethod);
                for (var K = 0; K < M.length; K++) {
                    (function(R) {
                        P[R.name] = function(T, U) {
                            try {
                                try {
                                    T = R.resolvedRequestType.clazz.decode(c.wrap(T))
                                } catch (S) {
                                    if (!(S instanceof TypeError)) {
                                        throw S
                                    }
                                }
                                if (T === null || typeof T !== "object") {
                                    throw Error("Illegal arguments")
                                }
                                if (!(T instanceof R.resolvedRequestType.clazz)) {
                                    T = new R.resolvedRequestType.clazz(T)
                                }
                                this.rpcImpl(R.fqn(), T, function(W, V) {
                                    if (W) {
                                        U(W);
                                        return
                                    }
                                    try {
                                        V = R.resolvedResponseType.clazz.decode(V)
                                    } catch (X) {}
                                    if (!V || !(V instanceof R.resolvedResponseType.clazz)) {
                                        U(Error("Illegal response type received in service method " + J.name + "#" + R.name));
                                        return
                                    }
                                    U(null, V)
                                })
                            } catch (S) {
                                setTimeout(U.bind(this, S), 0)
                            }
                        };
                        I[R.name] = function(S, T, U) {
                            new I(S)[R.name](T, U)
                        };
                        if (Object.defineProperty) {
                            Object.defineProperty(I[R.name], "$options", {
                                value: R.buildOpt()
                            }), Object.defineProperty(P[R.name], "$options", {
                                value: I[R.name]["$options"]
                            })
                        }
                    })(M[K])
                }
                var H;
                var L;
                var Q;
                var N;
                if (Object.defineProperty) {
                    Object.defineProperty(I, "$options", {
                        value: J.buildOpt()
                    }), Object.defineProperty(P, "$options", {
                        value: I["$options"]
                    }), Object.defineProperty(I, "$type", {
                        value: J
                    }), Object.defineProperty(P, "$type", {
                        value: J
                    })
                }
                return I
            })(o, this)
        };
        j.Service = r;
        var g = function(G, J, I, H) {
            k.call(this, G, J, I);
            this.className = "Service.Method";
            this.options = H || {}
        };
        var p = g.prototype = Object.create(k.prototype);
        p.buildOpt = x.buildOpt;
        j.Service.Method = g;
        var u = function(I, N, L, M, H, K, G, J) {
            g.call(this, I, N, L, J);
            this.className = "Service.RPCMethod";
            this.requestName = M;
            this.responseName = H;
            this.requestStream = K;
            this.responseStream = G;
            this.resolvedRequestType = null;
            this.resolvedResponseType = null
        };
        u.prototype = Object.create(g.prototype);
        j.Service.RPCMethod = u;
        return j
    })(e);
    e.Builder = (function(j, h, l) {
        var k = function(m) {
            this.ns = new l.Namespace(this, null, "");
            this.ptr = this.ns;
            this.resolved = false;
            this.result = null;
            this.files = {};
            this.importRoot = null;
            this.options = m || {}
        };
        var f = k.prototype;
        k.isMessage = function(m) {
            if (typeof m.name !== "string") {
                return false
            }
            if (typeof m.values !== "undefined" || typeof m.rpc !== "undefined") {
                return false
            }
            return true
        };
        k.isMessageField = function(m) {
            if (typeof m.rule !== "string" || typeof m.name !== "string" || typeof m.type !== "string" || typeof m.id === "undefined") {
                return false
            }
            return true
        };
        k.isEnum = function(m) {
            if (typeof m.name !== "string") {
                return false
            }
            if (typeof m.values === "undefined" || !Array.isArray(m.values) || m.values.length === 0) {
                return false
            }
            return true
        };
        k.isService = function(m) {
            if (typeof m.name !== "string" || typeof m.rpc !== "object" || !m.rpc) {
                return false
            }
            return true
        };
        k.isExtend = function(m) {
            if (typeof m.ref !== "string") {
                return false
            }
            return true
        };
        f.reset = function() {
            this.ptr = this.ns;
            return this
        };
        f.define = function(m) {
            if (typeof m !== "string" || !h.TYPEREF.test(m)) {
                throw Error("illegal namespace: " + m)
            }
            m.split(".").forEach(function(n) {
                var o = this.ptr.getChild(n);
                if (o === null) {
                    this.ptr.addChild(o = new l.Namespace(this, this.ptr, n))
                }
                this.ptr = o
            }, this);
            return this
        };
        f.create = function(n) {
            if (!n) {
                return this
            }
            if (!Array.isArray(n)) {
                n = [n]
            } else {
                if (n.length === 0) {
                    return this
                }
                n = n.slice()
            }
            var m = [n];
            while (m.length > 0) {
                n = m.pop();
                if (!Array.isArray(n)) {
                    throw Error("not a valid namespace: " + JSON.stringify(n))
                }
                while (n.length > 0) {
                    var q = n.shift();
                    if (k.isMessage(q)) {
                        var r = new l.Message(this, this.ptr, q.name, q.options, q.isGroup, q.syntax);
                        var p = {};
                        if (q.oneofs) {
                            Object.keys(q.oneofs).forEach(function(s) {
                                r.addChild(p[s] = new l.Message.OneOf(this, r, s))
                            }, this)
                        }
                        if (q.fields) {
                            q.fields.forEach(function(s) {
                                if (r.getChild(s.id | 0) !== null) {
                                    throw Error("duplicate or invalid field id in " + r.name + ": " + s.id)
                                }
                                if (s.options && typeof s.options !== "object") {
                                    throw Error("illegal field options in " + r.name + "#" + s.name)
                                }
                                var t = null;
                                if (typeof s.oneof === "string" && !(t = p[s.oneof])) {
                                    throw Error("illegal oneof in " + r.name + "#" + s.name + ": " + s.oneof)
                                }
                                s = new l.Message.Field(this, r, s.rule, s.keytype, s.type, s.name, s.id, s.options, t, q.syntax);
                                if (t) {
                                    t.fields.push(s)
                                }
                                r.addChild(s)
                            }, this)
                        }
                        var o = [];
                        if (q.enums) {
                            q.enums.forEach(function(s) {
                                o.push(s)
                            })
                        }
                        if (q.messages) {
                            q.messages.forEach(function(s) {
                                o.push(s)
                            })
                        }
                        if (q.services) {
                            q.services.forEach(function(s) {
                                o.push(s)
                            })
                        }
                        if (q.extensions) {
                            if (typeof q.extensions[0] === "number") {
                                r.extensions = [q.extensions]
                            } else {
                                r.extensions = q.extensions
                            }
                        }
                        this.ptr.addChild(r);
                        if (o.length > 0) {
                            m.push(n);
                            n = o;
                            o = null;
                            this.ptr = r;
                            r = null;
                            continue
                        }
                        o = null
                    } else {
                        if (k.isEnum(q)) {
                            r = new l.Enum(this, this.ptr, q.name, q.options, q.syntax);
                            q.values.forEach(function(s) {
                                r.addChild(new l.Enum.Value(this, r, s.name, s.id))
                            }, this);
                            this.ptr.addChild(r)
                        } else {
                            if (k.isService(q)) {
                                r = new l.Service(this, this.ptr, q.name, q.options);
                                Object.keys(q.rpc).forEach(function(t) {
                                    var s = q.rpc[t];
                                    r.addChild(new l.Service.RPCMethod(this, r, t, s.request, s.response, !! s.request_stream, !! s.response_stream, s.options))
                                }, this);
                                this.ptr.addChild(r)
                            } else {
                                if (k.isExtend(q)) {
                                    r = this.ptr.resolve(q.ref, true);
                                    if (r) {
                                        q.fields.forEach(function(t) {
                                            if (r.getChild(t.id | 0) !== null) {
                                                throw Error("duplicate extended field id in " + r.name + ": " + t.id)
                                            }
                                            if (r.extensions) {
                                                var v = false;
                                                r.extensions.forEach(function(x) {
                                                    if (t.id >= x[0] && t.id <= x[1]) {
                                                        v = true
                                                    }
                                                });
                                                if (!v) {
                                                    throw Error("illegal extended field id in " + r.name + ": " + t.id + " (not within valid ranges)")
                                                }
                                            }
                                            var s = t.name;
                                            if (this.options.convertFieldsToCamelCase) {
                                                s = j.Util.toCamelCase(s)
                                            }
                                            var w = new l.Message.ExtensionField(this, r, t.rule, t.type, this.ptr.fqn() + "." + s, t.id, t.options);
                                            var u = new l.Extension(this, this.ptr, t.name, w);
                                            w.extension = u;
                                            this.ptr.addChild(u);
                                            r.addChild(w)
                                        }, this)
                                    } else {
                                        if (!/\.?google\.protobuf\./.test(q.ref)) {
                                            throw Error("extended message " + q.ref + " is not defined")
                                        }
                                    }
                                } else {
                                    throw Error("not a valid definition: " + JSON.stringify(q))
                                }
                            }
                        }
                    }
                    q = null;
                    r = null
                }
                n = null;
                this.ptr = this.ptr.parent
            }
            this.resolved = false;
            this.result = null;
            return this
        };

        function g(m) {
            if (m.messages) {
                m.messages.forEach(function(n) {
                    n.syntax = m.syntax;
                    g(n)
                })
            }
            if (m.enums) {
                m.enums.forEach(function(n) {
                    n.syntax = m.syntax
                })
            }
        }
        f["import"] = function(w, m) {
            var o = "/";
            if (typeof m === "string") {
                if (j.Util.IS_NODE) {
                    //m = require("path")["resolve"](m)
                }
                if (this.files[m] === true) {
                    return this.reset()
                }
                this.files[m] = true
            } else {
                if (typeof m === "object") {
                    var u = m.root;
                    if (j.Util.IS_NODE) {
                        //u = require("path")["resolve"](u)
                    }
                    if (u.indexOf("\\") >= 0 || m.file.indexOf("\\") >= 0) {
                        o = "\\"
                    }
                    var p = u + o + m.file;
                    if (this.files[p] === true) {
                        return this.reset()
                    }
                    this.files[p] = true
                }
            }
            if (w.imports && w.imports.length > 0) {
                var r, t = false;
                if (typeof m === "object") {
                    this.importRoot = m.root;
                    t = true;
                    r = this.importRoot;
                    m = m.file;
                    if (r.indexOf("\\") >= 0 || m.indexOf("\\") >= 0) {
                        o = "\\"
                    }
                } else {
                    if (typeof m === "string") {
                        if (this.importRoot) {
                            r = this.importRoot
                        } else {
                            if (m.indexOf("/") >= 0) {
                                r = m.replace(/\/[^\/]*$/, "");
                                if (r === "") {
                                    r = "/"
                                }
                            } else {
                                if (m.indexOf("\\") >= 0) {
                                    r = m.replace(/\\[^\\]*$/, "");
                                    o = "\\"
                                } else {
                                    r = "."
                                }
                            }
                        }
                    } else {
                        r = null
                    }
                }
                for (var s = 0; s < w.imports.length; s++) {
                    if (typeof w.imports[s] === "string") {
                        if (!r) {
                            throw Error("cannot determine import root")
                        }
                        var v = w.imports[s];
                        if (v === "google/protobuf/descriptor.proto") {
                            continue
                        }
                        v = r + o + v;
                        if (this.files[v] === true) {
                            continue
                        }
                        if (/\.proto$/i.test(v) && !j.DotProto) {
                            v = v.replace(/\.proto$/, ".json")
                        }
                        var q = j.Util.fetch(v);
                        if (q === null) {
                            throw Error("failed to import '" + v + "' in '" + m + "': file not found")
                        }
                        if (/\.json$/i.test(v)) {
                            this["import"](JSON.parse(q + ""), v)
                        } else {
                            this["import"](j.DotProto.Parser.parse(q), v)
                        }
                    } else {
                        if (!m) {
                            this["import"](w.imports[s])
                        } else {
                            if (/\.(\w+)$/.test(m)) {
                                this["import"](w.imports[s], m.replace(/^(.+)\.(\w+)$/, function(y, x, z) {
                                    return x + "_import" + s + "." + z
                                }))
                            } else {
                                this["import"](w.imports[s], m + "_import" + s)
                            }
                        }
                    }
                }
                if (t) {
                    this.importRoot = null
                }
            }
            if (w["package"]) {
                this.define(w["package"])
            }
            if (w.syntax) {
                g(w)
            }
            var n = this.ptr;
            if (w.options) {
                Object.keys(w.options).forEach(function(x) {
                    n.options[x] = w.options[x]
                })
            }
            if (w.messages) {
                this.create(w.messages), this.ptr = n
            }
            if (w.enums) {
                this.create(w.enums), this.ptr = n
            }
            if (w.services) {
                this.create(w.services), this.ptr = n
            }
            if (w["extends"]) {
                this.create(w["extends"])
            }
            return this.reset()
        };
        f.resolveAll = function() {
            var m;
            if (this.ptr == null || typeof this.ptr.type === "object") {
                return this
            }
            if (this.ptr instanceof l.Namespace) {
                this.ptr.children.forEach(function(n) {
                    this.ptr = n;
                    this.resolveAll()
                }, this)
            } else {
                if (this.ptr instanceof l.Message.Field) {
                    if (!h.TYPE.test(this.ptr.type)) {
                        if (!h.TYPEREF.test(this.ptr.type)) {
                            throw Error("illegal type reference in " + this.ptr.toString(true) + ": " + this.ptr.type)
                        }
                        m = (this.ptr instanceof l.Message.ExtensionField ? this.ptr.extension.parent : this.ptr.parent).resolve(this.ptr.type, true);
                        if (!m) {
                            throw Error("unresolvable type reference in " + this.ptr.toString(true) + ": " + this.ptr.type)
                        }
                        this.ptr.resolvedType = m;
                        if (m instanceof l.Enum) {
                            this.ptr.type = j.TYPES["enum"];
                            if (this.ptr.syntax === "proto3" && m.syntax !== "proto3") {
                                throw Error("proto3 message cannot reference proto2 enum")
                            }
                        } else {
                            if (m instanceof l.Message) {
                                this.ptr.type = m.isGroup ? j.TYPES.group : j.TYPES.message
                            } else {
                                throw Error("illegal type reference in " + this.ptr.toString(true) + ": " + this.ptr.type)
                            }
                        }
                    } else {
                        this.ptr.type = j.TYPES[this.ptr.type]
                    }
                    if (this.ptr.map) {
                        if (!h.TYPE.test(this.ptr.keyType)) {
                            throw Error("illegal key type for map field in " + this.ptr.toString(true) + ": " + this.ptr.keyType)
                        }
                        this.ptr.keyType = j.TYPES[this.ptr.keyType]
                    }
                } else {
                    if (this.ptr instanceof j.Reflect.Service.Method) {
                        if (this.ptr instanceof j.Reflect.Service.RPCMethod) {
                            m = this.ptr.parent.resolve(this.ptr.requestName, true);
                            if (!m || !(m instanceof j.Reflect.Message)) {
                                throw Error("Illegal type reference in " + this.ptr.toString(true) + ": " + this.ptr.requestName)
                            }
                            this.ptr.resolvedRequestType = m;
                            m = this.ptr.parent.resolve(this.ptr.responseName, true);
                            if (!m || !(m instanceof j.Reflect.Message)) {
                                throw Error("Illegal type reference in " + this.ptr.toString(true) + ": " + this.ptr.responseName)
                            }
                            this.ptr.resolvedResponseType = m
                        } else {
                            throw Error("illegal service type in " + this.ptr.toString(true))
                        }
                    } else {
                        if (!(this.ptr instanceof j.Reflect.Message.OneOf) && !(this.ptr instanceof j.Reflect.Extension) && !(this.ptr instanceof j.Reflect.Enum.Value)) {
                            throw Error("illegal object in namespace: " + typeof(this.ptr) + ": " + this.ptr)
                        }
                    }
                }
            }
            return this.reset()
        };
        f.build = function(o) {
            this.reset();
            if (!this.resolved) {
                this.resolveAll(), this.resolved = true, this.result = null
            }
            if (this.result === null) {
                this.result = this.ns.build()
            }
            if (!o) {
                return this.result
            }
            var m = typeof o === "string" ? o.split(".") : o,
                p = this.result;
            for (var n = 0; n < m.length; n++) {
                if (p[m[n]]) {
                    p = p[m[n]]
                } else {
                    p = null;
                    break
                }
            }
            return p
        };
        f.lookup = function(n, m) {
            return n ? this.ns.resolve(n, m) : this.ns
        };
        f.toString = function() {
            return "Builder"
        };
        k.Message = function() {};
        k.Enum = function() {};
        k.Service = function() {};
        return k
    })(e, e.Lang, e.Reflect);
    e.Map = (function(g, k) {
        var f = function(p, o) {
            if (!p.map) {
                throw Error("field is not a map")
            }
            this.field = p;
            this.keyElem = new k.Element(p.keyType, null, true, p.syntax);
            this.valueElem = new k.Element(p.type, p.resolvedType, false, p.syntax);
            this.map = {};
            Object.defineProperty(this, "size", {
                get: function() {
                    return Object.keys(this.map).length
                }
            });
            if (o) {
                var n = Object.keys(o);
                for (var m = 0; m < n.length; m++) {
                    var l = this.keyElem.valueFromString(n[m]);
                    var q = this.valueElem.verifyValue(o[n[m]]);
                    this.map[this.keyElem.valueToString(l)] = {
                        key: l,
                        value: q
                    }
                }
            }
        };
        var h = f.prototype;

        function j(m) {
            var l = 0;
            return {
                next: function() {
                    if (l < m.length) {
                        return {
                            done: false,
                            value: m[l++]
                        }
                    }
                    return {
                        done: true
                    }
                }
            }
        }
        h.clear = function() {
            this.map = {}
        };
        h["delete"] = function(m) {
            var n = this.keyElem.valueToString(this.keyElem.verifyValue(m));
            var l = n in this.map;
            delete this.map[n];
            return l
        };
        h.entries = function() {
            var l = [];
            var o = Object.keys(this.map);
            for (var m = 0, n; m < o.length; m++) {
                l.push([(n = this.map[o[m]]).key, n.value])
            }
            return j(l)
        };
        h.keys = function() {
            var m = [];
            var n = Object.keys(this.map);
            for (var l = 0; l < n.length; l++) {
                m.push(this.map[n[l]].key)
            }
            return j(m)
        };
        h.values = function() {
            var l = [];
            var n = Object.keys(this.map);
            for (var m = 0; m < n.length; m++) {
                l.push(this.map[n[m]].value)
            }
            return j(l)
        };
        h.forEach = function(l, m) {
            var p = Object.keys(this.map);
            for (var n = 0, o; n < p.length; n++) {
                l.call(m, (o = this.map[p[n]]).value, o.key, this)
            }
        };
        h.set = function(l, n) {
            var o = this.keyElem.verifyValue(l);
            var m = this.valueElem.verifyValue(n);
            this.map[this.keyElem.valueToString(o)] = {
                key: o,
                value: m
            };
            return this
        };
        h.get = function(l) {
            var m = this.keyElem.valueToString(this.keyElem.verifyValue(l));
            if (!(m in this.map)) {
                return undefined
            }
            return this.map[m].value
        };
        h.has = function(l) {
            var m = this.keyElem.valueToString(this.keyElem.verifyValue(l));
            return (m in this.map)
        };
        return f
    })(e, e.Reflect);
    e.loadProto = function(h, g, f) {
        if (typeof g === "string" || (g && typeof g.file === "string" && typeof g.root === "string")) {
            f = g, g = undefined
        }
        return e.loadJson(e.DotProto.Parser.parse(h), g, f)
    };
    e.protoFromString = e.loadProto;
    e.loadProtoFile = function(g, j, f) {
        if (j && typeof j === "object") {
            f = j, j = null
        } else {
            if (!j || typeof j !== "function") {
                j = null
            }
        }
        if (j) {
            return e.Util.fetch(typeof g === "string" ? g : g.root + "/" + g.file, function(k) {
                if (k === null) {
                    j(Error("Failed to fetch file"));
                    return
                }
                try {
                    j(null, e.loadProto(k, f, g))
                } catch (l) {
                    j(l)
                }
            })
        }
        var h = e.Util.fetch(typeof g === "object" ? g.root + "/" + g.file : g);
        return h === null ? null : e.loadProto(h, f, g)
    };
    e.protoFromFile = e.loadProtoFile;
    e.newBuilder = function(f) {
        f = f || {};
        if (typeof f.convertFieldsToCamelCase === "undefined") {
            f.convertFieldsToCamelCase = e.convertFieldsToCamelCase
        }
        if (typeof f.populateAccessors === "undefined") {
            f.populateAccessors = e.populateAccessors
        }
        return new e.Builder(f)
    };
    e.loadJson = function(h, g, f) {
        if (typeof g === "string" || (g && typeof g.file === "string" && typeof g.root === "string")) {
            f = g, g = null
        }
        if (!g || typeof g !== "object") {
            g = e.newBuilder()
        }
        if (typeof h === "string") {
            h = JSON.parse(h)
        }
        g["import"](h, f);
        g.resolveAll();
        return g
    };
    e.loadJsonFile = function(g, j, f) {
        if (j && typeof j === "object") {
            f = j, j = null
        } else {
            if (!j || typeof j !== "function") {
                j = null
            }
        }
        if (j) {
            return e.Util.fetch(typeof g === "string" ? g : g.root + "/" + g.file, function(k) {
                if (k === null) {
                    j(Error("Failed to fetch file"));
                    return
                }
                try {
                    j(null, e.loadJson(JSON.parse(k), f, g))
                } catch (l) {
                    j(l)
                }
            })
        }
        var h = e.Util.fetch(typeof g === "object" ? g.root + "/" + g.file : g);
        return h === null ? null : e.loadJson(JSON.parse(h), f, g)
    };
    var d = function(o) {
        var k, h, g, f, l, n, j, m = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
        n = o.length;
        l = 0;
        j = "";
        while (l < n) {
            do {
                k = m[o.charCodeAt(l++) & 255]
            } while (l < n && k == -1);
            if (k == -1) {
                break
            }
            do {
                h = m[o.charCodeAt(l++) & 255]
            } while (l < n && h == -1);
            if (h == -1) {
                break
            }
            j += String.fromCharCode((k << 2) | ((h & 48) >> 4));
            do {
                g = o.charCodeAt(l++) & 255;
                if (g == 61) {
                    return j
                }
                g = m[g]
            } while (l < n && g == -1);
            if (g == -1) {
                break
            }
            j += String.fromCharCode(((h & 15) << 4) | ((g & 60) >> 2));
            do {
                f = o.charCodeAt(l++) & 255;
                if (f == 61) {
                    return j
                }
                f = m[f]
            } while (l < n && f == -1);
            if (f == -1) {
                break
            }
            j += String.fromCharCode(((g & 3) << 6) | f)
        }
        return j
    };
    var a = d("cGFja2FnZSBNb2R1bGVzOwptZXNzYWdlIHByb2J1ZiB7CgltZXNzYWdlIFZvaXBEeW5hbWljSW5wdXQKCXsKCQlyZXF1aXJlZCBpbnQzMiAgZW5naW5lVHlwZSA9IDE7CgkJcmVxdWlyZWQgc3RyaW5nIGNoYW5uZWxOYW1lID0gMjsKCQlvcHRpb25hbCBzdHJpbmcgY2hhbm5lbEV4dHJhID0gMzsKCX0KCgltZXNzYWdlIFZvaXBEeW5hbWljT3V0cHV0Cgl7CgkJIHJlcXVpcmVkIHN0cmluZyBkeW5hbWljS2V5PTE7Cgl9CiAgICBtZXNzYWdlIE5vdGlmeU1zZyB7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgdHlwZSA9IDE7CiAgICAgICAgb3B0aW9uYWwgaW50NjQgdGltZSA9IDI7CgkJb3B0aW9uYWwgc3RyaW5nIGNocm1JZD0zOwogICAgfQogICAgbWVzc2FnZSBTeW5jUmVxdWVzdE1zZyB7CiAgICAgICAgcmVxdWlyZWQgaW50NjQgc3luY1RpbWUgPSAxOwogICAgICAgIHJlcXVpcmVkIGJvb2wgaXNwb2xsaW5nID0gMjsKICAgICAgICBvcHRpb25hbCBib29sIGlzd2ViPTM7CgkJb3B0aW9uYWwgYm9vbCBpc1B1bGxTZW5kPTQ7Ly/mmK/lkKbpnIDopoHmi4nlj5blj5Hku7bnrrHvvIxmYWxzZeS4jeimge+8jHRydWXpnIDopoEKICAgIH0KICAgIG1lc3NhZ2UgVXBTdHJlYW1NZXNzYWdlIHsKICAgICAgICByZXF1aXJlZCBpbnQzMiBzZXNzaW9uSWQgPSAxOwogICAgICAgIHJlcXVpcmVkIHN0cmluZyBjbGFzc25hbWUgPSAyOwogICAgICAgIHJlcXVpcmVkIGJ5dGVzIGNvbnRlbnQgPSAzOwogICAgICAgIG9wdGlvbmFsIHN0cmluZyBwdXNoVGV4dCA9IDQ7CiAgICAgICAgb3B0aW9uYWwgc3RyaW5nIGFwcERhdGEgPSA1OwoJCXJlcGVhdGVkIHN0cmluZyB1c2VySWQgPSA2OwogICAgfQogICAgbWVzc2FnZSBEb3duU3RyZWFtTWVzc2FnZXMgewogICAgICAgIHJlcGVhdGVkIERvd25TdHJlYW1NZXNzYWdlIGxpc3QgPSAxOwogICAgICAgIHJlcXVpcmVkIGludDY0IHN5bmNUaW1lID0gMjsKICAgIH0KICAgIG1lc3NhZ2UgRG93blN0cmVhbU1lc3NhZ2UgewogICAgICAgIHJlcXVpcmVkIHN0cmluZyBmcm9tVXNlcklkID0gMTsKICAgICAgICByZXF1aXJlZCBDaGFubmVsVHlwZSB0eXBlID0gMjsKICAgICAgICBvcHRpb25hbCBzdHJpbmcgZ3JvdXBJZCA9IDM7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIGNsYXNzbmFtZSA9IDQ7CiAgICAgICAgcmVxdWlyZWQgYnl0ZXMgY29udGVudCA9IDU7CiAgICAgICAgcmVxdWlyZWQgaW50NjQgZGF0YVRpbWUgPSA2OwogICAgICAgIHJlcXVpcmVkIGludDY0IHN0YXR1cyA9IDc7CiAgICAgICAgb3B0aW9uYWwgaW50NjQgZXh0cmEgPSA4OwogICAgICAgIG9wdGlvbmFsIHN0cmluZyBtc2dJZCA9IDk7CgkJb3B0aW9uYWwgaW50MzIgZGlyZWN0aW9uID0gMTA7IAogICAgfQogICAgZW51bSBDaGFubmVsVHlwZSB7CiAgICAgICAgUEVSU09OID0gMTsKICAgICAgICBQRVJTT05TID0gMjsKICAgICAgICBHUk9VUCA9IDM7CiAgICAgICAgVEVNUEdST1VQID0gNDsKICAgICAgICBDVVNUT01FUlNFUlZJQ0UgPSA1OwogICAgICAgIE5PVElGWSA9IDY7CiAgICB9CiAgICBtZXNzYWdlIENyZWF0ZURpc2N1c3Npb25JbnB1dCB7CiAgICAgICAgb3B0aW9uYWwgc3RyaW5nIG5hbWUgPSAxOwogICAgfQogICAgbWVzc2FnZSBDcmVhdGVEaXNjdXNzaW9uT3V0cHV0IHsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgaWQgPSAxOwogICAgfQogICAgbWVzc2FnZSBDaGFubmVsSW52aXRhdGlvbklucHV0IHsKICAgICAgICByZXBlYXRlZCBzdHJpbmcgdXNlcnMgPSAxOwogICAgfQogICAgbWVzc2FnZSBMZWF2ZUNoYW5uZWxJbnB1dCB7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgbm90aGluZyA9IDE7CiAgICB9CiAgICBtZXNzYWdlIENoYW5uZWxFdmljdGlvbklucHV0IHsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgdXNlciA9IDE7CiAgICB9CiAgICBtZXNzYWdlIFJlbmFtZUNoYW5uZWxJbnB1dCB7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIG5hbWUgPSAxOwogICAgfQogICAgbWVzc2FnZSBDaGFubmVsSW5mb0lucHV0IHsKICAgICAgICByZXF1aXJlZCBpbnQzMiBub3RoaW5nID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgQ2hhbm5lbEluZm9PdXRwdXQgewogICAgICAgIHJlcXVpcmVkIENoYW5uZWxUeXBlIHR5cGUgPSAxOwogICAgICAgIHJlcXVpcmVkIHN0cmluZyBjaGFubmVsSWQgPSAyOwogICAgICAgIHJlcXVpcmVkIHN0cmluZyBjaGFubmVsTmFtZSA9IDM7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIGFkbWluVXNlcklkID0gNDsKICAgICAgICByZXBlYXRlZCBzdHJpbmcgZmlyc3RUZW5Vc2VySWRzID0gNTsKICAgICAgICByZXF1aXJlZCBpbnQzMiBvcGVuU3RhdHVzID0gNjsKICAgIH0KICAgIG1lc3NhZ2UgQ2hhbm5lbEluZm9zSW5wdXQgewogICAgICAgIHJlcXVpcmVkIGludDMyIHBhZ2UgPSAxOwogICAgICAgIG9wdGlvbmFsIGludDMyIG51bWJlciA9IDI7CiAgICB9CiAgICBtZXNzYWdlIENoYW5uZWxJbmZvc091dHB1dCB7CiAgICAgICAgcmVwZWF0ZWQgQ2hhbm5lbEluZm9PdXRwdXQgY2hhbm5lbHMgPSAxOwogICAgICAgIHJlcXVpcmVkIGludDMyIHRvdGFsID0gMjsKICAgIH0KICAgIG1lc3NhZ2UgTWVtYmVySW5mbyB7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIHVzZXJJZCA9IDE7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIHVzZXJOYW1lID0gMjsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgdXNlclBvcnRyYWl0ID0gMzsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgZXh0ZW5zaW9uID0gNDsKICAgIH0KICAgIG1lc3NhZ2UgR3JvdXBNZW1iZXJzSW5wdXQgewogICAgICAgIHJlcXVpcmVkIGludDMyIHBhZ2UgPSAxOwogICAgICAgIG9wdGlvbmFsIGludDMyIG51bWJlciA9IDI7CiAgICB9CiAgICBtZXNzYWdlIEdyb3VwTWVtYmVyc091dHB1dCB7CiAgICAgICAgcmVwZWF0ZWQgTWVtYmVySW5mbyBtZW1iZXJzID0gMTsKICAgICAgICByZXF1aXJlZCBpbnQzMiB0b3RhbCA9IDI7CiAgICB9CiAgICBtZXNzYWdlIEdldFVzZXJJbmZvSW5wdXQgewogICAgICAgIHJlcXVpcmVkIGludDMyIG5vdGhpbmcgPSAxOwogICAgfQogICAgbWVzc2FnZSBHZXRVc2VySW5mb091dHB1dCB7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIHVzZXJJZCA9IDE7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIHVzZXJOYW1lID0gMjsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgdXNlclBvcnRyYWl0ID0gMzsKICAgIH0KICAgIG1lc3NhZ2UgR2V0U2Vzc2lvbklkSW5wdXQgewogICAgICAgIHJlcXVpcmVkIGludDMyIG5vdGhpbmcgPSAxOwogICAgfQogICAgbWVzc2FnZSBHZXRTZXNzaW9uSWRPdXRwdXQgewogICAgICAgIHJlcXVpcmVkIGludDMyIHNlc3Npb25JZCA9IDE7CiAgICB9CiAgICBlbnVtIEZpbGVUeXBlIHsKICAgICAgICBpbWFnZSA9IDE7CiAgICAgICAgYXVkaW8gPSAyOwogICAgICAgIHZpZGVvID0gMzsKCQlmaWxlID0gNDsKICAgIH0KICAgIG1lc3NhZ2UgR2V0UU51cFRva2VuSW5wdXQgewogICAgICAgIHJlcXVpcmVkIEZpbGVUeXBlIHR5cGUgPSAxOwogICAgfQogICAgbWVzc2FnZSBHZXRRTmRvd25sb2FkVXJsSW5wdXQgewogICAgICAgIHJlcXVpcmVkIEZpbGVUeXBlIHR5cGUgPSAxOwogICAgICAgIHJlcXVpcmVkIHN0cmluZyBrZXkgPSAyOwoJCW9wdGlvbmFsIHN0cmluZyAgZmlsZU5hbWUgPSAzOwogICAgfQogICAgbWVzc2FnZSBHZXRRTnVwVG9rZW5PdXRwdXQgewogICAgICAgIHJlcXVpcmVkIGludDY0IGRlYWRsaW5lID0gMTsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgdG9rZW4gPSAyOwogICAgfQogICAgbWVzc2FnZSBHZXRRTmRvd25sb2FkVXJsT3V0cHV0IHsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgZG93bmxvYWRVcmwgPSAxOwogICAgfQogICAgbWVzc2FnZSBBZGQyQmxhY2tMaXN0SW5wdXQgewogICAgICAgIHJlcXVpcmVkIHN0cmluZyB1c2VySWQgPSAxOwogICAgfQogICAgbWVzc2FnZSBSZW1vdmVGcm9tQmxhY2tMaXN0SW5wdXQgewogICAgICAgIHJlcXVpcmVkIHN0cmluZyB1c2VySWQgPSAxOwogICAgfQogICAgbWVzc2FnZSBRdWVyeUJsYWNrTGlzdElucHV0IHsKICAgICAgICByZXF1aXJlZCBpbnQzMiBub3RoaW5nID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgUXVlcnlCbGFja0xpc3RPdXRwdXQgewogICAgICAgIHJlcGVhdGVkIHN0cmluZyB1c2VySWRzID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgQmxhY2tMaXN0U3RhdHVzSW5wdXQgewogICAgICAgIHJlcXVpcmVkIHN0cmluZyB1c2VySWQgPSAxOwogICAgfQogICAgbWVzc2FnZSBCbG9ja1B1c2hJbnB1dCB7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIGJsb2NrZWVJZCA9IDE7CiAgICB9CiAgICBtZXNzYWdlIE1vZGlmeVBlcm1pc3Npb25JbnB1dCB7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgb3BlblN0YXR1cyA9IDE7CiAgICB9CiAgICBtZXNzYWdlIEdyb3VwSW5wdXQgewogICAgICAgIHJlcGVhdGVkIEdyb3VwSW5mbyBncm91cEluZm8gPSAxOwogICAgfQogICAgbWVzc2FnZSBHcm91cE91dHB1dCB7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgbm90aGluZyA9IDE7CiAgICB9CiAgICBtZXNzYWdlIEdyb3VwSW5mbyB7CiAgICAgICAgcmVxdWlyZWQgc3RyaW5nIGlkID0gMTsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgbmFtZSA9IDI7CiAgICB9CiAgICBtZXNzYWdlIEdyb3VwSGFzaElucHV0IHsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgdXNlcklkID0gMTsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgZ3JvdXBIYXNoQ29kZSA9IDI7CiAgICB9CiAgICBtZXNzYWdlIEdyb3VwSGFzaE91dHB1dCB7CiAgICAgICAgcmVxdWlyZWQgR3JvdXBIYXNoVHlwZSByZXN1bHQgPSAxOwogICAgfQogICAgZW51bSBHcm91cEhhc2hUeXBlIHsKICAgICAgICBncm91cF9zdWNjZXNzID0gMHgwMDsKICAgICAgICBncm91cF9mYWlsdXJlID0gMHgwMTsKICAgIH0KICAgIG1lc3NhZ2UgQ2hybUlucHV0IHsKICAgICAgICByZXF1aXJlZCBpbnQzMiBub3RoaW5nID0gMTsKICAgIH0KICAgIG1lc3NhZ2UgQ2hybU91dHB1dCB7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgbm90aGluZyA9IDE7CiAgICB9CiAgICBtZXNzYWdlIENocm1QdWxsTXNnIHsKICAgICAgICByZXF1aXJlZCBpbnQ2NCBzeW5jVGltZSA9IDE7CiAgICAgICAgcmVxdWlyZWQgaW50MzIgY291bnQgPSAyOwogICAgfQoJCgltZXNzYWdlIENocm1QdWxsTXNnTmV3ICAvL+WuouaIt+err+aWsOeahOaLieWPluiBiuWkqeWupOa2iOaBrwoJewoJIHJlcXVpcmVkIGludDMyIGNvdW50ID0gMTsvL+aLieWPluadoeaVsCAgIDA66YCa55+l5ouJ5Y+WICAg6Z2eMO+8muS4u+WKqOaLieWPluWOhuWPsua2iOaBr+adoeaVsAoJIHJlcXVpcmVkIGludDY0IHN5bmNUaW1lID0gMjsvL+WQjOatpeaLieWPluaXtumXtAoJIG9wdGlvbmFsIHN0cmluZyBjaHJtSWQ9MzsvL+iBiuWkqeWupElECgl9CgkKICAgIG1lc3NhZ2UgUmVsYXRpb25zSW5wdXQKICAgIHsKICAgICAgICByZXF1aXJlZCBDaGFubmVsVHlwZSB0eXBlID0gMTsKICAgICAgICBvcHRpb25hbCBEb3duU3RyZWFtTWVzc2FnZSBtc2cgPTI7CgkJb3B0aW9uYWwgaW50MzIgY291bnQgPSAzOyAvLyDmi4nlj5bmnaHmlbAs6buY6K6kMDphbGwKICAgIH0KICAgIG1lc3NhZ2UgUmVsYXRpb25zT3V0cHV0CiAgICB7CiAgICAgICAgcmVwZWF0ZWQgUmVsYXRpb25JbmZvIGluZm8gPSAxOwogICAgfQogICAgbWVzc2FnZSBSZWxhdGlvbkluZm8KICAgIHsKICAgICAgICByZXF1aXJlZCBDaGFubmVsVHlwZSB0eXBlID0gMTsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgdXNlcklkID0gMjsKICAgICAgICBvcHRpb25hbCBEb3duU3RyZWFtTWVzc2FnZSBtc2cgPTM7CiAgICB9CiAgICBtZXNzYWdlIEhpc3RvcnlNZXNzYWdlSW5wdXQKICAgIHsKICAgICAgICByZXF1aXJlZCBzdHJpbmcgdGFyZ2V0SWQgPSAxOwogICAgICAgIHJlcXVpcmVkIGludDY0IGRhdGFUaW1lID0yOwogICAgICAgIHJlcXVpcmVkIGludDMyIHNpemUgID0gMzsKICAgIH0KCiAgICBtZXNzYWdlIEhpc3RvcnlNZXNzYWdlc091cHV0CiAgICB7CiAgICAgICAgcmVwZWF0ZWQgRG93blN0cmVhbU1lc3NhZ2UgbGlzdCA9IDE7CiAgICAgICAgcmVxdWlyZWQgaW50NjQgc3luY1RpbWUgPSAyOwogICAgICAgIHJlcXVpcmVkIGludDMyIGhhc01zZyA9IDM7CiAgICB9CgltZXNzYWdlIFF1ZXJ5Q2hhdHJvb21JbmZvSW5wdXQKCXsKCSByZXF1aXJlZCBpbnQzMiBjb3VudD0gMTsvL+acn+acm+iOt+WPluiBiuWkqeWupOeUqOaIt+eahOS6uuaVsO+8jOiMg+WbtOS4ujB+MjAKCSBvcHRpb25hbCBpbnQzMiBvcmRlcj0gMjsvL+aMieaXtumXtOaOkuW6j++8jOiMg+WbtO+8mjDvvIwx77yMMi7vvIgwOuS4jei/lOWbnu+8mzE65q2j5bqPKOacgOaXqeWKoOWFpSnvvJsyOuWAkuW6jyjmnIDmmZrliqDlhaUp77yJCgl9CgoJbWVzc2FnZSBRdWVyeUNoYXRyb29tSW5mb091dHB1dAoJewoJIG9wdGlvbmFsIGludDMyIHVzZXJUb3RhbE51bXMgPSAxOy8v5b2T5YmN6IGK5aSp5a6k5Lit55qE5oC75Lq65pWwCgkgcmVwZWF0ZWQgQ2hybU1lbWJlciB1c2VySW5mb3MgPSAyOy8v6L+U5Zue6YOo5YiG55So5oi35L+h5oGv5YiX6KGo77yI5Y+q5YyF5ZCrdXNlcklk5ZKMam9pblRpbWXlsZ7mgKfvvIkKCX0KCW1lc3NhZ2UgQ2hybU1lbWJlcgoJewoJIHJlcXVpcmVkIGludDY0IHRpbWUgPSAxOy8vTWVtYmVy55qEam9pblRpbWUKCSByZXF1aXJlZCBzdHJpbmcgaWQgPSAyOy8vTWVtYmVy55qEdXNlcklkCgl9CgltZXNzYWdlIE1QRm9sbG93SW5wdXQgIC8vbXDlhbPms6gv5Y+W5raI5YWz5rOoCgl7CgkJcmVxdWlyZWQgc3RyaW5nIGlkID0gMTsvL21waWQKCX0KCgltZXNzYWdlIE1QRm9sbG93T3V0cHV0Cgl7CgkJcmVxdWlyZWQgaW50MzIgbm90aGluZyA9IDE7Ly/ljaDkvY3lrZfmrrUKCQlvcHRpb25hbCBNcEluZm8gaW5mbyA9MjsvL+WFs+azqOeahG1waW5mbwoJfQoKCW1lc3NhZ2UgTUNGb2xsb3dJbnB1dCAgIC8vbWPlhbPms6gv5Y+W5raI5YWz5rOoCgl7CgkJcmVxdWlyZWQgc3RyaW5nIGlkID0gMTsvL21jaWQKCX0KCgltZXNzYWdlIE1DRm9sbG93T3V0cHV0Cgl7CgkJcmVxdWlyZWQgaW50MzIgbm90aGluZyA9IDE7Ly/ljaDkvY3lrZfmrrUKCQlvcHRpb25hbCBNcEluZm8gaW5mbyA9MjsvL+WFs+azqOeahG1waW5mbwoJfQoKCW1lc3NhZ2UgTXBJbmZvICAvL21w5Z+65pys5L+h5oGvCgl7CgkJcmVxdWlyZWQgc3RyaW5nIG1waWQ9MTsvL21wL21jaWQKCQlyZXF1aXJlZCBzdHJpbmcgbmFtZSA9IDI7Ly9kaXNwbGF5TmFtZQoJCXJlcXVpcmVkIHN0cmluZyB0eXBlID0gMzsvL21wL21jCgkJcmVxdWlyZWQgaW50NjQgdGltZT00Oy8v5YWs5LyX5biQ5Y+35L+u5pS55pe26Ze0CgkJb3B0aW9uYWwgc3RyaW5nIHBvcnRyYWl0VXJsPTU7Ly/lpLTlg48KCQlvcHRpb25hbCBzdHJpbmcgZXh0cmEgPTY7Ly/lhbbku5bkv6Hmga8oanNvbinvvIzmi4nlj5bnmoTml7blgJnljIXlkKvoj5zljZXjgIHnroDku4vnrYnkv6Hmga/jgIIKCX0KCgltZXNzYWdlIFNlYXJjaE1wSW5wdXQgLy/moLnmja7lhazkvJfluJDlj7dpZOWujOWFqOWMuemFjeafpeaJvgoJewoJCXJlcXVpcmVkIGludDMyIHR5cGU9MTsvL+agh+W/l+S9jSzml6XlkI7mjInkvY3mnaXlgZrmianlsZUKCQlyZXF1aXJlZCBzdHJpbmcgaWQ9MjsvL21waWQvbWNpZC9kaXNwbGF5TmFtZQoJfQoKCW1lc3NhZ2UgU2VhcmNoTXBPdXRwdXQKCXsKCQlyZXF1aXJlZCBpbnQzMiBub3RoaW5nPTE7Ly/ljaDkvY3nrKYKCQlyZXBlYXRlZCBNcEluZm8gaW5mbyA9IDI7Ly/lhazkvJfluJDlj7cKCX0KCgltZXNzYWdlIFB1bGxNcElucHV0IC8v56uv5LiK5ouJ5Y+W5YWs5LyX6LSm5Y+35L+h5oGvCgl7CgkJcmVxdWlyZWQgaW50NjQgdGltZT0xOy8v5YWs5LyX5biQ5Y+35L+u5pS55pe26Ze0CgkJcmVxdWlyZWQgc3RyaW5nIG1waWQ9MjsvL+err+S4iue8k+WtmOWFrOS8l+W4kOWPt+eahGlk55qEbWQ15LiyCgl9CgoJbWVzc2FnZSBQdWxsTXBPdXRwdXQKCXsKCQlyZXF1aXJlZCBpbnQzMiBzdGF0dXM9MTsvL+aYr+WQpuaciea3u+WKoOWSjOWIoOmZpO+8jOWmguaenOacieWPmOWMluWImei/lOWbnuWFqOmDqO+8jOWQpuWImei/lOWbnuabtOaWsOeahAoJCXJlcGVhdGVkIE1wSW5mbyBpbmZvID0gMjsvL+WFrOS8l+W4kOWPtwoJfQoJbWVzc2FnZSBIaXN0b3J5TXNnSW5wdXQgIAoJewoJCW9wdGlvbmFsIHN0cmluZyB0YXJnZXRJZCA9IDE7Ly/ogYrlpKnlrqRJRAoJCW9wdGlvbmFsIGludDY0IHRpbWUgPSAyOy8v5p+l6K+i5pe26Ze054K5CgkJb3B0aW9uYWwgaW50MzIgY291bnQgID0gMzsvL+aLieWPluadoeaVsAoJCW9wdGlvbmFsIGludDMyIG9yZGVyID0gNDsvL+aLieWPlumhuuW6jyAoMe+8muato+W6j++8mzDvvJrlgJLluo8pCgl9CgoJbWVzc2FnZSBIaXN0b3J5TXNnT3VwdXQgIC8v6L+U5Zue6IGK5aSp5a6k5Y6G5Y+y5raI5oGvCgl7CgkJcmVwZWF0ZWQgRG93blN0cmVhbU1lc3NhZ2UgbGlzdCA9IDE7Ly/miYDmi6XmnInnmoTmtojmga/vvIhsaXN05aSN57G75Z6L77yJCgkJcmVxdWlyZWQgaW50NjQgc3luY1RpbWUgPSAyOy8v5ZCM5q2l5pe26Ze0CgkJcmVxdWlyZWQgaW50MzIgaGFzTXNnID0gMzsgLy/mmK/lkKbov5jmnInlkI7nu63ljoblj7Lmtojmga8KCX0KfQ==");
    window.Modules = e.loadProto(a, undefined, "").build("Modules").probuf;
    if (typeof RongIMLib != "undefined" && typeof RongIMLib.RongIMClient != "undefined") {
        if (!RongIMLib.RongIMClient._memoryStore.hasModules && Object.prototype.toString.call(RongIMLib.RongIMClient._memoryStore.hasModules) == "[object Boolean]") {
            RongIMLib.RongIMClient._memoryStore.hasModules = true;
            RongIMLib.RongIMClient.connect(RongIMClient._memoryStore.token, RongIMClient._memoryStore.callback)
        }
    }
    return e
});