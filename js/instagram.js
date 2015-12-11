var Instagram = (function(){

	var _collection = [];

	var preLoad = function(data){
		for(var em in data){
			for(var i=0,len=data[em].srclist.length;i<len;i++){
				var src = data[em].bigSrclist[i];
				var img = new Image();
				img.src = src;
			}
		}
	}

	var render = function(data){
		for(var em in data){
			var liTmpl = "";
			for(var i=0,len=data[em].srclist.length;i<len;i++){
				liTmpl += '<li>\
								<div class="img-box">\
									<a class="img-bg" rel="example_group" href="'+data[em].bigSrclist[i]+'" title="'+data[em].text[i]+'"></a>\
									<img lazy-src="'+data[em].srclist[i]+'" alt="">\
								</div>\
							</li>';
			}
			$('<section class="archives album"><h1 class="year">'+data[em].year+'<em>'+data[em].month+'月</em></h1>\
				<ul class="img-box-ul">'+liTmpl+'</ul>\
				</section>').appendTo($(".instagram"));
		}

		$(".instagram").lazyload();
		changeSize();

		setTimeout(function(){
			preLoad(data);
		},3000);
		
		$("a[rel=example_group]").fancybox();
	}

	var replacer = function(str){
		if(str.indexOf("outbound-distilleryimage") >= 0 ){
			var cdnNum = str.match(/outbound-distilleryimage([\s\S]*?)\//)[1];
			var arr = str.split("/");
			return "http://distilleryimage"+cdnNum+".ak.instagram.com/"+arr[arr.length-1];
		}else{
			var url = "http://photos-g.ak.instagram.com/hphotos-ak-xpf1/";
			var arr = str.split("/");
			return url+arr[arr.length-1];
		}
	}

	var ctrler = function(data){
		var imgObj = {};
		for(var i=0,len=data.length;i<len;i++){
			//var d = new Date(data[i].created_time*1000);
			var y = data[i].y;
			var m = data[i].m;
			var src = data[i].src;
			//var bigSrc = replacer(data[i].images.standard_resolution.url);
			var text = data[i].text; // data[i].caption 有可能为 null
			var key = y+"-"+m;
			if(imgObj[key]){
				imgObj[key].srclist.push(src);
				imgObj[key].bigSrclist.push(src);
				imgObj[key].text.push(text);
			}else
			{
				imgObj[key] = {
					year:y,
					month:m,
					srclist:[src],
					bigSrclist:[src],
					text:[text]
				}
			}
		}
		render(imgObj);
	}

	var getList = function(url){
		//$(".open-ins").html("图片来自instagram，正在加载中…");
		_collection=[{"src":"http://7xowaa.com1.z0.glb.clouddn.com/shanghai1.png","text":"上海外滩","y":2015,"m":10},
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
{"src":"http://7xowaa.com1.z0.glb.clouddn.com/asinecat.jpg","text":"ashin-瞄","y":2013,"m":7}];
		ctrler(_collection);
		/*$.ajax({
			url: url,
			type:"GET",
			dataType:"jsonp",
			success:function(re){
				if(re.meta.code == 200){
					_collection = _collection.concat(re.data);
					alert(re.data);
					var next = re.pagination.next_url;
					if(next){
						getList(next);
					}else{
						$(".open-ins").html("图片来自instagram，点此访问");
						ctrler(_collection);
					}
				}else{
					//alert("access_token timeout!");
				}
			}
		});*/
	}
	

	var changeSize = function(){	
		if($(document).width() <= 600){
			$(".img-box").css({"width":"auto", "height":"auto"});
		}else{
			var width = $(".img-box-ul").width();
			var size = Math.max(width*0.26, 157);
			$(".img-box").width(size).height(size);
		}
	}

	var bind = function(){
		$(window).resize(function(){
			changeSize();
		});
	}

	return {
		init:function(){
			getList("https://api.instagram.com/v1/users/2309138942/media/recent?access_token=2309138942.1fb234f.eb4b75cd72b74d7a92c82c5bb6ba9df3&count=100");
			//var insid = $(".instagram").attr("data-client-id");
            //var userId = $(".instagram").attr("data-user-id");

			/*if(!insid){
				alert("Didn't set your instagram client_id.\nPlease see the info on the console of your brower.");
				console.log("Please open 'http://instagram.com/developer/clients/manage/' to get your client-id.");
				return;
			}
			getList("https://api.instagram.com/v1/users/"+ userId +"/media/recent/?client_id="+insid+"&count=100");*/
			bind();
		}
	}
})();
$(function(){
	Instagram.init();
})
