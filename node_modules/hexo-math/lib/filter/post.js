'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _consts = require('../consts');

var _htmlEntities = require('html-entities');

var _katex = require('katex');

var _katex2 = _interopRequireDefault(_katex);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var entities = new _htmlEntities.AllHtmlEntities();

var Post = function () {
  function Post(hexo, opts) {
    _classCallCheck(this, Post);

    this.hexo = hexo;
    this.opts = opts;
  }

  _createClass(Post, [{
    key: 'register',
    value: function register() {
      if (this.opts.engine !== 'katex') return;
      var filter = this.hexo.extend.filter;

      filter.register('before_post_render', this._transform.bind(this));
    }
  }, {
    key: '_transform',
    value: function _transform(data) {
      var _this = this;

      data.content = data.content.replace(_consts.BLOCK_MATH_RENDER_REGEX, function (m, math) {
        return _this._render(m, math, true);
      });
      data.content = data.content.replace(_consts.INLINE_MATH_RENDER_REGEX, function (m, math) {
        return _this._render(m, math, false);
      });
      return data;
    }
  }, {
    key: '_render',
    value: function _render(match, math, isBlock) {
      var opts = _underscore2.default.extend({}, this.opts.katex.config, { displayMode: isBlock });

      try {
        return _katex2.default.renderToString(entities.decode(math), opts);
      } catch (e) {
        this.hexo.log.error(e);
      }

      return match;
    }
  }]);

  return Post;
}();

exports.default = Post;
module.exports = exports['default'];