var page_id = "#orderDetails";

var htService = $.htService;
function getDetails(){
	var orderId = $.getQueryString("order_id");
	if($.string.isEmpty(orderId)){
		layer.alert("订单编号不能为空！",{icon:6});
		return;
	}
	var getSalesOrderCall = function(results){
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
			}
			//通知发货时间
			if(data.send_time!='1970-01-01 08:00:00'){
				$(page_id+" #send_time").html(data.send_time);
			}
			//收货时间
			if(data.receipt_time!='1970-01-01 08:00:00'){
				$(page_id+" #receipt_time").html(data.receipt_time);
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
			var statusName = $.valida.sellOrderStatus(data.order_status);

			//订单状态
			$(page_id+" #order_status").html(statusName);
			//收货地址
			$(page_id+" #userAddr").html(userAddr);
			//身份证号码
			$(page_id+" #idno").html(idno);
			//订单编号
			$(page_id+" #order_no").html(data.sales_order_sn);
			//支付方式
			$(page_id+" #pay_code").html(data.payment_info_method);
			//支付订单号
			$(page_id+" #payment_info_number").html(data.payment_info_number);
			//支付人姓名
			$(page_id+" #payment_info_name").html(data.payment_info_name);
			//支付人身份证
			$(page_id+" #payment_info_id_card_number").html(data.payment_info_id_card_number);
			//订单金额
			$(page_id+" #order_amount").html(parseFloat(data.goods_amount).toFixed(2));
			//支付金额
			$(page_id+" #money_paid").html(data.money_paid);

			var goods = data.goods;
			var  strHtml = "";
			for(var i=0;i<goods.length;i++){
				var item = goods[i];
				strHtml += '<tr class="saleborder">'+
					'<td>'+item.sku+'</td>'+
					'<td>'+item.goods_name+'</td>'+
					'<td>'+parseFloat(item.price).toFixed(2)+'</td>'+
					'<td>'+parseFloat(item.sales_price).toFixed(2)+'</td>'+
					'<td>'+item.quantity+'</td></tr>';
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
				strHtml +=' <h3 class="title"> 物流信息 </h3>\
				<div class="wulin-item">\
				<dl class="dl-horizontal clearfix">\
				   <dt>发货方式：</dt>\
			       <dd>快递 </dd>\
				</dl>\
			    <dl class="dl-horizontal">\
					<dt> 物流公司：</dt>\
					<dd class="logistics-company" data-compurl="">'+item['trans_events_array']['express']+'</dd>\
				</dl>\
				<dl class="dl-horizontal">\
				    <dt>运单号码： </dt>\
			        <dd class="logistics-id"><span class="log-id">'+item['trans_events_array']['transportion_sn']+'</span> </dd>\
				</dl>\
				<dl class="dl-horizontal" '+styleHtml+'>\
				    <dt>笨鸟单号： </dt>\
			        <dd class="logistics-id"><span class="log-id">'+item['trans_events_array']['bntracknumber']+'</span> </dd>\
				</dl>\
				<dl class="dl-horizontal"> <dt id="J_LogTrack" > 物流跟踪:</dt>\
				    <dd id="J_LogTrackText">';
				strHtml +='<ol id="J_ExList">';
				var trans_events_len = item['trans_events_array']['trans_events'].length;
				for(var j=trans_events_len-1;j>=0;j--){
					var item1 = item['trans_events_array']['trans_events'][j];
					strHtml+='<li class=""> <span class="time">'+item1['update_time'] +'</span> <span class="event"> '+item1['event'] +'</span> </li>';
				}
				strHtml +='</ol>';
				strHtml+='<div class="msg" style="display:none"> <p class="tips"> </p> </div> <p id="J_Loading" style="display: none;"正在读取物流信息... </p> </dd> </dl> </div> ';
			}
			$(page_id+" .wulin-list").html(strHtml);
		}else{
			layer.alert(results.message,{icon:6},function () {
				$.redirect('index/home');
			});
		}
	};
	htService.getSalesOrder(getSalesOrderCall,orderId,"1","1");
}
getDetails();