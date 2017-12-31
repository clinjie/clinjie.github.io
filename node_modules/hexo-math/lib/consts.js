"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var INLINE_MATH_REGEX = exports.INLINE_MATH_REGEX = /\$[\s\S]+?\$/;
var BLOCK_MATH_REGEX = exports.BLOCK_MATH_REGEX = /^\s*\$\$[\s\S]*\$\$\s*$/m;
var INLINE_MATH_RENDER_REGEX = exports.INLINE_MATH_RENDER_REGEX = /\$([^\n]+?)\$/g;
var BLOCK_MATH_RENDER_REGEX = exports.BLOCK_MATH_RENDER_REGEX = /\$\$([\s\S]+?)\$\$/g;

var MATH_MARKER = exports.MATH_MARKER = "<!-- Has MathJax -->";
var KATEX_INLINE_MARKER = exports.KATEX_INLINE_MARKER = "<span class=\"katex\">";
var KATEX_BLOCK_MARKER = exports.KATEX_BLOCK_MARKER = "<span class=\"katex-display\">";