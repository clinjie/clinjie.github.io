title: tornado安全技巧
date: 2016-11-24 12:28:30
toc: true
tags: python
categories: python
---

# 安全cookies #

Tornado的安全cookie使用加密签名验证cookies的值是否被除了服务器之外的程序修改过，未被我们授权的（不知道安全密钥）程序无法在应用不知情下修改cookies

## 使用安全cookie ##

Tornado的`set_secure_cookie()`和`get_secure_cookie()`方法设置、请求浏览器的cookies，防止浏览器的恶意修改，在此之前，我们需要在构造函数中指定cookie_secure参数。

成功设定之后，应用在程序内部获取的cookie还是本身的值，在浏览器或抓包工具查看，发现cookie已经被加密，如果不知道密钥，无法获知cookie内容

<!--more-->
如果通过恶意代码修改过cookie值，应用使用get_secure_cookie方法会获得None，此时我们可以在应用中判断，增加一些防范机制

```python
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.options

from tornado.options import define, options
define("port", default=8001, help="run on the given port", type=int)

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        times = self.get_secure_cookie("count")
        count = int(times) + 1 if times else 1

        countString = "1 time" if count == 1 else "%d times" % count

        self.set_secure_cookie("count", str(count))

        self.write(
            '<html><head><title>Cookie Counter</title></head>'
            '<body><h1>You’ve viewed this page %s times.</h1>' % countString + 
            '</body></html>'
        )

if __name__ == "__main__":
    tornado.options.parse_command_line()

    settings = {
        "cookie_secret": "bZJc2sWbQLKos6GkHn/VB9oXwQt8S0R0kRvJ5/xJ89E="
    }

    application = tortnado.web.Application([
        (r'/', MainHandler)
    ], **settings)

    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
```

Tornado将cookie值编码为Base-64字符串

## http-only&&ssl ##

Tornado的cookie功能依附于Python内建的Cokie模块，现在有两种常规的方法增强cookie的安全性，减少被截获的可能。

- 为cookie设置`secure`属性只指示浏览器只通过SSL传递cookie

`self.set_cookie('foo','bar',secure=True)`

- 开启Http-only功能

`self.set_cookie('foo','bar',httponly=True)`

开启httponly之后，浏览器js不能访问cookie

以上两种模式可以同时工作


# CSRF #

>CSRF（Cross-site request forgery跨站请求伪造，也被称为“One Click Attack”或者Session Riding，通常缩写为CSRF或者XSRF，是一种对网站的恶意利用。CSRF通过伪装来自受信任用户的请求来利用受信任的网站。

## 举例 ##

1. 攻击通过在授权用户访问的页面中包含链接或者脚本的方式工作。例如：一个网站用户Bob可能正在浏览聊天论坛，而同时另一个用户Alice也在此论坛中，并且后者刚刚发布了一个具有Bob银行链接的图片消息。设想一下，Alice编写了一个在Bob的银行站点上进行取款的form提交的链接，并将此链接作为图片src。如果Bob的银行在cookie中保存他的授权信息，并且此cookie没有过期，那么当Bob的浏览器尝试装载图片时将提交这个取款form和他的cookie，这样在没经Bob同意的情况下便授权了这次事务


2. 假设Alice是Burt's Books的一个普通顾客。当她在这个在线商店登录帐号后，网站使用一个浏览器cookie标识她。现在假设一个不择手段的作者，Melvin，想增加他图书的销量。在一个Alice经常访问的Web论坛中，他发表了一个带有HTML图像标签的条目，其源码初始化为在线商店购物的URL。比如：

`<img src="http://store.burts-books.com/purchase?title=Melvins+Web+Sploitz" />`

Alice的浏览器尝试获取这个图像资源，并且在请求中包含一个合法的cookies，并不知道取代小猫照片的是在线商店的购物URL,点击这个url，就会提交一个购买Melvin书籍的请求

## 防范措施 ##

有很多预防措施可以防止这种类型的攻击。首先你在开发应用时需要深谋远虑。任何会产生副作用的HTTP请求，比如点击购买按钮、编辑账户设置、改变密码或删除文档，都应该使用HTTP POST方法。

但是，这并不足够：一个恶意站点可能会通过其他手段，如HTML表单或XMLHTTPRequest API来向你的应用发送POST请求。保护POST请求需要额外的策略。


为了防范伪造POST请求，我们会要求每个请求包括一个参数值作为令牌来匹配存储在cookie中的对应值。我们的应用将通过一个cookie头和一个隐藏的HTML表单元素向页面提供令牌。当一个合法页面的表单被提交时，它将包括表单值和已存储的cookie。如果两者匹配，我们的应用认定请求有效。

由于第三方站点没有访问cookie数据的权限，他们将不能在请求中包含令牌cookie。这有效地防止了不可信网站发送未授权的请求。正如我们看到的，Tornado同样会让这个实现变得简单。


----------
在构造函数中包含xsrf_cookies参数开启XSRF保护：

```python
settings = {
    "cookie_secret": "bZJc2sWbQLKos6GkHn/VB9oXwQt8S0R0kRvJ5/xJ89E=",
    "xsrf_cookies": True
}
application = tornado.web.Application([
    (r'/', MainHandler),
    (r'/purchase', PurchaseHandler),
], **settings)
```

这个应用标识被设置时，Tornado将拒绝请求参数中不包含正确的_xsrf值的POST、PUT和DELETE请求。为了在提交时候自动加上_xsrf值信息，我们在模板中使用如下：

```html
<form action="/purchase" method="POST">
    {% raw xsrf_form_html() %}
    <input type="text" name="title" />
    <input type="text" name="quantity" />
    <input type="submit" value="Check Out" />
</form>
```

网页在浏览器中的源码形式一般如下：

```html
<input type="hidden" name="_xsrf" value="856ada5b160a9e27902f46631ce8e5d3"/>
```

Ajax请求也会需要_xsrf参数，通常是通过脚本在客户端查询浏览器获取cookie值。

```js
function getCookie(name) {
    var c = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return c ? c[1] : undefined;
}

jQuery.postJSON = function(url, data, callback) {
    data._xsrf = getCookie("_xsrf");
    jQuery.ajax({
        url: url,
        data: jQuery.param(data),
        dataType: "json",
        type: "POST",
        success: callback
    });
}
```