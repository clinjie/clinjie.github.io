{% extends '_layout.swig' %}
{% import '_macro/sidebar.swig' as sidebar_template %}

{% block title %}
  {% set page_title_suffix = ' | ' + config.title %}

  {% if page.type === "categories" and not page.title  %}
    {{ __('title.category') + page_title_suffix }}
  {% elif page.type === "tags" and not page.title  %}
    {{ __('title.tag') + page_title_suffix }}
  {% else %}
    {{ page.title + page_title_suffix }}
  {% endif %}
{% endblock %}

{% block content %}

  <div id="posts" class="posts-expand">
  {% include '_partials/page-header.swig' %}
    {# tagcloud page support #}
    {% if page.type === "tags" %}
      <div class="tag-cloud">
        <div class="tag-cloud-title">
            {{ _p('counter.tag_cloud', site.tags.length) }}
        </div>
        <div class="tag-cloud-tags">
          {{ tagcloud({min_font: 12, max_font: 30, amount: 200, color: true, start_color: '#ccc', end_color: '#111'}) }}
        </div>
      </div>
    {% elif page.type === 'categories' %}
      <div class="category-all-page">
        <div class="category-all-title">
            {{ _p('counter.categories', site.categories.length) }}
        </div>
        <div class="category-all">
          {{ list_categories() }}
        </div>
      </div>
	{% elif page.type=='photo' %}

	
<script type="text/javascript" src="/lib/jquery/index.js?v=2.1.3"></script>

  
  <script type="text/javascript" src="/lib/jquery_lazyload/jquery.lazyload.js?v=1.9.7"></script>

  
  <script type="text/javascript" src="/lib/fancybox/source/jquery.fancybox.pack.js?v=2.1.5"></script>
<script type="text/javascript">
	function getList(){
	   var imgData=getImgData();
		ctrler(imgData);
};


function changeSize(){
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
								<img src="'+data[em].srclist[i]+'" alt="">\
							</div>\
						</li>';
		}


		ulTmpl ='<section class="archives album"><h1 class="year">'+data[em].year+' ^<em>'+data[em].month+'月</em></h1>\
			<ul class="img-box-ul">'+liTmpl+'</ul>\
			</section>'+ ulTmpl;
	}
	$(ulTmpl).appendTo($(".instagram"));
	changeSize();
	
	$(".instagram").lazyload();  
	
	$("a[rel=example_group]").fancybox({
	'width' : 450,
	'height' : 450,
	});

};


$(document).ready(function(){
	getList();
	bind();

});
</script>
	
	  <div class="instagram">
	  </div>
    {% else %}
      {{ page.content }}
    {% endif %}
  </div>

{% endblock %}

{% block sidebar %}
  {{ sidebar_template.render(false) }}
{% endblock %}
