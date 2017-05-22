var page_id = "#purchaseOrderDetails";

var htService = $.htService;
//商品list
var goods_list = new Array();
function getDetails(){
	var orderId = $.getQueryString("order_id");
	if($.string.isEmpty(orderId)){
		layer.alert("订单编号不能为空！",{icon:6});
		return;
	}
	var getPurchaseOrderCall = function(results){
		if(results.code=="0X0000"){
			var data = results.data;
			var statusName = $.valida.purchaseOrderStatus(data.order_status);

			if(data.pay_time =='1970-01-01 08:00:00'){
				$("#xd").addClass('active');
			}else {
				$("#assign").addClass('active');
			}
			//如果采购订单已取消或者已失效
			if(data.order_status !='PURCHASE_ORDER_STATUS_CANCELLED' && data.order_status !='PURCHASE_ORDER_STATUS_ABORTED' ){
				$(".order-detail-step").show();
			}
			//下单时间
			if(data.add_time!='1970-01-01 08:00:00'){
				$(page_id+" #add_time").html(data.add_time);
			}
			//通知发货时间
			if(data.pay_time!='1970-01-01 08:00:00'){
				$(page_id+" #send_time").html(data.pay_time);
			}
			//收货时间
			if(data.assign_time!='1970-01-01 08:00:00'){
				$(page_id+" #receipt_time").html(data.assign_time);
			}
			
			if(data.pay_time =='1970-01-01 08:00:00' && data.assign_time =='1970-01-01 08:00:00'){
				$("#xd").addClass('active');
			}
			if (data.pay_time !='1970-01-01 08:00:00' && data.assign_time =='1970-01-01 08:00:00'){
				$("#pay").addClass('active');
			}
			if (data.pay_time !='1970-01-01 08:00:00' && data.assign_time !='1970-01-01 08:00:00'){
				$("#assign").addClass('active');
			}
			// //下单时间
			// $(page_id+" #add_time").html(data.add_time);
			// //付款时间
			// $(page_id+" #pay_time").html(data.pay_time);
			// //分配微仓库存时间
			// $(page_id+" #assign_time").html(data.pay_time);
			//状态
			$(page_id+" #order_status").html(statusName);
			//订单号
			$(page_id+" #purchase_order_sn").html(data.purchase_order_sn);
			//商品总价
			$(page_id+" #order_amount").html(parseFloat(data.order_amount).toFixed(2));
			var goods = data.goods;
			var  strHtml = "";
			for(var i=0;i<goods.length;i++){
				var item = goods[i];
				var total = (parseFloat(item.price)*parseInt(item.quantity)).toFixed(2);
				goods_list[i] = {"goods_id":item.goods_id,"quantity":item.quantity}
				strHtml += '<tr><td>'+item.goods_name+'</td>'+
                    '<td><div>海豚商品编号：'+item.sku+'</div></td>'+
                    '<td>￥'+parseInt(item.price).toFixed(2)+'</td>'+
                    '<td>'+item.quantity+'</td>'+
                    '<td>￥'+total+'</td></tr>';
			}
			$(page_id+" #item-list").html(strHtml);
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.getPurchaseOrder(getPurchaseOrderCall,orderId,"1");
}
getDetails();
//加入购物车
$(page_id+" #batchAdd-cart").on("click",function(){
	$.cartService.batchAddCart(JSON.stringify(goods_list),"加入购物车成功!");
});