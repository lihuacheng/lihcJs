;
//页面级ID
var page_id = "#pay"

var htService = $.htService;
/*支付*/


function toPay(pay_code) {
    var order_sn = $('#order_sn').text();
    var payDo = function (results) {
        if (results.code == "0X0000") {
            if (results.success) {
                if (results.data) {
                    switch (results.data.type) {
                        case "redirect":
                            window.location.href = results.data.info.info;
                            break;

                        case "scancode":
                            $('.wechat-img').attr('src', results.data.info.info);
                            check_pay(order_sn, results.data.send_order_sn);
                            break;

                        case 'html':
                            $('#form_div_html').html(results.data.info.info);
                            $('#dinpayForm').submit();
                            break;

                        default :
                            layer.alert(results.message);
                            break;
                    }
                }
            } else {
                layer.alert(results.message, {icon: 2});
            }
        } else {
            layer.alert(results.message, {icon: 5});
        }
    };
    htService.toPay(payDo, {pay_code: pay_code, order_sn: order_sn});
}


var timeObjFunNum = null;
function check_pay(order_sn, send_order_sn){
    var paramObj = {order_sn: order_sn, send_order_sn: send_order_sn};
    var checkSuccess = function(results){
        clearInterval(timeObjFunNum);
        if(results.code == '0X0000'){
            //支付成功
            $.redirect('index/payReturnTo',{order_sn: order_sn});
            return;
        }else{
            setTimeout(function(){
                check_pay(paramObj.order_sn, paramObj.send_order_sn);
            },3000);
        }
    }
    timeObjFunNum = setInterval(function(){
        check_pay(paramObj.order_sn, paramObj.send_order_sn);
    },10000);
    htService.checkOrderPay(checkSuccess, paramObj);
}
//
///* 检查支付*/
//function check_pay(order_sn, send_order_sn) {
//    if (g_timer !== null) return;
//
//    var handler = function () {
//        $.ajax({
//            type: "post",
//            dataType: "json",
//            url: $.apiU(url),
//            async: false,
//            data: {"order_sn": order_sn},
//            success: function (data) {
//                //TODO 验证是否支付成功
//                if (data.success) {
//
//                }
//
//
//                if (data.status == 'Y') {
//                    window.location.href = data.url;
//                    clearInterval(g_timer);
//                }
//            },
//        });
//    }
//    g_timer = setInterval(handler, 3000);
//}
$(function () {
    //验证是否有效订单
    if ($('#order_sn').text() == '') layer.alert('无效订单!', {icon: 5});
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });

    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').focus()
    });

    $('#myModal').on('hide.bs.modal', function () {
        if (timeObjFunNum !== null) clearInterval(timeObjFunNum);
        timeObjFunNum = null;
    });


    $(".modal-body-wechat").mouseover(function () {
        $(".wechat-course").stop();
        $(".wechat-course").show().animate({right: "-249px"}, "slow");
    }).mouseout(function () {
        $(".wechat-course").stop();
        $(".wechat-course").hide().animate({right: "0px"}, "slow");
    });
    $('body').on('mouseenter', '#internal_alipay', function () {
        $('input[name="pay_code"]').val("internal_alipay");
    })
    $('body').on('mouseenter', '#ehking', function () {
        $('input[name="pay_code"]').val("ehking");
    })
    $('body').on('mouseenter', '#yijifu', function () {
        $('input[name="pay_code"]').val("yiji");
    })


    $(".see-desc").on("click", function () {
        var $this = $(this);
        var cashierdesc = $(".cashier-desc");
        var toggletext = $this.find(".see-desc-text");
        var icon = $(".see-desc .icon-bottom");
        var iconclass = "icon-top";
        var toggletextcontent = cashierdesc.is(":visible") ? "查看详情" : "收起详情";
        elementToggle(cashierdesc, toggletext, toggletextcontent, icon, iconclass);


    });

    $(".more-link").on("click", function () {
        var $this = $(this);
        var paymore = $(".pay-more");
        var toggletextcontent = paymore.is(":visible") ? "<span class='glyphicon glyphicon-plus' aria-hidden='true'></span>更多支付方式" : "<span class='glyphicon glyphicon-minus' aria-hidden='true'></span>收起支付方式";
        elementToggle(paymore, $this, toggletextcontent);
    });


});
function elementToggle(togelement, togtext, togtextcontent, icon, iconclass) {
    if (togelement.is(":visible")) {
        togelement.stop();
        togelement.fadeOut('400');
        togtext.html(togtextcontent);
        if (icon && iconclass) {
            icon.removeClass(iconclass);
        }
    } else {
        togelement.stop();
        togtext.html(togtextcontent);
        togelement.fadeIn('400');
        if (icon && iconclass) {
            icon.addClass(iconclass);
        }
    }
}

//
$(function(){
	$('.pay-chengnuoBtn').click(function(){
		$('.pay-chengnuo').hide();
		$('.pay-method').show();
		
		
		
	})
	
	
	
	
	
})
