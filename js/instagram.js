define([], function (){
	
	
	var render = function(data){
		var ulTmpl = "";

		for(var em in data){
			var liTmpl = "";
			for(var i=0,len=data[em].srclist.length;i<len;i++){
				liTmpl += '<li>\
								<div class="img-box">\
									<a class="img-bg" rel="example_group" href="'+data[em].srclist[i]+'" title="'+data[em].text[i]+'"></a>\
									<img lazy-src="'+data[em].srclist[i]+'" alt="">\
								</div>\
							</li>';
			}
			ulTmpl = '<section class="archives album"><h1 class="year">'+data[em].year+'<em>'+data[em].month+'月</em></h1>\
				<ul class="img-box-ul">'+liTmpl+'</ul>\
				</section>'+ ulTmpl;
		}
		$(ulTmpl).appendTo($(".instagram"));
		
		changeSize();
		
		$(".instagram").lazyload();
		
		$("a[rel=example_group]").fancybox();
	}
	
	
	var getImgData=function(){
		
		var content;
		
		$.getJSON('edit.json').success(function(data)
		{
			content=data;
		});
		
		return content;
	}
	
	var ctrler = function(data){
		var imgObj = {};
		for(var i=0,len=data.length;i<len;i++){
			var y = data[i].y;
			var m = data[i].m;
			var src = data[i].src;
			var text = data[i].text;
			var key = y+""+((m+"").length == 1?"0"+m : m);
			if(imgObj[key]){
				imgObj[key].srclist.push(src);
				imgObj[key].text.push(text);
			}else{
				imgObj[key] = {
					year:y,
					month:m,
					srclist:[src],
					text:[text]
				}
			}
		}
		render(imgObj);
	}
	
	var getList = function(){
		/*var photoData = [{"src":"http://7xowaa.com1.z0.glb.clouddn.com/shanghai1.png","text":"上海外滩","y":2015,"m":10},
{"src":"http://7xowaa.com1.z0.glb.clouddn.com/shanghai2.png","text":"我-背影","y":2015,"m":10},
{"src":"http://7xowaa.com1.z0.glb.clouddn.com/shanghai3.png","text":"我与马赛克","y":2015,"m":10},
{"src":"http://7xowaa.com1.z0.glb.clouddn.com/shanghai4.png","text":"未名桥","y":2015,"m":10},
{"src":"http://7xowaa.com1.z0.glb.clouddn.com/shanghai5.png","text":"色彩斑斓","y":2015,"m":10},
{"src":"http://7xowaa.com1.z0.glb.clouddn.com/shanghai6.png","text":"随手拍","y":2014,"m":6},
{"src":"http://7xowaa.com1.z0.glb.clouddn.com/shanghai7.png","text":"宜家","y":2015,"m":10},
{"src":"http://7xowaa.com1.z0.glb.clouddn.com/shanghai8.png","text":"被抓拍","y":2015,"m":10},
{"src":"http://7xowaa.com1.z0.glb.clouddn.com/shaonv.png","text":"很像","y":2015,"m":12},
{"src":"http://7xowaa.com1.z0.glb.clouddn.com/renshenghaihai.jpg","text":"人生海海","y":2014,"m":11},
{"src":"http://7xowaa.com1.z0.glb.clouddn.com/giveup.jpg","text":"你知道的-不放弃","y":2015,"m":12},
{"src":"http://7xowaa.com1.z0.glb.clouddn.com/eo.jpg","text":"理想型、很像","y":2015,"m":11},
{"src":"http://7xowaa.com1.z0.glb.clouddn.com/asinecat.jpg","text":"ashin-瞄","y":2013,"m":7}];*/

		var imgData=getImgData();
		
		ctrler(imgData);
	}
	
	var changeSize = function(){	
		if($(document).width() <= 600){
			$(".img-box").css({"width":"auto", "height":"auto"});
		}else{
			var width = $(".img-box-ul").width();
			var size = Math.max(width*0.26, 155);   //var size = Math.max(width*0.26, 157);
			$(".img-box").width(size).height(size);
		}
		$('.instagram img').each(function() {
			

			$(this).css("height", size);
			$(this).css("width", size); 
			
		})
	}
	
	var bind = function(){
		$(window).resize(function(){
			changeSize();
		});
	}

	return {
		init:function(){
			getList();
			bind();
			$(document).ready(function(){
				$(document).bind("contextmenu",function(e){
					return false;
				});
			});
		}
	}
});