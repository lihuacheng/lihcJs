var cartView = $.cartView;
//获取购物车列表
cartView.getListCart();

$(".dd-inner").children(".item").hover(function () { //一级导航悬浮
    $(this).addClass("hover").siblings(".item").removeClass("hover");
    var index = $(this).index();
    $(".dorpdown-layer").children(".item-sub").hide();
    $(".dorpdown-layer").children(".item-sub").eq(index).show();
})
$(".dd-inner").hover(function () { //整个导航菜单悬浮，是否显示二级导航到出厂
    $("#index_menus_sub").show();
}, function () {
    $("#index_menus_sub").hide();
    $('.item').removeClass("hover");
})
$("#index_menus_sub").children(".item-sub").hover(function () { //二级导航悬浮
    var index = $(this).index();
    $(".dd-inner").children(".item").eq(index).addClass("hover");
    $("#index_menus_sub").show();
}, function () {
    $("#index_menus_sub").hide();
    $(".dd-inner").children(".item").removeClass("hover");
})

var _hmt = _hmt || [];
var hm = document.createElement("script");
hm.src = "//hm.baidu.com/hm.js?866cb56955697bf8fd69f7210b628068";
var s = document.getElementById("baiduTongji");
s.parentNode.insertBefore(hm, s);

$('.micro_close').click(function () {
    $('.Micro-channel').hide();
    sessionStorage.setItem("microflag", "0");
});
if (sessionStorage.getItem("microflag") == "0") {
    $('.Micro-channel').hide();
}else {
    setTimeout(function () {
        $('.Micro-channel').show();
    }, 300);
}
$('#quick-bar').on('mouseenter mouseleave', 'li', function (e) {
    var $this = $(this);
    var $popover = $this.find('.popover');
    if (e.type == 'mouseenter') {
        $popover.stop(true, false).addClass('in').fadeIn(50);
        if ($this.hasClass('order-search')) {
            $this.find('#J_BaobeiName').focus();
        }
    }
    else {
        $popover.stop(true, false).fadeOut(50);
    }
});
$('#quick-bar .popover').mouseenter(function () {
    $(this).stop(true, true).addClass('in').fadeIn(1);//第一个true如果设置成true，则清空队列;第二个true让当前正在执行的动画立即完成
});
$('#quick-bar .go-top').click(function () {
    $('html,body').stop(true, false).animate({
        scrollTop: 0
    }, 500)
});


$('#quick-bar .bar-haddle').click(function () {
    if ($('#quick-bar').hasClass('shutdown')) {
        $('#quick-bar').removeClass('shutdown');
        sessionStorage.setItem("flagzk", "0");
    }
    else {
        $('#quick-bar').addClass('shutdown');
        sessionStorage.setItem("flagzk", "1");
    }
});
if (sessionStorage.getItem("flagzk") == "1") {
    $('#quick-bar').show().addClass('shutdown');
}
else if (sessionStorage.getItem("flagzk") == "0") {
    $('#quick-bar').show().removeClass('shutdown');
}
else {
    $('#quick-bar').show();
}

var t = n = 0, count;
count = $("#zj-home-pic a").length;
$("#zj-home-pic a:not(:first-child)").hide();
$(".zj-home-banner-num li").click(function () {
    var i = $(this).attr("num") - 1;//获取Li元素内的值，即1，2，3，4
    n = i;
    if (i >= count) return;
    $("#zj-home-pic a").stop(true, false).filter(":visible").fadeOut(500).parent().children().eq(i).fadeIn(500);
    $(this).toggleClass("on");
    $(this).siblings().removeAttr("class");
});

/*
t = setInterval("showAuto()", 6000);
$("#banner-index").hover(function () {
    clearInterval(t)
}, function () {
    t = setInterval("showAuto()", 6000);
});
*/

function showAuto() {
    n = n >= (count - 1) ? 0 : ++n;
    $(".zj-home-banner-num li").eq(n).stop(true, false).trigger('click');
}
$('.nav-container .dropdown').click(function () {
    if ($(this).hasClass('open')) {
        $('#banner-index').removeClass('active');
    }
    else {
        $('#banner-index').addClass('active');
    }
    $(this).toggleClass('open');
});

if (window.sessionStorage) {
    if (!sessionStorage.flag)sessionStorage.flag = "true";
    $('.deletetop').click(function () {
        sessionStorage.flag = false;
        $(this).parents('.floatsearch').slideUp('fast');
    })
}
$(window).bind("scroll", function () {
    if (sessionStorage.flag == 'true') {
        var scrolltop = $(document).scrollTop();
        if (scrolltop > 131) {
            $('.floatsearch').slideDown('fast');
        }
        else {
            $('.floatsearch').slideUp('fast');
        }
    }
})

$('.Scrollspy li').click(function () {
    $('.Scrollspy a').attr('class', '');
    $(this).find('a').attr('class', 'active1');

});
$(window).on('scroll', function () {
    var X = Math.round(($(document).scrollTop() - 2000) / 600);
    if (X < 0) {
        X = 0;
    }

    if ($(document).scrollTop() < 550) {
        $('.Scrollspy').css('display', 'none')

    } else {

        $('.Scrollspy').css('display', 'block')

    }
    $('.Scrollspy a').attr('class', '');
    $('.Scrollspy a').eq(X).attr('class', 'active1');
});

$(window).on('scroll', function () {
    var top = $(document).scrollTop();
    if (top < 320 ) {
        $('#quick-bar').css('top', '630px');
    }else{
    	$('#quick-bar').css('top', '35%');
    }
});
$(window).trigger("scroll");

    // 更多公告展示按钮
$("#bulletinMore").on('click', function () {
    $.redirect("Index/afficheList",{},"_blank");
});

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
        $('.no-login').remove();
        $('.is-login').show();
        $('.user-name').html(name);
        if(name.length>11){
            name = name.substring(0,11)+"...";
        }
        $("#home-login-register").hide();
        $("#home-user-info").show();
        $("#home-user-info .name").html(name);
        $("#header_logo_no").hide();
        $("#header_logo_yes").show();
    }else{
        $("#home-user-info").hide();
        $("#home-login-register").show();
        $('.is-login').remove();
        $('.no-login').show();
    }
    if($.isUserB()){
        $("#flmanager").show();
    }
}
//退出
$("#logout,#logout-2").on("click",function(){
    $.removeStorage("userInfo");
    $.redirect("index/logout");
});
//手机版  移入移出
$(".phone-code").mouseover(function(){
    $(".hover-code").show();
}).mouseleave(function(){
    $(".hover-code").hide();
});

//查看公共详情
$(".afficheDetails").on("click",function(){
    var bulletin_id = $(this).attr("data-id");
    $.redirect("index/afficheDetails",{"bulletin_id":bulletin_id},"_blank");
});

//订单搜索
$("#J_QueryConditionForm .J_MakePoint").on("click",function(){
    var sales_order = $("#J_BaobeiName").val()
    if($.string.isEmpty(sales_order)){
        layer.tips("不能为空！",$("#J_BaobeiName"));
        return;
    }
    $.redirect("Index/sellOrder",{"sellorder":$.Base64.encode(sales_order)},"_blank");
});

//产品详情  预绑定
$("body").on("click",".goodsdetails",function(){
    var sku = $(this).attr("data-sku");
    $.redirect("Index/details",{"sku":sku},"_blank");
});

//延迟加载商品图片
$("img.lazy").lazyload({effect: "fadeIn"});


$(".content-cover-zy3").height($("body").height());
$(".banner_right").css({"position":"relative","z-index":"10002"});
$(".gonggao-div").css({"position":"relative","z-index":"2000"});
//标识首页 是否出现引导页
var ydy_bs = $.getStorage("home-ydy-bs");
if($.string.isNotEmpty(ydy_bs)){
    $(".banner_right").css({"position":"relative","z-index":"4"});
    $(".content-cover-zy3,.cover-gonggao").hide();
}else{
    $("#banner_right-ZZC").addClass("banner_right-ZZC");
    $(".content-cover-zy3,.cover-gonggao").show();
    $.setLocalStorage("home-ydy-bs","1");
    //删除遮罩层
    $(".content-cover-zy3,.cover-gonggao").click(function(){
        $(".content-cover-zy3").remove();
        $(".cover-gonggao").remove();
        $("#banner_right-ZZC").removeClass("banner_right-ZZC");
        $(".banner_right").css({"position":"relative","z-index":"4"});
    })
}
