"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _htmlEntities = require("html-entities");

var _consts = require("../consts");

var _katex = require("katex");

var _katex2 = _interopRequireDefault(_katex);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var entities = new _htmlEntities.AllHtmlEntities();

var MathTag = function () {
  function MathTag(hexo, opts) {
    _classCallCheck(this, MathTag);

    this.hexo = hexo;
    this.opts = opts;
  }

  _createClass(MathTag, [{
    key: "register",
    value: function register() {
      var tag = this.hexo.extend.tag;

      tag.register("math", this._transform.bind(this), { ends: true });
    }
  }, {
    key: "_transform",
    value: function _transform(args, content) {
      var multiLine = /\n/.test(content);

      var transformers = {
        mathjax: this._mathJax.bind(this),
        katex: this._kaTeX.bind(this)
      };
      return transformers[this.opts.engine](content, multiLine);
    }
  }, {
    key: "_mathJax",
    value: function _mathJax(content, multiLine) {
      content = entities.encode(content.trim());
      return multiLine ? "<span>$$" + content + "$$</span>" + _consts.MATH_MARKER : "<span>$" + content + "$</span>" + _consts.MATH_MARKER;
    }
  }, {
    key: "_kaTeX",
    value: function _kaTeX(content, multiLine) {
      content = entities.decode(content.trim());
      var opts = _underscore2.default.extend({}, this.opts.katex.config, { displayMode: multiLine });

      try {
        return _katex2.default.renderToString(content, opts);
      } catch (e) {
        this.hexo.log.error(e);
      }

      return content;
    }
  }]);

  return MathTag;
}();

exports.default = MathTag;
module.exports = exports['default'];