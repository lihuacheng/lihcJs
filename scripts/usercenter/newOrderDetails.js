var page_id = "#orderDetails";

var htService = $.htService;

function getDetails(){
	var orderId = $.getQueryString("order_id");
	if($.string.isEmpty(orderId)){
		layer.alert("订单编号不能为空！",{icon:6});
		return;
	}
	var getCOrderDetailsCall = function(results){
		if(results.code=="0X0000"){
			var data = results.data;
			var idno = data.id_card_number;
			if(idno){
				idno = idno.substring(idno.length-4,idno.length);
			}
			idno = "**************"+idno;
			var mobile = data.mobile;
			if(mobile){
				mobile = mobile.substring(mobile.length-4,mobile.length);
			}
			mobile = "**************"+mobile;
			var userAddr = data.consignee+',*******'+mobile+
			','+data.province+" "+data.city+" "+data.district+" "+data.address;
            //下单时间
			if(data.add_time!='1970-01-01 08:00:00'){
				$(page_id+" #add_time").html(data.add_time);
				$(page_id+" .myOrder2S1").addClass('active');
			}
			//付款时间
			if(data.pay_time!='1970-01-01 08:00:00'){
				$(page_id+" #pay_time").html(data.pay_time);
				$(page_id+" .myOrder2S2").addClass('active');
			}
			//通知发货时间
			if(data.send_time!='1970-01-01 08:00:00'){
				$(page_id+" #send_time").html(data.send_time);
				$(page_id+" .myOrder2S3").addClass('active');
			}
			//收货时间
			if(data.receipt_time!='1970-01-01 08:00:00'){
				$(page_id+" #receipt_time").html(data.receipt_time);
				$(page_id+" .myOrder2S4").addClass('active');
			}
			
			if(data.send_time =='1970-01-01 08:00:00' && data.receipt_time =='1970-01-01 08:00:00'){
				$("#xd").addClass('active');
			}
			if (data.send_time !='1970-01-01 08:00:00' && data.receipt_time =='1970-01-01 08:00:00'){
				$("#tzfh").addClass('active');
			}
			if (data.send_time !='1970-01-01 08:00:00' && data.receipt_time !='1970-01-01 08:00:00'){
				$("#qrsh").addClass('active');
			}
			//如果订单已取消
			if(data.order_status_type !='cancel'){
				$(".order-detail-step").show();
			}
			//订单状态
			$(page_id+" #order_status").html(data.order_status_info);
			//收货地址
			$(page_id+" #userAddr").html(userAddr);
			//身份证号码
			$(page_id+" #idno").html(idno);
			//订单编号
			$(page_id+" #order_no").html(data.c_order_sn);
			//订单总额
			$(page_id+" #pullout_amount").html(data.pullout_amount);
			//支付总额
			$(page_id+" #payment_amount").html(data.payment_amount);
			//支付方式
			$(page_id+" #pay_code").html(data.pay_code_name ? data.pay_code_name : data.pay_code);
			//支付订单号
			$(page_id+" #trade_no").html(data.payment_info_number);
			//订单金额
			$(page_id+" #order_amount").html(data.order_amount);
			//订单金额
			$(page_id+" #pay_amount").html(data.order_amount);

			var goods = data.goods;
			var  strHtml = "";
			for(var i=0;i<goods.length;i++){
				var item = goods[i];
				strHtml += '<ul class="MmyOrder4Div2">\
					<li class="MmyOrderSpan1">\
	                <div class="MmyOrder4Div2_2">'+item.goods_name+'</div></li>\
	                <li class="MmyOrderSpan2">'+item.sku+'</li>\
	                <li class="MmyOrderSpan3">'+item.price+'</li>\
	                <li class="MmyOrderSpan4">'+item.quantity+'</li></ul>';
			}
			$(page_id+" #item-list").html(strHtml);
			//对接物流
			var logistics = data.logistics;
			var strHtml='';
			for(var i=0;i<logistics.length;i++){
				var item = logistics[i];
				var bntracknumber = item['trans_events_array']['bntracknumber'];
				var styleHtml = '';
				if($.string.isEmpty(bntracknumber)){
					styleHtml = 'style="display:none;"';
				}
				strHtml +=' <div>物流公司：'+item['trans_events_array']['express']+'  \
				运单号：'+item['trans_events_array']['transportion_sn']+'   \
				<span '+styleHtml+'>笨鸟单号：'+item['trans_events_array']['bntracknumber']+'</span></div>\
			    <div class="MmyOrder1_2F2">温馨提示：订单较多，物流信息会稍有延迟，您可点击快递官网自动查询</div>\
				<ul class="MmyOrder1_2F3">';
				var trans_events_len = item['trans_events_array']['trans_events'].length;
				for(var j=trans_events_len-1;j>=0;j--){
					var item1 = item['trans_events_array']['trans_events'][j];
					strHtml+='<li style="display:none;"><div class="MmyOrder1_2F3div"></div>';
					if(j==trans_events_len-1){
						strHtml += '<div class="MmyOrder1_2F3div-border"></div>';
					}
					strHtml += '<span  class="MmyOrder1_2F3span1">'+item1['update_time'] +'</span> <span> '+item1['event'] +'</span> </li>';
				}
				strHtml +='</ul>';
				strHtml+='<div class="MmyOrder1_2F4" id="showAllExpress">显示全部 <img src="../../Public/images/home/xiabiao.png"/></div>';
			}
			$(page_id+" .wulin-list").html(strHtml);
			$(page_id+" .wulin-list li").each(function(k,v){
				if(k<5){
					$(this).show();
				}
			});


		}else{
			layer.alert(results.message,{icon:6},function () {
				$.redirect('index/home');
			});

		}
	};
	htService.getCOrderDetails(getCOrderDetailsCall,orderId);
	//显示全部物流信息  预绑定事件
	$(page_id).on('click','#showAllExpress',function(){
		$(page_id+" .wulin-list li").show();
		$(this).hide();
	});
}
getDetails();