//页面级ID
var page_id = "#purchaseOrder"

var htService = $.htService;

var nav = $(page_id+" #J_navbar .redline");

var J_BoughtTable = $(page_id+" #J_BoughtTable");

//初始化分页数据
var filter = {
	page : 1,
	page_size : 10,
};

var states = {
	self_all : "PURCHASE_ORDER_STATUS_ALL",//所有订单
	self_need_pay : "PURCHASE_ORDER_STATUS_CREATE",//未付款
	shipped : "PURCHASE_ORDER_STATUS_PAID",//已付款
	cancel : "PURCHASE_ORDER_STATUS_CANCELLED",//已取消
	failure : "PURCHASE_ORDER_STATUS_ABORTED "//已失效
};
var checkState = states.self_all;

var backCall = function(page,page_size){
	filter.page = parseInt(page);
	filter.page_size = parseInt(page_size);
	var offset = (filter.page-1);//*filter.page_size
	var limit = filter.page_size;
	getPurchaseOrderList(checkState,offset,limit);
};
getPurchaseOrderList(states.self_all);

//订单搜索
$(page_id+" .search-btn").on("click",function(){
	var keyword = $(page_id+" #keyword").val();
	if($.string.isEmpty(keyword)){
		layer.tips("订单号不能为空！",$(page_id+" #keyword"));
		return;
	}
	getPurchaseOrder(keyword);
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
	getPurchaseOrderList(checkState);
});
//订单详情 预绑定事件
J_BoughtTable.on("click",".detail-link",function(){
	var order_id = $(this).attr("order_id");
	var param = {"order_id":order_id,"type":"P"};
	$.redirect("index/OrderDetails",param,"_blank");
});
//取消订单 预绑定事件
J_BoughtTable.on("click",".cancelorder",function(){
	var $this = $(this);
	var order_id = $this.attr("order_id");
	var cancelPurchaseOrderCall = function(results){
		if(results.code=="0X0000"){
			var $tbody = $this.closest("tbody");
			$tbody.find(".status").html("已取消");
			$tbody.find(".trade-operate").html("");
			getPurchaseOrderCount();
			layer.alert("取消成功!");
		}else{
			layer.alert(results.message,{icon:6});
		}
	}
	htService.cancelPurchaseOrder(cancelPurchaseOrderCall,order_id);
});
//付款  预绑定事件
J_BoughtTable.on("click",".purchaseorder-pay-btn",function(){
	var order_sn = $(this).attr("order_sn");
	var param = {"order_sn":order_sn};
	$.redirect("index/Pay",param,"_blank");
});


//获取B端 订单数据
function getPurchaseOrderList(state,offset,limit){
	if(!offset){
		offset = 0;
	}
	if(!limit){
		limit = 10;
	}
	// var keyword = $(page_id+" #keyword").val();
	var getPurchaseOrderListCall = function(results){
		if(results.code=="0X0000"){
			var data = results.data;
			filter = data.filter;
			var list = data.list;
			updTableHtml(list);
			$.page.htPage($(page_id+" #pager"),filter,backCall);
			if(list.length==0){
				$(page_id+" #pager").hide();
				$(page_id+" #not-date").show();
			}else{
				$(page_id+" #pager").show();
				$(page_id+" #not-date").hide();
			}
			//获取不同类型订单的总数
			getPurchaseOrderCount();
		}else{
			layer.alert(results.message,{icon:6});
		}
		
	};
	htService.getPurchaseOrderList(getPurchaseOrderListCall,"","",offset,limit,checkState,"1");
}
//获取符合条件的采购单总数
function getPurchaseOrderCount(){
	var getPurchaseOrderCountCall = function(results){
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
	}
	htService.getPurchaseOrderCount(getPurchaseOrderCountCall,states.self_all);
}
//获取指定的采购单
function getPurchaseOrder(purchase_order_id){
	var getPurchaseOrderCall = function(results){
		if(results.code=="0X0000"){
			var list = [results.data];
			updTableHtml(list);
			$(page_id+" #pager").hide();
		}else{
			layer.alert(results.message,{icon:6},function () {
				$.redirect('index/home');
			});
		}
	};
	htService.getPurchaseOrder(getPurchaseOrderCall,purchase_order_id,1);
}


function updTableHtml(list){
	var productHtml = "";
	for(var n=0;n<list.length;n++){
		var product = list[n];
		var order_status = product.order_status;
		var statusName = $.valida.purchaseOrderStatus(order_status);
		var check_status_message = typeof product.check_status_message == 'undefined'?"":product.check_status_message;
		var pay_expire_flag = product.pay_expire_flag;
    	if(parseInt(pay_expire_flag)==0){
    		statusName = "超时订单";
    	}
		productHtml += '<tbody class="combo-order close-order xcard combo-order-success" name="data">'+
            '<tr class="sep-row"><td colspan="7"></td></tr>'+
            '<tr class="order-hd"><td class="first" colspan="5">'+
            '<div class="summary"><span class="number">订单号：<em>'+product.purchase_order_sn+'</em>'+
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
            goodsHtml += '<tr class="order-bd"><td class="baobei baobei1">'+
                '<a title="查看宝贝详情" href="javascript:void(0);" '+
                'class="pic goodsdetails" data-sku="'+item.sku+'" style="position: relative;">'+
                '<img class="img-responsive lazy" src="'+item.img_thumb+'" '+
                'data-original="'+item.img_original+'" '+
                'alt="查看宝贝详情" style="display: block;"></a>'+
                '<div class="desc"><p class="baobei-name">'+
                '<a href="javascript:void(0);" class="J_MakePoint goodsdetails" data-sku="'+item.sku+'">'+item.goods_name+'</a></p>'+
                '<div class="spec" title=""><span></span></div></div></td>'+
                '<td class="item-operate"><div>'+item.sku+'</div></td>'+
                '<td class="price"><em class="origin-price special-num">'+parseFloat(item.market_price).toFixed(2)+'</em>'+
                '<br><em class="special-num">'+parseFloat(item.price).toFixed(2)+'</em></td>'+
                '<td class="quantity quantity1"><em class="special-num">'+item.quantity+'</em></td>';
                if(i==0){
                	goodsHtml += '<td class="trade-status td-last " rowspan="'+goods.length+'">'+
	                    '<em class="special-num">'+parseFloat(product.order_amount).toFixed(2)+'</em></td>'+
	                    '<td class="trade-status td-last" rowspan="'+goods.length+'">'+
	                    '<div><a href="javascript:void(0);" order_id="'+product.purchase_order_id+'" '+
	                    'target="_blank" class="J_MakePoint status">'+statusName+check_status_message+'</a></div>'+
	                    '<div><a href="javascript:void(0);" order_id="'+product.purchase_order_sn+'" '+
	                    'class="detail-link J_MakePoint">订单详情</a></div></td>'+
	                    '<td class="trade-operate td-last" rowspan="'+goods.length+'">';
	                
	                if(order_status==states.self_need_pay){
	                	if(parseInt(pay_expire_flag)==1){
	                		goodsHtml += '<input class="btn btn-primary zhifubao-btn purchaseorder-pay-btn" order_sn="'+product.purchase_order_sn+'"  type="button" value="付款" >'+
								'<div style="margin-top:4px;"><a href="javascript:void(0);" '+
								'order_id="'+product.purchase_order_id+'" class="cancelorder">取消订单</a></div>';
						}else{
							goodsHtml +='<div style="margin-top:4px;"><a href="javascript:void(0);" '+
								'order_id="'+product.c_order_id+'" >无效订单</a></div>';
						}
	                }else if(order_status==states.shipped){
	                	goodsHtml += '<div>已完成</div>';
	                }   
	                goodsHtml += '</td>';
                }
                goodsHtml += '</tr>';
                
        }
        productHtml += goodsHtml;
        productHtml += '</tbody>';
	}
	J_BoughtTable.html(productHtml);
}