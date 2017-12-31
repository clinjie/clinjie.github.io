'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_OPTS = undefined;
exports.getOptions = getOptions;

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_OPTS = exports.DEFAULT_OPTS = {
  engine: 'mathjax',
  mathjax: {
    src: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js",
    config: {
      tex2jax: {
        inlineMath: [['$', '$'], ["\\(", "\\)"]],
        skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
        processEscapes: true
      },
      TeX: {
        equationNumbers: {
          autoNumber: "AMS"
        }
      }
    }
  },
  katex: {
    css: "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css",
    js: "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.js",
    config: {
      throwOnError: false,
      errorColor: "#cc0000"
    }
  }
};

var ENGINES = ['mathjax', 'katex'];

function getOptions(_ref, opts) {
  var config = _ref.config,
      log = _ref.log;

  if (_underscore2.default.isObject(config.mathjax)) {
    log.warn("[hexo-math] Deprecation Notice: configuration format changed since 3.0.0. Please move `mathjax` to `math.mathjax` in your site's `_config.yml` file");
    if (!_underscore2.default.isObject(config.math)) config.math = { mathjax: config.mathjax };
  }

  opts = _underscore2.default.defaults({}, opts, config.math, DEFAULT_OPTS);

  if (ENGINES.indexOf(opts.engine) < 0) throw new TypeError('hexo-math does not support engine named \'opts.engine\'');

  log.info('[hexo-math] Using engine \'' + opts.engine + '\'');

  return opts;
}