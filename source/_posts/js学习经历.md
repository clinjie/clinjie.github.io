title: js
date: 2015-12-13 22:35:02
tags: 
- Front End
- JQuery
categories: 前端
---

使用对象的属性                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
---
<1>通过 对象名[属性名]，这里的属性可以类比为Java中的对象的成员变量    
<2>通过 对象名.属性名使用  
<3>通过 for(var varble in object)循环获取 object[varble]  
<4>通过 with(对象名){直接调用属性} 

<!--more-->
```
<script type="text/javascript">

	//定义一个对象  有两个属性'url' 和 'URL'
	var objj={'url':'chuangwailinjie.github.io','URL':'CHUANGWAILINJIE.GITHUB.IO'};
	//<1>
	str=objj['url']
	alert(str);

	//<2>
	alert(objj.url);

	//<3>
	var str='';
	for(var em in objj){
		str+=objj[em];
	}
	alert(str);
	

	//<4>
	with(objj){
		alert(url);
	}

</script>

```

使用对象的方法
---
<1>通过 对象名.方法
<2>通过 with(对象名){直接调用对象方法}

js中事件处理函数绑定
---
```
	<input type="button" id="bclick" value="点击">
	<script type="text/javascript">
		function func(){
			var res=prompt('请输入红色','');
			if(res=="红色")
				alert("perfect");
	}

	bclick.onclick=func;
	</script>
```
这里要注意的是  如果是无参的方法  一定不能写为bclick.onclick=func() 这样写就是直接调用 而非是将事件处理函数绑定.


内置对象添加属性或者方法
---
在Array、String、Date、Boolean、Number这些内置对象中可以通过prototype属性为这些内置对象添加属性或者方法.  
格式为 
	object.prototype.属性名=...
	object.prototype.方法=...

```
	function onclickkk(){
		alert('just test');
	}

	var ob=new model(objj);

	model.prototype.onclickk=onclickkk;


```

如上，modle为类模板名称，为model添加了一个onclickk方法，以后就可以直接使用。
1>实例化一个对象ob
2>直接使用 ob.onclickk

同样要注意的是，如果绑定的function为无参的话，一定不能这样写
	model.prototype.onclickk=onclickkk();
这样写的后果就是直接执行，不同调用就会执行.  


自定义对象-属性或者方法
---
当然这里只是一个简单的示例，如果不是使用内置对象，可以直接这样声明方法:

```

	function onclickkk(ar){
		alert('just test');
	}

	//定义一个对象模板
	function model(data){
		this.url=data.url;
		this.URL=data.URL;
		this.onclickk=onclickkk;
	}

	var ob=new model(objj);


	ob.onclickk('');

```

一些事件处理
---
文本方面的：oncopy()、onbeforecopy()  
当指定的文本被复制时触发 onbeforecopy()是在讲文本内容放到剪切板是触发，oncopy()是在复制时触发，所以onbeforecopy()先触发.  
当想要进制某些文本被复制，可以这样做
```

	function onccopy(){
		alert("can't copy");
		return false;
	}

	function onbbeforecopy(){
		alert("can't beforecopy");
		return false;
	}
	<p oncopy="onccopy()" onbeforecopy="onbbeforecopy()">...</p>  
	//当然也可以直接在元素p中  
	<p onbeforecopy="return false"></p>  

```  

如果绑定的函数不是内置函数，就必须在最后return，true表示可以复制，false表示禁止复制.    



类似的还有onpaste(),onbeforepaste().  
onbeforepaste()是从系统剪切板复制到文本框识别执行的方法，可以在此设置方法，禁止粘贴  


	onbeforepaste="return cleanup()"  


将使用者的剪切板直接清空，使无法粘贴。可以应用到passwd域，或者重复验证密码时使用。需要注意的是，与onbeforecopy不同，在onbeforepaste()中return true or false没有用。
onpaste()是在粘贴时触发，可以直接设置return false禁止粘贴.


在<script></script>代码片段中，当绑定函数时，不管指定的函数是否无参数，都不能指定函数的语句中加'()',比如这样
	document.forms[0].onsubmit=func1();
不管是function funci()这样的无参函数，还是function func1(ar.br)这样的有参函数，上面的代码在script片段中出现函数就会执行。绑定函数时，只能在等号右边加上需要=指定的函数名，而非完整的带括号形式.  


与之对应的是在html元素中，指定相应的script句子，需要完整的形式，比如

	onclick="alert('hahha')"//可以在alert后面加上冒号  

oncopy、onbeforecopy、onsubmit、onreset这样的事件需要有返回boolean值，则可以指定为

	oncopy="return false"
	oncopy="return func1()"

上面的代码中，第一个直接禁止复制，第二个在func1()中加入了逻辑判断，但func1()也是有返回值的，返回值为boolean  
  
同样的可以看出，return func1()这里是需要的添加'()'的，因为这里不是被script包裹，只是指定了处理代码。



		


