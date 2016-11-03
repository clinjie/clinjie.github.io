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
		
		$.ajax({  
            url:'edit.json',  
            async:false,
            success:function(data){
            	content=data;
            }  
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
		
		var imgData=getImgData();
		
		ctrler(imgData);
	}
	
	var changeSize = function(){	
		if($(document).width() <= 600){
			$(".img-box").css({"width":"auto", "height":"auto"});
		}else{
			var width = $(".img-box-ul").width();
			var size = Math.max(width*0.26, 155);   
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
		}
	}
});