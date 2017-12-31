"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _math = require("./tag/math");

var _math2 = _interopRequireDefault(_math);

var _inject = require("./filter/inject");

var _inject2 = _interopRequireDefault(_inject);

var _post = require("./filter/post");

var _post2 = _interopRequireDefault(_post);

var _option = require("./option");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MathJax = function () {
  function MathJax(hexo, opts) {
    _classCallCheck(this, MathJax);

    this.hexo = hexo;
    this.opts = (0, _option.getOptions)(hexo, opts);
    this.tag = new _math2.default(hexo, this.opts);
    this.injector = new _inject2.default(hexo, this.opts);
    this.post = new _post2.default(hexo, this.opts);
  }

  _createClass(MathJax, [{
    key: "register",
    value: function register() {
      var tag = this.tag,
          injector = this.injector,
          post = this.post;

      tag.register();
      injector.register();
      // post.register();
    }
  }]);

  return MathJax;
}();

exports.default = MathJax;
module.exports = exports['default'];