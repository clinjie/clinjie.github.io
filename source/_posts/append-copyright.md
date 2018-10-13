title: Hexo-文章版权追加
date: 2016-03-30 22:23:35
tags: 
- Hexo
- front end
categories: 前端
---


目前，网络中出现了一些不和谐因素，某些网站多次剽窃Hexo博友的原创文章。在对这些侵犯博友权益的网站提出谴责的同时，聪明的各位Geek们应该如何增强版权意识呢.

最简单的办法就是在自己的部落格文章里添加水印，即使这些网站通过爬虫私自收录我们的文章，读者也能在文章中轻易的发现原作者。<!--more-->

由于这种办法容易影响读者的阅读体验，我采用的是在每篇文章下面增加版权声明，将本篇文章的信息、初次刊登网站、作者信息追加进文章里面。

![](/img/article/append-copyright.png)

# article结构 #

cd到`your_theme\layout\_partial\`下，访问`article.ejs`，在合适的位置添加

```
<% if(!index) { %>
			<%- partial('declare') %>
		<% } %>
```
将会在非目录页面下执行名为`declare`的脚本。

# 具体显示内容 #


还是在`your_theme\layout\_partial\`下面，创建一个名为`declare.ejs`的文件，在里面填写

```html
<! -- 添加版权信息 -->
<div class="article-footer-copyright">
<center>本文由<b><a href="<%= config.root %>index.html" target="_blank" title="<%= config.author %>"><%= config.author %></a></b>创作和发表,采用<b>BY</b>-<b>NC</b>-<b>SA</b>国际许可协议进行许可</center>

<center>转载请注明作者及出处,本文作者为<b><a href="<%= config.root %>index.html" target="_blank" title="<%= config.author %>"><%= config.author %></a></b>,本文标题为<b><a href="<%- config.root %><%- post.path %>" target="_blank" title="<%= post.title %>"><%= post.title %></a></b></center>

<center>本文链接为<b><a href="<%- config.root %><%- post.path %>" target="_blank" title="<%= post.title %>"><%- config.url %>/<%- post.path %></a></b>.</center>
</div>
<! -- 添加版权信息 -->
```
当然，你也可以自己DIY，修改显示的文字。

# 修改CSS样式 #

编写类对应的CSS代码


cd到`your_theme\source\css\_partial`下面，创建`copyright.styl`

```CSS
.article-footer-copyright {
  border-top: 1px solid #d3d3d3;
  margin: 10px auto;
  padding-left: 2em;
  width: 80%;
}
.article-footer-copyright span,
.copyright abbr {
  color: #3d3d3d;
}
div.copyright {
  font-weight: bold;
  color: #fcb297;
  padding: 0.3em 0.5em;
  margin: 0 0 1em 0;
  border-bottom: none;
  background-color: #74a474;
  -moz-border-radius: 1em;
  -webkit-border-radius: 1em;
  -webkit-border-radius: 1em;
  border-radius: 1em;
  -moz-box-shadow: inset 0px 1px 0px 0px #eee;
  -webkit-box-shadow: inset 0px 1px 0px 0px #eee;
  -webkit-box-shadow: inset 0px 1px 0px 0px #eee;
  box-shadow: inset 0px 1px 0px 0px #eee;
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #aad2f0), color-stop(1, #8bc1ed));
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #aad2f0), color-stop(1, #8bc1ed));
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #aad2f0), color-stop(1, #8bc1ed));
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0.05, #aad2f0), color-stop(1, #8bc1ed));
  background: -moz--webkit-linear-gradient(center top, #aad2f0 5%, #8bc1ed 100%);
  background: -moz--moz-linear-gradient(center top, #aad2f0 5%, #8bc1ed 100%);
  background: -moz--ms-linear-gradient(center top, #aad2f0 5%, #8bc1ed 100%);
  background: -moz-linear-gradient(center top, #aad2f0 5%, #8bc1ed 100%);
/* filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#aad2f0', endColorstr='#8bc1ed'); */
  background-color: #74a474;
  border: 1px solid #dcdcdc;
  text-shadow: 1px 1px 0px #eee;
}
div.article-footer-copyright {
  margin-top: 2em;
  padding: 0.8em;
  border: 1px solid #d3d3d3;
  background-color: #ffffcc;
}
.article-footer-copyright p {
  line-height: 140%;
  margin: 10px;
  font-size: 100%;
}
```

可以根据喜好修改格式。最后别忘了`@import '_partial/copyright`

