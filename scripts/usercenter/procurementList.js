//一键采购功能列表
function quickPurchaseOrderList(){
    var is_include_purchase_no_pay = $.getQueryString("is_include_purchase_no_pay");
    var quickPurchaseOrderCall = function(results){
        if(results.code=="0X0000"){
            var strHtml = '';
            var list = results.data;
            for(var i=0;i<list.length;i++){
                var goods = list[i];
                var goods_data = $.Base64.encode(JSON.stringify({"goods_id":goods.goods_id,"quantity":goods.real_need_quantity}));
                var sale_orders = goods.sale_orders;
                sale_orders = sale_orders.split(",");
                var saleHtml = hidden_li = disabled_input = checked = '';
                for(var sale_order in sale_orders){
                    saleHtml += '<span>'+sale_orders[sale_order]+'</span>';
                }
                if(parseInt(goods.is_buy)==0){
                    hidden_li = ' hidden-li';
                    disabled_input = ' disabled="true" ';
                }else{
                    hidden_li = ' no-hidden-li';
                    checked = ' checked="true" '
                }
                strHtml += '<li class="clearfix'+hidden_li+'">\
                <div class="col-xs-1 check"><div class="icheckbox_minimal-aero">\
                <input class="iceck single-select" '+checked+' goods_data="'+goods_data+'" '+disabled_input+' type="checkbox"">\
                </div></div>\
                <div class="col-xs-2 sku">'+goods.sku+'</div>\
                <div class="col-xs-3 name">'+goods.goods_name+'</div>\
                <div class="col-xs-2 orders-list"><div class="orders-list-inner">'+saleHtml+'</div></div>\
                <div class="stock col-xs-1"><span class="c-brand">'+goods.mw_available_stock+'</span></div>\
                <div class="differ col-xs-1">'+goods.need_quantity+'</div>\
                <div class="differ col-xs-1">'+goods.real_need_quantity+'</div>\
                <div class="col-xs-1">'+goods.yks_stock+'</div></li>';
            }
            $("#purchaseList").html(strHtml);
            $("#sale-content").hide();
            $("#order-modal").show();
            onePurchaseList();
        }else{
            layer.alert(results.message,{icon:6});
        }
    };
    htService.quickPurchaseOrder(quickPurchaseOrderCall,is_include_purchase_no_pay);
}

quickPurchaseOrderList();
	//一键采购功能列表
function onePurchaseList(){
	//全选、反选
	$(".selectAll").on("change",function(){
		if($(this).is(":checked")){
			$("#purchaseList").find(".no-hidden-li input[type=checkbox]").prop("checked",true);
			$(".selectAll").prop("checked",true);
		}else{
			$("#purchaseList").find(".no-hidden-li input[type=checkbox]").prop("checked",false);
			$(".selectAll").prop("checked",false);
		}
	});
	//单选
	$(".single-select").on("change",function(){
		var isFlag = true;
		var check_goods = $("#purchaseList").find(".no-hidden-li input[type=checkbox]");
		check_goods.each(function(){
			if(!$(this).is(":checked")){
				isFlag = false;
			}
		});
		$(".selectAll").prop("checked",isFlag);
	});
	//加入购物车
	$("#add-cart").on("click",function(){
		//询问框
		layer.confirm('一键采购功能会将商品数据加到到购物车，为减少多余商品影响，建议您先清空购物车！', {
		  btn: ['继续采购','去购物车'] //按钮
		}, function(){
			var check_goods = $("#purchaseList").find(".no-hidden-li input[type=checkbox]:checked");
			var goods_list = new Array();
			check_goods.each(function(k,v){
				goods_list[k] = JSON.parse($.Base64.decode($(this).attr("goods_data")));
			});
			var batchAddCartCall = function(results){
				if(results.code=="0X0000"){
					layer.confirm('采购成功,是否去购物车！',{btn:['马上去','返回']},function(){
						 $.redirect("index/shopping",{},"_blank");
					},function(){
						layer.closeAll();
					});
				}else{
					layer.alert(results.message,{icon:6});
				}
			};
			htService.batchAddCart(batchAddCartCall,JSON.stringify(goods_list));
		}, function(){
		  $.redirect("index/shopping",{},"_blank");
		});
	});
	//取消
	$("#cancel-cart").on("click",function(){
		$("#order-modal").hide();
		$("#sale-content").show();
	});
	
}