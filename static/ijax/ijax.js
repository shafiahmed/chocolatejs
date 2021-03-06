    if (typeof window !== "undefined" && window !== null) window.exports = {};
    // Generated by CoffeeScript 1.6.2
(function() {
  if (typeof window !== "undefined" && window !== null) {
    window.modules = {
      intentware: window.exports = window.Intentware = {}
    };
    window.Intentware._require = window.require;
    window.require = function() {
      return exports;
    };
  }

}).call(this);

    if (typeof window !== "undefined" && window !== null) window.modules['intentware/core'] = window.exports;

    if (typeof window !== "undefined" && window !== null) window.exports = {};
    // Generated by CoffeeScript 1.6.3
(function() {
  var BufferClass, i, parse, unparse, uuid, v1, v4, whatwgRNG, _byteToHex, _clockseq, _global, _hexToByte, _lastMSecs, _lastNSecs, _nodeId, _previousRoot, _rb, _rnds, _rnds8, _rng, _seedBytes;

  _global = this;

  _rng = void 0;

  if (typeof require === "function") {
    try {
      _rb = require("crypto").randomBytes;
      _rng = _rb && function() {
        return _rb(16);
      };
    } catch (_error) {}
  }

  if (!_rng && _global.crypto && crypto.getRandomValues) {
    _rnds8 = new Uint8Array(16);
    _rng = whatwgRNG = function() {
      crypto.getRandomValues(_rnds8);
      return _rnds8;
    };
  }

  if (!_rng) {
    _rnds = new Array(16);
    _rng = function() {
      var i, r;
      i = 0;
      r = void 0;
      while (i < 16) {
        if ((i & 0x03) === 0) {
          r = Math.random() * 0x100000000;
        }
        _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
        i++;
      }
      return _rnds;
    };
  }

  BufferClass = (typeof Buffer === "function" ? Buffer : Array);

  _byteToHex = [];

  _hexToByte = {};

  i = 0;

  while (i < 256) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
    i++;
  }

  parse = function(s, buf, offset) {
    var ii;
    i = (buf && offset) || 0;
    ii = 0;
    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
      if (ii < 16) {
        return buf[i + ii++] = _hexToByte[oct];
      }
    });
    while (ii < 16) {
      buf[i + ii++] = 0;
    }
    return buf;
  };

  unparse = function(buf, offset) {
    var bth;
    i = offset || 0;
    bth = _byteToHex;
    return bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + "-" + bth[buf[i++]] + bth[buf[i++]] + "-" + bth[buf[i++]] + bth[buf[i++]] + "-" + bth[buf[i++]] + bth[buf[i++]] + "-" + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]];
  };

  _seedBytes = _rng();

  _nodeId = [_seedBytes[0] | 0x01, _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]];

  _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

  _lastMSecs = 0;

  _lastNSecs = 0;

  v1 = function(options, buf, offset) {
    var b, clockseq, dt, msecs, n, node, nsecs, tl, tmh;
    i = buf && offset || 0;
    b = buf || [];
    options = options || {};
    clockseq = (options.clockseq != null ? options.clockseq : _clockseq);
    msecs = (options.msecs != null ? options.msecs : new Date().getTime());
    nsecs = (options.nsecs != null ? options.nsecs : _lastNSecs + 1);
    dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs) / 10000;
    if (dt < 0 && (options.clockseq == null)) {
      clockseq = clockseq + 1 & 0x3fff;
    }
    if ((dt < 0 || msecs > _lastMSecs) && (options.nsecs == null)) {
      nsecs = 0;
    }
    if (nsecs >= 10000) {
      throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    }
    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;
    msecs += 12219292800000;
    tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;
    tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;
    b[i++] = tmh >>> 24 & 0xf | 0x10;
    b[i++] = tmh >>> 16 & 0xff;
    b[i++] = clockseq >>> 8 | 0x80;
    b[i++] = clockseq & 0xff;
    node = options.node || _nodeId;
    n = 0;
    while (n < 6) {
      b[i + n] = node[n];
      n++;
    }
    if (buf) {
      return buf;
    } else {
      return unparse(b);
    }
  };

  v4 = function(options, buf, offset) {
    var ii, rnds;
    i = buf && offset || 0;
    if (typeof options === "string") {
      buf = (options === "binary" ? new BufferClass(16) : null);
      options = null;
    }
    options = options || {};
    rnds = options.random || (options.rng || _rng)();
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;
    if (buf) {
      ii = 0;
      while (ii < 16) {
        buf[i + ii] = rnds[ii];
        ii++;
      }
    }
    return buf || unparse(rnds);
  };

  uuid = v4;

  uuid.v1 = v1;

  uuid.v4 = v4;

  uuid.parse = parse;

  uuid.unparse = unparse;

  uuid.BufferClass = BufferClass;

  if (typeof define === "function" && define.amd) {
    define(function() {
      return uuid;
    });
  } else if (typeof module !== "undefined" && module.exports) {
    module.exports = uuid;
  } else {
    _previousRoot = _global.Uuid;
    uuid.noConflict = function() {
      _global.Uuid = _previousRoot;
      return uuid;
    };
    _global.Uuid = _global.exports = uuid;
  }

  uuid.isUuid = function(value) {
    var parsed, unparsed;
    if ((value != null) && Object.prototype.toString.apply(value === '[object String]' && value.length === 36)) {
      parsed = parse(value);
      unparsed = unparse(parsed);
      return value === unparsed;
    } else if (Buffer.isBuffer(value)) {
      return value.length === 16;
    } else {
      return false;
    }
  };

}).call(this);

    if (typeof window !== "undefined" && window !== null) window.modules['intentware/uuid'] = window.exports;

    if (typeof window !== "undefined" && window !== null) window.exports = {};
    // Generated by CoffeeScript 1.6.2
(function() {
  var Loader, require, resolve, use_cache, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (typeof window !== "undefined" && window !== null) {
    window.modules['intentware/ajax'] = window.exports = window.Intentware.Ajax = {};
  } else {
    return;
  }

  exports.Loader = Loader = (function(_super) {
    __extends(_Class, _super);

    function _Class() {
      _ref = _Class.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    _Class.prototype.success = function(text) {
      return this.onSuccess(this.processScripts('window.exports = {};\n' + text));
    };

    return _Class;

  })(Request);

  use_cache = true;

  window.require = require = function(modulename, filename, options) {
    var cachedModule, cur_use_cache, request, result;

    if (arguments.length === 2 && Object.prototype.toString.apply(filename !== '[object String]')) {
      options = filename;
      filename = null;
    }
    if (filename == null) {
      filename = modulename;
    }
    filename = resolve(filename);
    if ((options != null ? options.use_cache : void 0) != null) {
      cur_use_cache = use_cache;
      use_cache = options.use_cache;
    }
    result = typeof Intentware._require === "function" ? Intentware._require(filename) : void 0;
    if (result != null) {
      return result;
    }
    if (use_cache) {
      cachedModule = window.modules[filename];
      if (cachedModule != null) {
        return cachedModule;
      }
    }
    window.exports = {};
    request = new Loader({
      url: '/static/ijax/' + filename + '.js',
      async: false,
      onSuccess: null,
      onFailure: function(xhr) {
        return alert('Error: ' + xhr.status);
      }
    }).get();
    result = window.modules[filename] = window.exports;
    window.exports = void 0;
    if ((options != null ? options.use_cache : void 0) != null) {
      use_cache = cur_use_cache;
    }
    return result;
  };

  window.require.resolve = resolve = function(filename) {
    var i;

    filename = filename.toLowerCase().replace(/^\.\//, '').replace(/\.\.\//g, '').replace(/^general\//, '').replace(/^client\//, '');
    return filename = (i = filename.lastIndexOf('.')) >= 0 ? filename.slice(0, i) : filename;
  };

  window.require.cache = function(used) {
    return use_cache = used;
  };

  /*
  CSS Browser Selector v0.4.0 (Nov 02, 2010)
  Rafael Lima (http://rafael.adm.br)
  http://rafael.adm.br/css_browser_selector
  License: http://creativecommons.org/licenses/by/2.5/
  Contributors: http://rafael.adm.br/css_browser_selector#contributors
  */


  (function(u) {
    var b, c, g, h, is_, m, o, s, ua, w;

    ua = u.toLowerCase();
    is_ = function(t) {
      return ua.indexOf(t) > -1;
    };
    g = "gecko";
    w = "webkit";
    s = "safari";
    o = "opera";
    m = "mobile";
    h = document.documentElement;
    b = [(!(/opera|webtv/i.test(ua)) && /msie\s(\d)/.test(ua) ? "ie ie" + RegExp.$1 : (is_("firefox/2") ? g + " ff2" : (is_("firefox/3.5") ? g + " ff3 ff3_5" : (is_("firefox/3.6") ? g + " ff3 ff3_6" : (is_("firefox/3") ? g + " ff3" : (is_("gecko/") ? g : (is_("opera") ? o + (/version\/(\d+)/.test(ua) ? " " + o + RegExp.$1 : (/opera(\s|\/)(\d+)/.test(ua) ? " " + o + RegExp.$2 : "")) : (is_("konqueror") ? "konqueror" : (is_("blackberry") ? m + " blackberry" : (is_("android") ? m + " android" : (is_("chrome") ? w + " chrome" : (is_("iron") ? w + " iron" : (is_("applewebkit/") ? w + " " + s + (/version\/(\d+)/.test(ua) ? " " + s + RegExp.$1 : "") : (is_("mozilla/") ? g : "")))))))))))))), (is_("j2me") ? m + " j2me" : (is_("iphone") ? m + " iphone" : (is_("ipod") ? m + " ipod" : (is_("ipad") ? m + " ipad" : (is_("mac") ? "mac" : (is_("darwin") ? "mac" : (is_("webtv") ? "webtv" : (is_("win") ? "win" + (is_("windows nt 6.0") ? " vista" : "") : (is_("freebsd") ? "freebsd" : (is_("x11") || is_("linux") ? "linux" : "")))))))))), "js"];
    c = b.join(" ");
    h.className += " " + c;
    return c;
  })(navigator.userAgent);

}).call(this);

    if (typeof window !== "undefined" && window !== null) window.modules['intentware/ajax'] = window.exports;

    if (typeof window !== "undefined" && window !== null) window.exports = {};
    // Generated by CoffeeScript 1.6.1

/*
    Intention
    Data
    Action
    Document
    Workflow
    Interface
    Actor
    Reserve
    Prototype
*/


(function() {



}).call(this);

    if (typeof window !== "undefined" && window !== null) window.modules['intentware/intention'] = window.exports;

    if (typeof window !== "undefined" && window !== null) window.exports = {};
    // Generated by CoffeeScript 1.6.2
(function() {
  var Data, Intentware, Uuid, all, _module,
    __hasProp = {}.hasOwnProperty;

  _module = typeof window !== "undefined" && window !== null ? window : module;

  Intentware = require('../../general/intentware/core');

  Uuid = require('../../general/intentware/uuid');

  _module.exports = Data = (function() {
    function _Class(uuid, name, data) {
      this.uuid = uuid != null ? uuid : Uuid();
      this.name = name;
      this.data = data;
      return;
    }

    return _Class;

  })();

  all = {};

  Data.get = function(uuid) {
    return all[uuid];
  };

  Data.register = function(io) {
    return all[io.uuid] = io;
  };

  Data.forget = function(io) {
    return delete all[io.uuid];
  };

  Data.type = function(o) {
    return Object.prototype.toString.apply(o);
  };

  Data.Type = {
    Object: '[object Object]',
    Array: '[object Array]',
    Boolean: '[object Boolean]',
    Number: '[object Number]',
    Date: '[object Date]',
    Function: '[object Function]',
    Math: '[object Math]',
    String: '[object String]',
    Undefined: '[object Undefined]',
    Null: '[object Null]'
  };

  Data.toString_ = Data.toString;

  Data.stringify = Data.toString = function() {
    var doit, newline, object, options, tab, _ref;

    if (arguments.length === 0) {
      return Data.toString_();
    }
    object = arguments[0];
    options = (_ref = arguments[1]) != null ? _ref : {};
    if (options.prettify === true) {
      tab = '    ';
      newline = '\n';
    } else {
      tab = newline = '';
    }
    doit = function(o, level) {
      var indent, k, ni, nit, result, type, v;

      result = [];
      if (level == null) {
        level = 0;
      }
      indent = ((function() {
        var _i, _results;

        _results = [];
        for (_i = 0; 0 <= level ? _i < level : _i > level; 0 <= level ? _i++ : _i--) {
          _results.push(tab);
        }
        return _results;
      })()).join('');
      ni = newline + indent;
      nit = ni + tab;
      type = Object.prototype.toString.apply(o);
      result.push((function() {
        switch (type) {
          case '[object Object]':
            return "{" + nit + (((function() {
              var _results;

              _results = [];
              for (k in o) {
                if (!__hasProp.call(o, k)) continue;
                v = o[k];
                _results.push(k + ':' + doit(v, level + 1));
              }
              return _results;
            })()).join(',' + nit)) + ni + "}";
          case '[object Array]':
            return "function () {" + nit + "var a = []; var o = {" + nit + (((function() {
              var _results;

              _results = [];
              for (k in o) {
                if (!__hasProp.call(o, k)) continue;
                v = o[k];
                _results.push(k + ':' + doit(v, level + 1));
              }
              return _results;
            })()).join(',' + nit)) + "};" + nit + "for (var k in o) {a[k] = o[k];} return a; }()";
          case '[object Boolean]':
            return o;
          case '[object Number]':
            return o;
          case '[object Date]':
            return "new Date(" + (o.valueOf()) + ")";
          case '[object Function]':
            return o.toString();
          case '[object Math]':
            return 'Math';
          case '[object String]':
            return "'" + (o.replace(/\'/g, '\\\'')) + "'";
          case '[object Undefined]':
            return 'void 0';
          case '[object Null]':
            return 'null';
          case '[object Buffer]':
          case '[object SlowBuffer]':
            if (o.length === 16) {
              return Uuid.unparse(o);
            } else {
              return o.toString();
            }
        }
      })());
      return result;
    };
    return doit(object).join(', ');
  };

  Data.parse = Data.fromString = function(str) {
    return (new Function("return " + str))();
  };

  if (typeof window !== "undefined" && window !== null) {
    window.Intentware.Data = window.exports;
  }

}).call(this);

    if (typeof window !== "undefined" && window !== null) window.modules['intentware/data'] = window.exports;

    if (typeof window !== "undefined" && window !== null) window.exports = {};
    // Generated by CoffeeScript 1.6.1
(function() {
  var Data, Document, _module,
    __hasProp = {}.hasOwnProperty;

  _module = typeof window !== "undefined" && window !== null ? window : module;

  Data = require('../../general/intentware/data');

  _module.exports = Document = (function() {

    function _Class(o) {
      var materialize;
      if ((o != null ? o.uuid : void 0) == null) {
        o = new Data;
      }
      materialize = function(o, root, parent) {
        var idoc, key, member, _ref, _ref1;
        if ((o == null) || typeof o !== 'object') {
          return o;
        }
        idoc = parent == null ? root : new o.constructor();
        for (key in o) {
          if (!__hasProp.call(o, key)) continue;
          idoc[key] = materialize(o[key], root, o.matter ? idoc : parent);
        }
        if ((idoc.uuid != null) && (parent != null)) {
          idoc.parent = parent;
        }
        Data.register(idoc);
        if (parent != null) {
          if (idoc.name != null) {
            if ((_ref = parent.members) == null) {
              parent.members = {};
            }
            member = parent.members[idoc.name];
            if (member != null) {
              if (Data.type(member) === Data.Type.Array) {
                member.push(idoc);
              } else {
                parent.members[idoc.name] = [member, idoc];
              }
            } else {
              parent.members[idoc.name] = idoc;
            }
          } else if (idoc.uuid != null) {
            ((_ref1 = parent.items) != null ? _ref1 : parent.items = []).push(idoc);
          }
        }
        return idoc;
      };
      return materialize(o, this);
    }

    return _Class;

  })();

  if (typeof window !== "undefined" && window !== null) {
    window.Intentware.Document = window.exports;
  }

}).call(this);

    if (typeof window !== "undefined" && window !== null) window.modules['intentware/document'] = window.exports;

    if (typeof window !== "undefined" && window !== null) window.exports = {};
    // Generated by CoffeeScript 1.4.0
(function() {
  var Chocokup, Ui, helpers, _module,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chocokup = require('../chocokup');

  helpers = {
    web_control: function() {
      var args, attributes, content, id, id_class, type, _ref;
      type = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      _ref = verify.apply(null, args), id_class = _ref.id_class, attributes = _ref.attributes, content = _ref.content;
      if (!(id_class != null)) {
        id_class = "#" + (id = "ijax_wc_" + this.webcontrol_index++);
      }
      (attributes != null ? attributes : attributes = {})['ijax-ui-type'] = type;
      return tag(type, id_class, attributes, content);
    },
    button: function() {
      return web_control.apply(null, ['button'].concat(__slice.call(arguments)));
    }
  };

  Ui = (function(_super) {
    var k, v;

    __extends(Ui, _super);

    function Ui() {
      return Ui.__super__.constructor.apply(this, arguments);
    }

    for (k in helpers) {
      if (!__hasProp.call(helpers, k)) continue;
      v = helpers[k];
      Ui.helpers[k] = v;
    }

    return Ui;

  })(Chocokup);

  Ui.Document = (function(_super) {
    var k, v;

    __extends(Document, _super);

    function Document() {
      return Document.__super__.constructor.apply(this, arguments);
    }

    for (k in helpers) {
      if (!__hasProp.call(helpers, k)) continue;
      v = helpers[k];
      Document.helpers[k] = v;
    }

    Document.manifest = {
      cache: "/static/mootools/mootools-core-uncompressed.js\n/static/coffee-script/coffee-script.js\n/static/ijax/ijax.js"
    };

    Document.prototype.body_template = function() {
      var _ref;
      script({
        src: "/static/mootools/mootools-core-uncompressed.js",
        type: "text/javascript",
        charset: "utf-8"
      });
      if ((_ref = this.params) != null ? _ref.with_coffee : void 0) {
        script({
          src: "/static/coffee-script/coffee-script.js",
          type: "text/javascript",
          charset: "utf-8"
        });
      }
      script({
        src: "/static/ijax/ijax.js",
        type: "text/javascript",
        charset: "utf-8"
      });
      text("" + this.content);
      return coffeescript(function() {
        return window.addEvent('domready', Intentware.Ui.bindElements);
      });
    };

    return Document;

  })(Chocokup.Document);

  Ui.Panel = (function(_super) {
    var k, v;

    __extends(Panel, _super);

    function Panel() {
      return Panel.__super__.constructor.apply(this, arguments);
    }

    for (k in helpers) {
      if (!__hasProp.call(helpers, k)) continue;
      v = helpers[k];
      Panel.helpers[k] = v;
    }

    return Panel;

  })(Chocokup.Panel);

  _module = typeof window !== "undefined" && window !== null ? window : module;

  _module.exports = {
    Ui: Ui
  };

  if (typeof window !== "undefined" && window !== null) {
    window.Intentware.Ui = Ui;
  }

}).call(this);

    if (typeof window !== "undefined" && window !== null) window.modules['intentware/interface'] = window.exports;

    if (typeof window !== "undefined" && window !== null) window.exports = {};
    // Generated by CoffeeScript 1.6.1
(function() {
  var Intentware, Prototype, _module;

  _module = typeof window !== "undefined" && window !== null ? window : module;

  Intentware = require('../../general/intentware/core');

  _module.exports = Prototype = (function() {

    function _Class() {}

    return _Class;

  })();

  if (typeof window !== "undefined" && window !== null) {
    window.Intentware.Prototype = window.exports;
  }

}).call(this);

    if (typeof window !== "undefined" && window !== null) window.modules['intentware/prototype'] = window.exports;

    if (typeof window !== "undefined" && window !== null) window.exports = {};
    // Generated by CoffeeScript 1.6.1
(function() {
  var Intentware, defered_elements;

  Intentware = require('../../../../general/intentware/core');

  if (typeof window !== "undefined" && window !== null) {
    window.exports = Intentware.Ui;
  } else {
    return;
  }

  defered_elements = [];

  exports.bindElements = function() {
    var attribute, attribute_name_part, ijax_attribute, index, item, options_root, _i, _j, _k, _len, _len1, _ref, _ref1, _ref2, _results;
    _ref = $$('[ijax-ui-type]');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      options_root = {};
      _ref1 = item.attributes;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        attribute = _ref1[_j];
        attribute_name_part = attribute.name.split('-');
        if (attribute_name_part[0] === 'ijax') {
          ijax_attribute = options_root;
          for (index = _k = 1, _ref2 = attribute_name_part.length; 1 <= _ref2 ? _k < _ref2 : _k > _ref2; index = 1 <= _ref2 ? ++_k : --_k) {
            ijax_attribute = ijax_attribute[attribute_name_part[index]] = index === attribute_name_part.length - 1 ? attribute.value : {};
          }
        }
      }
      _results.push(item.ijax = new Intentware.Ui[options_root.ui.type.replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
      })](item, options_root));
    }
    return _results;
  };

}).call(this);

    if (typeof window !== "undefined" && window !== null) window.modules['intentware/interface/ui/core'] = window.exports;

    if (typeof window !== "undefined" && window !== null) window.exports = {};
    // Generated by CoffeeScript 1.6.2
(function() {
  var _module;

  _module = typeof window !== "undefined" && window !== null ? window : module;

  _module.exports = {
    serialize: function(self, fn) {
      var defer, defered, next;

      if (typeof self === 'function') {
        fn = self;
        self = fn;
      }
      defered = [];
      defer = function(fn) {
        return defered.push(function(next) {
          return fn.call(self, next);
        });
      };
      fn.call(self, defer);
      return defered.shift().call(self, next = function() {
        if (defered.length) {
          return defered.shift().call(self, next);
        }
      });
    }
  };

  if (typeof window !== "undefined" && window !== null) {
    window.Intentware.async = window.exports;
  }

}).call(this);

    if (typeof window !== "undefined" && window !== null) window.modules['intentware/async'] = window.exports;

    if (typeof window !== "undefined" && window !== null) window.exports = {};
    // Generated by CoffeeScript 1.6.2
(function() {
  var _module;

  _module = typeof window !== "undefined" && window !== null ? window : module;

  _module.exports = {
    serialize: function(self, fn) {
      var defer, defered, next;

      if (typeof self === 'function') {
        fn = self;
        self = fn;
      }
      defered = [];
      defer = function(fn) {
        return defered.push(function(next) {
          return fn.call(self, next);
        });
      };
      fn.call(self, defer);
      return defered.shift().call(self, next = function() {
        if (defered.length) {
          return defered.shift().call(self, next);
        }
      });
    }
  };

  if (typeof window !== "undefined" && window !== null) {
    window.Intentware.async = window.exports;
  }

}).call(this);

    if (typeof window !== "undefined" && window !== null) window.modules['intentware/chocoflow'] = window.exports;

