title: JQuery选择器、过滤器介绍
date: 2015-07-05 23:25:16
toc: true
tags: 
- Front End
- JQuery
categories: 前端
---

![](http://7xowaa.com1.z0.glb.clouddn.com/jquery.jpg)


一、JQuery对象与DOM对象
--- 
1.JQuery对象  
JQuery对象就是使用 $(domobj)，将dom对象包装起来.  
  
一般在jqury前面加上$与dom对象区分，它已经是一种公认的命名约定.  

JQuery对象不能调用dom对象的属性和方法，同样DOM对象也不能调用JQuery对象的属性和方法。 

2.JQuery对象转成DOM对象 
如果想使用JQuery对象调用DOM对象的方法，怎么办？  
应该将JQuery对象转换成DOM对象，JQuery对象是一个数组对象，这个很特别。所以只需调用JQueryObj[x]或JQueryObj.get(X);即可转换为DOM对象。 

3.DOM对象转换成JQuery对象 
使用“$(“DOMObj”)”将DOM对象包装起来就可以了。 

<!--more-->

二、JQuery选择器 
---
选择器是JQuery的根基，在JQuery 中，对事件处理，遍历DOM和Ajax操作都依赖于选择器。这也是今天我们学习的重点内容。 

1.基本选择器 
基本选择器是JQuery中最常用的选择器，也是最简单的选择器，它通过元素id、class 和标签名来查找DOM元素。这个非常重要，下面的内容都是以此为基础，逐级提高的。
 
```  
1).“$(“#id”)”，//获取id指定的元素，id是全局唯一的，所以它只有一个成员。 
2).“$(“.class”)”，//获取class指定的元素，不同的元素可以具有相同的class属性，所以它可能具有多个成员。 
3).“$(“element”)”，//获取element（元素名，比如div、table等）指定的元素，它可能具有多个成员。 
4).“$(“*”)”，//获取所有元素，相当于document。 
5).“$(“selector1,selector2,…,selectorN”)”，//将每个选择器匹配到的元素合并后一起返回。返回selector1匹配的集合+selector2匹配的集合+…+selectorN匹配的集合。
 
```

2.层次选择器 
什么是层次？层次就是父子关系、兄弟关系的节点。所以，层次选择器就是用来获取指定元素的父子节点、兄弟节点。 

```
1).“$(“ancestor descendant”)”，获取ancestor元素下边的所有元素。 
2).“$(“parent > child”)”，获取parent元素下边的所有子元素（只包含第一层子元素）。 
3).“$(“pre + next”)”，获取紧随pre元素的后一个兄弟元素。 
4).“$(“pre ~ siblings”)”，获取pre元素后边的所有兄弟元素。 
```

3.过滤选择器 
过滤？肯定是要添加过滤条件的。通过“:”添加过滤条件，比如“$(“div:first”)”返回div元素集合的第一个div元素，first是过滤条件。 
按照不同的过滤规则，过滤选择器可以分为基本过滤，内容过滤，可见性过滤，属性过滤，子元素过滤和表单对象属性过滤选择器。 

1). 基本过滤选择器   

```
a) “:first”，选取第一个元素，别忘记它也是被放在一个集合里哦！因为JQuery它是DOM对象的一个集合。如，“$("tr:first")”返回所有tr元素的第一个tr元素，它仍然被保存在集合中。 
b) “:last”，选取最后一个元素。如，“$("tr:last")”返回所有tr元素的最后一个tr元素，它仍然被保存在集合中。 
c) “:not(selector)”，去除所有与给定选择器匹配的元素。如，“$("input:not(:checked)")”返回所有input元素，但去除被选中的元素（单选框、多选框）。 
d) “:even”，选取所有元素中偶数的元素。因为JQuery对象是一个集合，这里的偶数指的就是集合的索引，索引从0开始。 
e) “:odd”，选取所有元素中奇数的元素，索引从0开始。 
f) “:eq(index)”，选取指定索引的元素，索引从0开始。 
g) “:gt(index)”，选取索引大于指定index的元素，索引从0开始。 
h) “:lt(index)”，选取索引小于指定index的元素，索引从0开始。 
i) “:header”，选取所有的标题元素，如hq、h2等。 
j) “:animated”，选取当前正在执行的所有动画元素。 
```

2). 内容过滤选择器 
它是对元素和文本内容的操作。
 
```
a) “:contains(text)”，选取包含text文本内容的元素。 
b) “:empty”，选取不包含子元素或者文本节点的空元素。 
c) “:has(selector)”，选取含有选择器所匹配的元素的元素。 
d) “:parent”，选取含有子元素或文本节点的元素。（它是一个父节点） 
```

3). 可见性过滤选择器 
根据元素的可见与不可见状态来选取元素。

 
```
“:hidden”，选取所有不可见元素。 
“:visible”，选择所有可见元素。 
可见选择器：hidden 不仅包含样式属性 display 为 none 的元素，也包含文本隐藏域 
	(<input type=“hidden”>)
和 visible:hidden 之类的元素。
```


4).属性过滤选择器 
通过元素的属性来选取相应的元素。 


```
a) “[attribute]”，选取拥有此属性的元素。 
b) “[attribute=value]”，选取指定属性值为value的所有元素。 
c) “[attribute !=value]”，选取属性值不为value的所有元素。 
d) “[attribute ^= value]”，选取属性值以value开始的所有元素。 
e) “[attribute $= value]”，选取属性值以value结束的所有元素。 
f) “[attribute *= value]”，选取属性值包含value的所有元素。 
g) “[selector1] [selector2]…[selectorN]”，复合性选择器，首先经[selector1]选择返回集合A，集合A再经过[selector2]选择返回集合B，集合B再经过[selectorN]选择返回结果集合。
```
 

5). 子元素过滤选择器 
一看名字便是，它是对某一元素的子元素进行选取的。


``` 
a) “:nth-child(index/even/odd)”，选取索引为index的元素、索引为偶数的元素、索引为奇数的元素。 
l nth-child(even/odd)：能选取每个父元素下的索引值为偶(奇)数的元素。 
l nth-child(2)：能选取每个父元素下的索引值为 2 的元素。 
l nth-child(3n)：能选取每个父元素下的索引值是 3 的倍数的元素。 
l nth-child(3n + 1)：能选取每个父元素下的索引值是 3n + 1的元素。 
b) “:first-child”，选取第一个子元素。 
c) “:last-child”，选取最后一个子元素。 
d) “:only-child”，选取唯一子元素，它的父元素只有它这一个子元素。 
```


6). 表单过滤选择器 
选取表单元素的过滤选择器。

``` 
a) “:input”，选取所有<input>、<textarea>、<select >和<button>元素。 
b) “:text”，选取所有的文本框元素。 
c) “:password”，选取所有的密码框元素。 
d) “:radio”，选取所有的单选框元素。 
e) “:checkbox”，选取所有的多选框元素。 
f) “:submit”，选取所有的提交按钮元素。 
g) “:image”，选取所有的图像按钮元素。 
h) “:reset”，选取所有重置按钮元素。 
i) “:button”，选取所有按钮元素。 
j) “:file”，选取所有文件上传域元素。 
k) “:hidden”，选取所有不可见元素。 
```

7).表单对象属性过滤选择器 
选取表单元素属性的过滤选择器。
 
```
“:enabled”，选取所有可用元素。 
“:disabled”，选取所有不可用元素。 
“:checked”，选取所有被选中的元素，如单选框、复选框。 
“:selected”，选取所有被选中项元素，如下拉列表框、列表框。 
```

四、JQuery中的DOM操作 
一种与浏览器，平台，语言无关的接口。使用该接口可以轻松地访问页面中所有的标准组件。 
DOM Core：DOM Core 并不专属于 JavaScript，任何一种支持 DOM 的程序设计语言都可以使用它。它的用途并非仅限于处理网页，也可以用来处理任何一种是用标记语言编写出来的文档，例如：XML。 
HTML DOM：使用 JavaScript 和 DOM 为 HTML 文件编写脚本时，有许多专属于HTML-DOM的属性。 
CSS-DOM：针对于CSS操作，在JavaScript中，CSS-DOM 主要用于获取和设置 style 对象的各种属性。 

1.查找节点 
请见上面的“基本选择器”。 

2.创建节点 
使用JQuery的工厂函数，创建一个新节点：
```
var $newNode = $(“<p>你好</p>”);
```
然后将新节点插入到指定元素节点处。 

3.插入节点 
将新创建的节点，或获取的节点插入指定的位置。

``` 
“$node.append($newNode)”，向每个匹配的元素内部的结尾处追加结尾处。如，“$("p").append("<b>Hello</b>");”将"<b>Hello</b>"添加到"p"内部的结尾处。 
“$newNode.appendTo($node)”，将新元素追加到每个匹配元素内部的结尾处。 
“$node.prepend($newNode)”，向每个匹配的元素内部的结尾处追加开始处。如，“$("p").prepend("<b>Hello</b>");”将"<b>Hello</b>"添加到"p"内部的起始处。 
“$newNode.prependTo($node)”， 将新元素追加到每个匹配元素内部的开始处。 
“$node.after($newNode)”，向每个匹配的元素的之后插入内容，是并列兄弟。如，“$("p").after("<b>Hello</b>");”将"<b>Hello</b>"插入到"p"的后边。它们是兄弟关系。 
“$newNode.insertAfter($node)”，将新元素插入到每个匹配元素之后。 
“$newNode.before($node)”，向每个匹配的元素的之前插入内容。如，“$("p").before("<b>Hello</b>");”将"<b>Hello</b>"插入到"p"的前面，它们是兄弟关系。 
“$node.insertBefore($newNode)”，将新元素插入到每个匹配元素之前。 
```

注意：如果插入的节点是不是新创建的，插入将变成移动操作。所以，在插入这样的节点之前应该使用clone的节点。 

4.删除节点 
从DOM中删除所有匹配的元素。如，
```
$("p").remove(".hello");
```
删除所为class属性值为hello的p元素，还有它下面的所有元素。 

从DOM中清除所有匹配的元素。如，
```
$("p").empty();
```
清除所有p元素，还有它下面的所有元素。 

5.复制节点 
克隆匹配的DOM元素。如，
```
$("p").clone();
```
返回克隆后的副本，但不具有任何行为。如果要将DOM的事件一起克隆，应该使用
```
$("p").clone(true);
```

6.替换节点 
将所有匹配的元素都替换为指定的 HTML 或 DOM 元素。如，
```
$("p").replaceWith("<b>Paragraph. </b>");
```
将所有p元素，替换为
```
"<b>Paragraph. </b>" 
```

与replaceWith相返：
```
$("<b>Paragraph. </b>").replaceAll("p");
```

7.包裹节点 
wrap()：将指定节点用其他标记包裹起来。该方法对于需要在文档中插入额外的结构化标记非常有用， 而且不会破坏原始文档的语义。如，
```
$("p").wrap("<div class='wrap'></div>");
```
每个p元素被包裹到<div>中。 
wrapAll()：将所有匹配的元素用一个元素来包裹。而wrap()方法是将所有的元素进行单独包裹。如，
```
$("p").wrapAll("<div></div>");
```

将所有p元素包裹到<div>中。 
wrapInner()：将每一个匹配的元素的子内容(包括文本节点)用其他结构化标记包裹起来。如，
```
$("p").wrapInner("<b></b>");
 <b>被每一个p元素包裹。 
```
8.属性设置 
attr()：获取属性和设置属性。 
当为该方法传递一个参数时，即为某元素的获取指定属性。如，
```
$("img").attr("src");
```
获取img元素的src属性值。 
当为该方法传递两个参数时，即为某元素设置指定属性的值。如，
```
$("img").attr("src","test.jpg");
```
设置img元素的src属性值为test.jsp。 
jQuery 中有很多方法都是一个函数实现获取和设置。如：
attr()，html()，text()，val()，height()，width()，css()等。 
removeAttr()：删除指定元素的指定属性。 

9.样式操作 
可以通过“attr()”设置或获取css样式。 
追加样式：addClass() 。如，
```
$("p").addClass("selected");
```
向所有P元素中追加“selected”样式。 
移除样式：removeClass() --- 从匹配的元素中删除全部或指定的class。如，
```
$("p").removeClass("selected");
```
删除所有P元素中的“selected”。 
切换样式：toggleClass() --- 控制样式上的重复切换。如果类名存在则删除它，如果类名不存在则添加它。如，
```
$("p").toggleClass("selected")
```
所有的P元素中，如果存在“selected”样式就删除“selected”样式，否则就添加“selected”样式。 
判断是否含有某个样式：hasClass() --- 判断元素中是否含有某个 class，有返回 true； 否则返回 false。如，
```
$(this).hasClass("protected")
```
判断当前节点是否有“protected”样式。 

10.设置或获取HTML、文本和值 
读取和设置某个元素中的 HTML 内容： html()，该方法可以用于 XHTML，但不能用于 XML 文档。 
读取和设置某个元素中的文本内容：text()，该方法既可以用于 XHTML 也可以用于 XML 文档。 
读取和设置某个元素中的值：val()，该方法类似 JavaScript 中的 value 属性。对于文本框，下拉列表框，单选框该方法可返回元素的值(多选框只能返回第一个值)。如果为多选下拉列表框，则返回一个包含所有选择值的数组。 

11.常用遍历节点的方法 
取得匹配元素的所有子元素组成的集合：children()。该方法只考虑第一层子元素而不考虑任何后代元素。 
取得匹配元素后面紧邻的兄弟元素的集合(但集合中只有一个元素)：next()。 
取得匹配元素前面紧邻的兄弟元素的集合(但集合中只有一个元素)：prev()。 
取得匹配元素前后所有的兄弟元素: siblings()。 

12.CSS-DOM操作 
获取和设置元素的样式属性：css()。 
获取和设置元素透明度：opacity()属性。 
获取和设置元素高度，宽度：height()，width()。在设置值时，若只传递数字，则默认单位是px。如需要使用其他单位则需传递一个字符串，例如 “$(“p:first”).height(“2em”)”； 
获取元素在当前视窗中的相对位移：offset()。它返回的对象包含了两个属性：top，left。该方法只对可见元素有效。 


五、JQuery中的事件 

1.加载DOM 
在页面加载完毕后，浏览器会通过 JavaScript 为 DOM 元素添加事件。在常规的 JavaScript 代码中，通常使用 window.onload 方法，在JQuery 中使用$(document).ready() 方法。JQuery中的简化写法“$()”。在window.onload中注册事件时，只能在一个window.onload体中注册。但使用JQuery，可以在多个$(document).ready()或$()中注册。 

2.事件绑定 
对匹配的元素对指定的事件绑定。如，昨天我们在window.onload中绑定事件的方法：
```
$("p").onclick(function(){ alert( $(this).text() ); });
```
在JQuery的$(document).ready()中可以这样绑定：
```
$("p").click(function(){ alert( $(this).text() ); });
```
使用bind()，可以这样绑定：
```
$("p").bind("click", function(){ alert( $(this).text() ); }); 
```

3.合成事件 
hover()：模拟光标悬停时间。当光标移动到元素上时，会触发指定的第一个函数，当光标移出这个元素时，会触发指定的第二个函数。如，悬停效果：
```
$("td").hover( function () {$(this).addClass("hover");},           
	function () {$(this).removeClass("hover");}); 
```
toggle()：用于模拟鼠标连续单击事件。第一次单击元素，触发指定的第一个函数，当再一次单击同一个元素时，则触发指定的第二个函数，如果有更多个函数，则依次触发，直到最后一个。如，设置元素的选择与非选中效果： 
```
("td").toggle( function () {$(this).addClass("selected");},        
	function () {$(this).removeClass("selected");}); 
```
使用toggle()而不传递参数，效果为切换元素的可见状态。 

4.事件的冒泡 
事件会按照 DOM 层次结构像水泡一样不断向上只止顶端。 
解决：在事件处理函数中返回 false，会对事件停止冒泡。还可以停止元素的默认行为。 
目前的所有UI交互或其事件，都支持这个特性。在自己的事件处理函数返回false将中止事件的继续向下传递。返回true事件继续向下传递。 

5.事件对象的属性 
事件对象：当触发事件时，事件对象就被创建了。在程序中使用事件只需要为处理函数添加一个参数。在事件处理函数中使用些参数。如，获取事件发生时，相对于页面的位置：event.pageX, event.pageY，event是事件处理函数的参数。 

6.移除事件 
移除某按钮上的所有click 事件：$(“btn”).unbind(“click”) 
移除某按钮上的所有事件：$(“btn”).unbind(); 
one()：该方法可以为元素绑定处理函数。当处理函数触发一次后，事件立即被删除。即在每个对象上，事件处理函数只会被执行一次。 


六、JQuery中的DOM动画 
通过设置DOM对象的显示与隐藏方式，可以产生动画效果。 

1.无动画效果的隐藏与显示 
hide()：在HTML文档中，为一个元素调用hide()方法会将该元素的display样式改为none。代码功能同css(“display”, “none”);相同。 
show()：将元素的display样式改为先前的显示状态。 
toggle()：切换元素的可见状态：如果元素时可见的，则切换为隐藏；如果元素时隐藏的，则切换为可见的。 

2.通过设置透明度效果的隐藏与显示，达到淡入淡出的动画效果 
fadeIn()，fadeOut()：只改变元素的透明度。fadeOut() 会在指定的一段时间内降低元素的不透明度，直到元素完全消失。fadeIn() 则相反。如，用600毫秒缓慢的将段落淡入：$("p").fadeIn("slow");。 
fadeTo()：把不透明度以渐近的方式调整到指定的值(0 – 1 之间)。并在动画完成后可选地触发一个回调函数。如，用200毫秒快速将段落的透明度调整到0.25，动画结束后，显示一个“Animation Done”信息框：
```
$("p").fadeTo("fast", 0.25, function(){ alert("Animation Done."); });
```

3.通过设置高度效果的隐藏与显示，达到滑下与收起的动画效果 
slideDown()，slideUp()：只会改变元素的高度。如果一个元素的display属性为none，当调用slideDown() 方法时，这个元素将由上至下延伸显示。slideUp() 方法正好相反，元素由下至上缩短隐藏。如，用600毫秒缓慢的将段落滑下：```
$("p").slideDown("slow");。 
```
slideToggle()：通过高度变化来切换匹配元素的可见性。如，200毫秒快速将段落滑上或滑下，动画结束后，会显示一个“Animation Done”信息框：
```
$("p").slideToggle("fast",function(){ alert("Animation Done."); }); ```

使用JavaScript、JQuery可以处理当前页面的动态更新，再结合CSS样式可以做出十分漂亮的UI，甚至比桌面软件UI漂亮的多。JavaScript的编写与调试非常麻烦，所以也有一些公司出品了专门针对JavaScript应用的简化开发，比如Google出品的GWT，可以像使用Java编写swing那样编写JavaScript。它为用户提供像swing那样的UI接口与事件等操作并且支持JAVA的核心库。使用GWT自己的编译器，可以将JAVA代码编译为JavaScript代码、CSS样式文件和HTML。