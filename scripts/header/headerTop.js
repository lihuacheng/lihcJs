//获取用户信息
var user = $.getUserInfo();
//填充用户信息
userInfo(user);

//填充用户数据
function userInfo(info){
    if(info){
    	var name = info.nick;
        if($.string.isEmpty(name)){
            name = info.mobile_phone;
        }
        $(".header-bar .no-login").hide();
        $("#userInfo-username").html(name);
    }else{
        $(".header-bar .no-login").show();
        $(".header-bar .is-login").hide();
    }
}
//退出
$("#logout").on("click",function(){
    $.removeStorage("userInfo");
    $.redirect("index/logout");
});

//手机版  移入移出
$(".phone-code").mouseover(function(){
    $(".hover-code").show();
}).mouseleave(function(){
    $(".hover-code").hide();
});

//产品详情  预绑定
$("body").on("click",".goodsdetails",function(){
    var sku = $(this).attr("data-sku");
    $.redirect("Index/details",{"sku":sku},"_blank");
});