var page_id = "#user-menu";
var menu_child = $(page_id+" .menu-list li");
var url = window.location.href;
//是否是B端用户
if($.isUserB()){
	$(page_id+" #b-menu").show();
}
menu_child.each(function(k,v){
	var dataName = menu_child.eq(k).attr("data-name");
	var nameArray = dataName.split(',');
	for(var i=0;i<nameArray.length;i++){
		if(url.indexOf(nameArray[i])!=-1){
			menu_child.removeClass("check-li").eq(k).addClass("check-li");
			return false;
		}
	}
});

menu_child.on("click",function(){
	var arrayName = $(this).attr("data-name").split(",");
	var toUrl = "index/"+arrayName[0];
	$.redirect(toUrl);
});