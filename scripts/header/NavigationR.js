
var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?866cb56955697bf8fd69f7210b628068";
    var s = document.getElementById("baiduTongji"); 
    s.parentNode.insertBefore(hm, s);
})();
//订单搜索
$("#J_QueryConditionForm .J_MakePoint").on("click",function(){
    var sales_order = $("#J_BaobeiName").val()
    if($.string.isEmpty(sales_order)){
        layer.tips("不能为空！",$("#J_BaobeiName"));
        return;
    }
    $.redirect("Index/sellOrder",{"sellorder":$.Base64.encode(sales_order)},"_blank");
});
var user = $.getUserInfo();
if(user){
    //获取购物车列表
    cartView.getListCart();
}


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
