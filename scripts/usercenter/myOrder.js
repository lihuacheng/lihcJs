//页面级ID
var page_id = "#myOrder"

var htService = $.htService;

var nav = $(page_id+" #J_navbar .redline");

var filter;

var states = {
	self_all : "self_all",//所有订单
	self_need_pay : "self_need_pay",//未付款
	self_need_delivery : "self_need_delivery",//未发货
	shipped : "shipped",//已发货
	cancel : "cancel ",//已取消
	finished : "finished "//已完成
};
var checkState = states.self_all;

var backCall = function(page,page_size){
	getCOrderList(checkState,page,page_size);
};

//获取C端 订单数据
function getCOrderList(state,page,page_size){
	var keyword = $(page_id+" #keyword").val();
	var getCOrderListCall = function(results){
		if(results.code=="0X0000"){
			var data = results.data;
			filter = data.filter;
			var list = data.list;
			var productHtml = "";
			if(list.length==0){
				$(page_id+" #pager").hide();
				$(page_id+" #not-date").show();
			}else{
				$(page_id+" #pager").show();
				$(page_id+" #not-date").hide();
			}
			for(var n=0;n<list.length;n++){
				var product = list[n];
				var statusType = product.order_status_type;
				var statusName = product.order_status_info;
            	var pay_expire_flag = product.pay_expire_flag;
            	if(parseInt(pay_expire_flag)==0){
            		statusName = "超时订单";
            	}
				productHtml += '<tbody class="combo-order close-order xcard combo-order-success" name="data">'+
	                '<tr class="sep-row"><td colspan="7"></td></tr>'+
	                '<tr class="order-hd"><td class="first" colspan="5">'+
	                '<div class="summary"><span class="number">订单号：<em>'+product.c_order_sn+'</em>'+
	                '</span><span><em>'+product.add_time+'</em></span></div>'+
	                '<a class="qq-contact" target="_blank" '+
	                'href="http://wpa.qq.com/msgrd?v=3&amp;uin=2210557946&amp;site=qq&amp;menu=yes">'+
	                '联系客服</a></td>'+
	                '<td class="last" colspan="2"><div class="operates"></div></td></tr>'+
	                '<tr class="col-name"><td class="baobei">商品</td>'+
	                '<td class="item-operate">海豚商品编号</td>'+
	                '<td class="price">单价（元）</td>'+
	                '<td class="quantity">数量</td>'+
	                '<td class="amount">实付款（元）</td>'+
	                '<td class="trade-status">订单状态</td>'+
	                '<td class="trade-operate">订单操作</td></tr>';
                var goods = product.goods;
                var goodsHtml = "";
                for(var i=0;i<goods.length;i++){
                	var item = goods[i];
	                goodsHtml += '<tr class="order-bd"><td class="baobei">'+
	                    '<a title="查看宝贝详情" href="javascript:void(0);" '+
	                    'class="pic goodsdetails" data-sku="'+item.sku+'" style="position: relative;">'+
	                    '<img class="img-responsive lazy" src="'+item.img_thumb+'" '+
	                    'data-original="'+item.img_original+'" '+
	                    'alt="查看宝贝详情" style="display: block;"></a>'+
	                    '<div class="desc"><p class="baobei-name">'+
	                    '<a href="javascript:void(0);" class="J_MakePoint goodsdetails" data-sku="'+item.sku+'" >'+item.goods_name+'</a></p>'+
	                    '<div class="spec" title=""><span></span></div></div></td>'+
	                    '<td class="item-operate"><div>'+item.sku+'</div></td>'+
	                    '<td class="price"><em class="origin-price special-num">'+parseFloat(item.market_price).toFixed(2)+'</em>'+
	                    '<br><em class="special-num">'+parseFloat(item.price).toFixed(2)+'</em></td>'+
	                    '<td class="quantity"><em class="special-num">'+item.quantity+'</em></td>';
	                    if(i==0){
	                    	goodsHtml += '<td class="trade-status td-last " rowspan="'+goods.length+'">'+
			                    '<em class="special-num">'+parseFloat(product.order_amount).toFixed(2)+'</em></td>'+
			                    '<td class="trade-status td-last" rowspan="'+goods.length+'">'+
			                    '<div><a href="javascript:void(0);" order_id="'+product.c_order_id+'" '+
			                    'target="_blank" class="J_MakePoint status">'+statusName+'</a></div>'+
			                    '<div><a href="javascript:void(0);" order_id="'+product.c_order_sn+'" '+
			                    'class="detail-link J_MakePoint">订单详情</a></div></td>'+
			                    '<td class="trade-operate td-last" rowspan="'+goods.length+'">';
			                if(statusType==states.self_need_pay){
			                	if(parseInt(pay_expire_flag)==1){
			                		goodsHtml += '<input class="btn btn-primary zhifubao-btn myorder-pay-btn" order_id="'+product.c_order_id+'" order_sn="'+product.c_order_sn+'" type="button" value="付款" >'+
										'<div style="margin-top:4px;"><a href="javascript:void(0);" '+
										'order_id="'+product.c_order_id+'" '+
										'class="cancelorder">取消订单</a></div>';
			                	}else{
			                		goodsHtml +='<div style="margin-top:4px;"><a href="javascript:void(0);" '+
										'order_id="'+product.c_order_id+'" >无效订单</a></div>';
			                	}
			                	
			                }else if(statusType==states.shipped){
			                	goodsHtml += '<input class="btn btn-primary confirm-goods" order_id="'+product.c_order_id+'"  type="button" value="确认收货" >';
			                }else if(statusType==states.finished){
			                	goodsHtml += '<div>已完成</div>';
			                }
			                goodsHtml += '</td>';
	                    }
	                    goodsHtml += '</tr>';
                }
                productHtml += goodsHtml;
                productHtml += '</tbody>';
			}
			//获取订单数量
			getCOrderTotal();
			$(page_id+" #J_BoughtTable").html(productHtml);
			$.page.htPage($(page_id+" #pager"),filter,backCall);
			
		}else{
			layer.alert(results.message,{icon:6});
		}
		
	};
	htService.getCOrderList(getCOrderListCall,state,keyword,page,page_size);
}
//订单数量
function getCOrderTotal(){
	var getCOrderTotalCall = function(results){
		if(results.code=="0X0000"){
			var data = results.data;
			for(var key in data){
				var value = parseInt(data[key]);
				if(value>0){
					$(page_id+" #"+key).html(value);
				}else{
					$(page_id+" #"+key).html(0);
				}
				
			}
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.getCOrderTotal(getCOrderTotalCall,states.self_all);
}
//取消订单
function cancelCOrder(order_id,$this){
	var cancelCOrderCall = function(results){
		if(results.code=="0X0000"){
			if($this){
				var $tbody = $this.closest("tbody");
				$tbody.find(".status").html("已取消");
				$tbody.find(".trade-operate").html("");
				getCOrderTotal();
			}else{
				backCall(filter.page,filter.page_size);
			}
			layer.alert("取消成功!");
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.cancelCOrder(cancelCOrderCall,order_id);
}
//确认收货
function closeCOrder(order_id,$this){
	var closeCOrderCall = function(results){
		if(results.code=="0X0000"){
			if($this){
				var $tbody = $this.closest("tbody");
				$tbody.find(".status").html("已收货");
				$tbody.find(".trade-operate").html("");
				getCOrderTotal();
			}else{
				backCall(filter.page,filter.page_size);
			}
			layer.alert("确实收货成功!");
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.closeCOrder(closeCOrderCall,order_id);
}
//订单搜索
$(page_id+" .search-btn").on("click",function(){
	getCOrderList(checkState);
});

//nav栏 移入移出效果
nav.mouseover(function(){
	var index = $(this).index();
    $(page_id+" .wrap-line span").css({"left":(index*115)+"px"});
}).mouseout(function(){
	var index =$(page_id+" #J_navbar .selected").index();
  	$(page_id+" .wrap-line span").css({"left":(index*115)+"px"});
});
//nav 切换
nav.on("click",function(){
	nav.removeClass("selected");
	$(this).addClass("selected");
	checkState = states[$(this).attr("data-id")];
	getCOrderList(checkState);
});
//订单详情 预绑定事件
$(page_id+" #J_BoughtTable").on("click",".detail-link",function(){
	var order_id = $(this).attr("order_id");
	var param = {"order_id":order_id,"type":"C"};
	$.redirect("index/orderDetails",param,"_blank");
});
//付款  预绑定事件
$(page_id+" #J_BoughtTable").on("click",".myorder-pay-btn",function(){

	var order_sn = $(this).attr("order_sn");
	var order_id = $(this).attr("order_id");
	$("#order_sn").val(order_sn);
	$("#order_id").val(order_id);
	var payinfo = $.getStorage("payinfo");
	if(typeof payinfo != "undefined" && payinfo != ""){
		payinfo = JSON.parse(payinfo);
		$("#pay-id-no").val(payinfo.payer_id_card_no);
		$("#pay-name").val(payinfo.payer_name);
	}
	$("#layer-payer").show();

	// var order_sn = $(this).attr("order_sn");
	// var param = {"order_sn":order_sn};
	// $.redirect("index/Pay",param,"_blank");
});
//取消订单  预绑定事件
$(page_id+" #J_BoughtTable").on("click",".cancelorder",function(){
	var order_id = $(this).attr("order_id");
	cancelCOrder(order_id,$(this));
});
//确认收货  预绑定事件
$(page_id+" #J_BoughtTable").on("click",".confirm-goods",function(){
	var order_id = $(this).attr("order_id");
	closeCOrder(order_id,$(this));
});
getCOrderList(states.self_all);



//确认按钮
$("#save-pay-btn").on("click",function(){
	var order_sn = $("#order_sn").val();
	var payer_name = $("#pay-name").val();
	var payer_id_card_no = $("#pay-id-no").val();
	var c_order_id = $("#order_id").val();
	if($.string.isEmpty(payer_name)){
		layer.alert("请先填写身份真实姓名",{icon:6});
		return;
	}
	if($.string.isEmpty(payer_id_card_no)){
		layer.alert("请先填写身份号码",{icon:6});
		return;
	}
	if(!$.string.isCardID(payer_id_card_no)){
		layer.alert("身份证号码格式不正确或已失效！",{icon:6});
		return;
	}
	if(!$("#layer-check").is(":checked")){
		layer.alert("请先勾选同意《跨境电子商务零售进口商品申报委托》",{icon:6});
		return;
	}
	var payinfo = {
		"payer_id_card_no":payer_id_card_no,
		"payer_name":payer_name
	};
	$.setLocalStorage("payinfo",JSON.stringify(payinfo));
	setPayer(order_sn,c_order_id,payer_name,payer_id_card_no);
});

/** 设置订单支付人信息 **/
function setPayer(order_sn,c_order_id,payer_name,payer_id_card_no){
	var setPayerCall = function(results){
		if(results.code=="0X0000"){
			$(".layui-layer-close").trigger("click");
			$.redirect("index/Pay",{"order_sn":order_sn},"_blank");

		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.setPayer(setPayerCall,c_order_id,payer_name,payer_id_card_no);
}

//关闭弹窗
$(".layui-layer-close").on("click",function(){
	$("#pay-name").val("");
	$("#pay-id-no").val("");
	$("#order_sn").val("");
	$("#order_id").val("");
	$("#layer-check").prop("checked",false);
	$("#layer-payer").hide();
});