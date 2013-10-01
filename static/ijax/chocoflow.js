// Generated by CoffeeScript 1.6.2
(function() {
  var _module;

  _module = typeof window !== "undefined" && window !== null ? window : module;

  _module.exports = {
    serialize: function(self, local, fn) {
      var defer, defered, next;

      if (typeof local === 'function') {
        fn = local;
        local = {};
      }
      if (typeof self === 'function') {
        fn = self;
        self = fn;
        local = {};
      }
      defered = [];
      defer = function(fn) {
        return defered.push(fn);
      };
      fn.call(self, defer, local);
      return defered.shift().call(self, next = function() {
        if (defered.length) {
          return defered.shift().call(self, next);
        }
      });
    },
    parallelize: function(self, fn) {
      var count, dfn, end, join, on_join, push, pushed, _i, _len, _results;

      if (typeof self === 'function') {
        fn = self;
        self = fn;
      }
      pushed = [];
      on_join = null;
      join = function(fn) {
        return on_join = fn;
      };
      count = 0;
      end = function() {
        count += -1;
        if (count === 0) {
          return on_join != null ? on_join.call(self) : void 0;
        }
      };
      push = function(fn) {
        return pushed.push(function() {
          return setTimeout((function() {
            fn.call(self);
            return end();
          }), 0);
        });
      };
      fn.call(self, push, join);
      count = pushed.length;
      _results = [];
      for (_i = 0, _len = pushed.length; _i < _len; _i++) {
        dfn = pushed[_i];
        _results.push(dfn.call(self));
      }
      return _results;
    }
  };

  if (typeof window !== "undefined" && window !== null) {
    window.Chocoflow = window.exports;
  }

}).call(this);