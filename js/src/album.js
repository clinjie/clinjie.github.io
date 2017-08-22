	function getList(){
	   var imgData=getImgData();
		ctrler(imgData);
};


function changeSize(){
   if($(document).width() <= 600){
		$(".img-box").css({"width":"auto", "height":"auto"});
	}else{
		//根据设配宽度处理图片显示尺寸
		var width = $(".img-box-ul").width();
		var size = Math.max(width*0.28, 155);   
		$(".img-box").width(size).height(size);
	}
	$('.instagram img').each(function() {
		$(this).css("height", size);
		$(this).css("width", size);
	})
};


function bind(){
	$(window).resize(function(){
		changeSize();
	});
};


function ctrler(data){
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
};


function getImgData(){
   var content;
	$.ajax({  
        url:'/album/edit.json',  
        async:false,
        success:function(data){
        	content=data;
        }  
    }); 
    content=eval(content)
    content=content.info
	return content;
};


function render(data){
   var ulTmpl = "";

	for(var em in data){
		var liTmpl = "";
		for(var i=0,len=data[em].srclist.length;i<len;i++){
			liTmpl += '<li>\
							<div class="img-box">\
								<a class="img-bg" rel="example_group" href="'+data[em].srclist[i]+'" title="'+data[em].text[i]+'"></a>\
								<img  class="lazy"  src="/images/loading.gif" data-original="'+data[em].srclist[i]+'">\
							</div>\
						</li>';
		}


		ulTmpl ='<section class="archives album"><h1 class="year">'+data[em].year+' ^<em>'+data[em].month+'月</em></h1>\
			<ul class="img-box-ul">'+liTmpl+'</ul>\
			</section>'+ ulTmpl;
	}
	ulTmpl='<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=520 height=86 src="//music.163.com/outchain/player?type=2&id=300066&auto=1&height=66"></iframe>'+ulTmpl;
	$(ulTmpl).appendTo($(".instagram"));
	changeSize();
	
	$("img.lazt").lazyload();  
	
	$("a[rel=example_group]").fancybox({
	'width' : 450,
	'height' : 450,
	});

};


$(document).ready(function(){
	getList();
	bind();

});
$(document).bind("contextmenu",function(e){   
          return false;   
});