var htService = $.htService;

var filter = {
    page:1,
    page_size:10
};
//搜索
$("#affiche-search").on("click",function(){
    getBulletinList();
});
//回车搜索
$("input[name=affichename]").keyup(function(e){ 
    if(e.keyCode==13){ 
        getBulletinList();
    }
});
//公告详情  预绑定
$("body").on("click",".affichedetails",function(){
    var bulletin_id = $(this).attr("data-id");
    $.redirect("Index/afficheDetails",{"bulletin_id":bulletin_id},"_blank");
});
getBulletinList()

//获取公共列表
function getBulletinList(page,page_size){
    var keyword = $("input[name=affichename]").val();
    //分页回调
    var backCall = function(page,page_size){
        filter.page = page;
        filter.page_size = page_size;
        getBulletinList(filter.page,filter.page_size);
    };
    var getBulletinListCall = function(results){
        if(results.code=="0X0000"){
            var data = results.data;
            var list = data.list;
            filter = data.filter;
            updAfficheListHtml(list)
            $.page.htPage($("#pager"),filter,backCall);
        }else{
            layer.alert(results.message,{icon:6});
        }
    };
    htService.getBulletinList(getBulletinListCall,keyword,1,filter.page,filter.page_size,"add_time","ASC");
}
//更新公共列表HTML
function updAfficheListHtml(list){
    if(list.length==0){
        $("#affiche-no-data").show();
        $(".announcement_table").hide();
        $("#affiche-no-name").html($("input[name=affichename]").val());
        return;
    }
    $("#affiche-no-data").hide();
    $(".announcement_table").show();
    var strHtml = '<tr><th>标题</th><th>时间</th></tr>';
    for(var i=0;i<list.length;i++){
        var item = list[i];
        strHtml += '<tr><td><a href="javascript:void(0);" class="affichedetails" '+
        ' data-id="'+item.id+'">'+item.title+'</a></td>'+
        '<td>'+item.add_time+'</td></tr>';
    }
    $(".announcement_table").html(strHtml);
}