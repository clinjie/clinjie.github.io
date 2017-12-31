"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _consts = require("../consts");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Inject = function () {
  function Inject(hexo, opts) {
    _classCallCheck(this, Inject);

    this.hexo = hexo;
    this.opts = opts;
  }

  _createClass(Inject, [{
    key: "register",
    value: function register() {
      var filter = this.hexo.extend.filter;

      var injectors = {
        mathjax: this._injectMathJax.bind(this),
        katex: this._injectKaTeX.bind(this)
      };
      filter.register("inject_ready", injectors[this.opts.engine]);
    }
  }, {
    key: "_injectMathJax",
    value: function _injectMathJax(inject) {
      var data = this.opts.mathjax;
      var opts = {
        data: data,
        inline: true,
        shouldInject: function shouldInject(src) {
          return src.indexOf(_consts.MATH_MARKER) >= 0 || _consts.INLINE_MATH_REGEX.test(src) || _consts.BLOCK_MATH_REGEX.test(src);
        }
      };
      inject.bodyEnd.require('../../asset/inject.swig', opts);
    }
  }, {
    key: "_injectKaTeX",
    value: function _injectKaTeX(inject) {
      var css = this.opts.katex.css;


      var opts = {
        shouldInject: function shouldInject(src) {
          return src.indexOf(_consts.KATEX_INLINE_MARKER) >= 0 || src.indexOf(_consts.KATEX_BLOCK_MARKER) >= 0;
        }
      };

      inject.headEnd.link({ rel: 'stylesheet', href: css }, opts);
    }
  }]);

  return Inject;
}();

exports.default = Inject;
module.exports = exports['default'];