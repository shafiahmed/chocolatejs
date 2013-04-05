// Generated by CoffeeScript 1.4.0

/*
  Generate a RFC4122(v4) UUID

  Documentation at https://github.com/broofa/node-uuid
*/


(function() {
  var BufferClass, ff, i, parse, rnds, toNumber, toString, unparse, useCrypto, uuid, _buf, _i;

  BufferClass = (typeof Buffer === "function" ? Buffer : Array);

  _buf = new BufferClass(16);

  toString = [];

  toNumber = {};

  for (i = _i = 0; _i < 256; i = ++_i) {
    toString[i] = (i + 0x100).toString(16).substr(1);
    toNumber[toString[i]] = i;
  }

  parse = function(s) {
    var buf;
    buf = new BufferClass(16);
    i = 0;
    s.toLowerCase().replace(/[0-9a-f][0-9a-f]/g, function(octet) {
      return buf[i++] = toNumber[octet];
    });
    return buf;
  };

  unparse = function(buf) {
    var b, tos;
    tos = toString;
    b = buf;
    return ''.concat(tos[b[0]], tos[b[1]], tos[b[2]], tos[b[3]], '-', tos[b[4]], tos[b[5]], '-', tos[b[6]], tos[b[7]], '-', tos[b[8]], tos[b[9]], '-', tos[b[10]], tos[b[11]], tos[b[12]], tos[b[13]], tos[b[14]], tos[b[15]]);
  };

  ff = 0xff;

  useCrypto = this.crypto && crypto.getRandomValues;

  rnds = useCrypto ? new Uint32Array(4) : new Array(4);

  uuid = function(fmt, buf, offset) {
    var b, r;
    b = fmt !== 'binary' ? _buf : (buf ? buf : new BufferClass(16));
    i = buf && offset || 0;
    if (useCrypto) {
      crypto.getRandomValues(rnds);
    } else {
      rnds[0] = Math.random() * 0x100000000;
      rnds[1] = Math.random() * 0x100000000;
      rnds[2] = Math.random() * 0x100000000;
      rnds[3] = Math.random() * 0x100000000;
    }
    r = rnds[0];
    b[i++] = r & ff;
    b[i++] = r >>> 8 & ff;
    b[i++] = r >>> 16 & ff;
    b[i++] = r >>> 24 & ff;
    r = rnds[1];
    b[i++] = r & ff;
    b[i++] = r >>> 8 & ff;
    b[i++] = r >>> 16 & 0x0f | 0x40;
    b[i++] = r >>> 24 & ff;
    r = rnds[2];
    b[i++] = r & 0x3f | 0x80;
    b[i++] = r >>> 8 & ff;
    b[i++] = r >>> 16 & ff;
    b[i++] = r >>> 24 & ff;
    r = rnds[3];
    b[i++] = r & ff;
    b[i++] = r >>> 8 & ff;
    b[i++] = r >>> 16 & ff;
    b[i++] = r >>> 24 & ff;
    if (!(fmt != null)) {
      return unparse(b);
    } else {
      return b;
    }
  };

  uuid.parse = parse;

  uuid.unparse = unparse;

  uuid.BufferClass = BufferClass;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = uuid;
  } else {
    if (typeof window !== "undefined" && window !== null) {
      window.Uuid = window.exports = uuid;
    } else {
      this.uuid = uuid;
    }
  }

}).call(this);