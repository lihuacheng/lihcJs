//页面级ID
var page_id = "#shopping"

var htService = $.htService;

var goodsTable = $(page_id+" #goods-table");
//初始化第一页
var page = 1;
var page_size = 99;

//是不是B端用户
var isUserB = $.isUserB();


//一般贸易
var generalTrade = new Array();
var generalTradeIndex = 0;
//境外购
var overseasPurchase = new Array();
var overseasPurchaseIndex = 0;

var count_num = 0;

//标识首页 是否出现引导页
var ydy_bs = $.getStorage("shopping-ydy-bs");

$(".shopping-cover-zy3").height($("body").height());
$(".pull-right1").css({"position":"relative","z-index":"10002"});
if($.string.isNotEmpty(ydy_bs)){
    $(".shopping-cover-zy3,.shopping-center-zy3").hide();
}else{
	$(".shopping-cover-zy3,.shopping-center-zy3").show();
    $.setLocalStorage("shopping-ydy-bs","1");
    //删除遮罩层
    $(".shopping-cover-zy3,.shopping-center-zy3").click(function(){
        $(".shopping-cover-zy3,.shopping-center-zy3").hide();
    })
}


$(page_id+" .check-all").prop("checked",false);
$(page_id+" .sigle-iceck").prop("checked",false);

getListCart(page,page_size);
//获取购物车列表
function getListCart(page,page_size){
	var getListCartCall = function(results){
		if(results.code=="0X0000"){
			var data = results.data;
			var list = data.list;
			count_num = list.length;
			if(data==[]||list.length<=0){
				$(".goods-table,#cart-bar,.demo11").hide();
				$("#no-goods-data").show();

			}else{
				$("#no-goods-data").hide();
				$(".goods-table,#cart-bar").show();
				if(isUserB){
					$(page_id+" #b-btn-list,.demo11").show();
				}else{
					$(".demo11").hide();
					$(page_id+" #c-btn-list").show();
				}
			}
			
			var filter = data.filter;
			for(var i=0;i<list.length;i++){
				var item = list[i];
				//为1时  是一般贸易商品
				var isFlag = item.is_trade_sku=="1"?true:false;
				if(isFlag){
					generalTrade[generalTradeIndex] = item;
					generalTradeIndex++;
				}else{
					overseasPurchase[overseasPurchaseIndex] = item;
					overseasPurchaseIndex++;
				}
				
			}

			if(generalTrade.length==0){
				$("#trade").hide();
			}
			if(overseasPurchase.length==0){
				$("#purchase").hide();
			}
			if(overseasPurchaseIndex>0){
				upaCartHtml(overseasPurchase,overseasPurchaseIndex)
			}else if(overseasPurchaseIndex==0&&generalTradeIndex>0){
				upaCartHtml(generalTrade,generalTradeIndex)
				
			}
			
			++page;

			$(".shop-tab").on("click",function(){
				var type = $(this).attr("data-type");
				if(type=="purchase"){
					upaCartHtml(overseasPurchase,generalTradeIndex)
				}else if(type=="trade"){
					upaCartHtml(generalTrade,generalTradeIndex)
				}
				$(".shop-tab").removeClass("shoppingActiceA");
				$(this).addClass("shoppingActiceA");
			});
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.getListCart(getListCartCall,page,page_size);
}
//更新购物车HTML
function upaCartHtml(list,filter){
	var strHtml = "";
	$("#cart-num").html(count_num);
	for(var i=0;i<list.length;i++){
		var item = list[i];
		var price = parseFloat(item.price);
		var goods_number = parseInt(item.goods_number);
		var tatol_price = (price*goods_number).toFixed(2)
		
		strHtml += '<div data-goods-id="'+item.goods_id+'" class="clearfix goods-row">'+
            '<div class="col-xs-1 goods-td"><input name="cart_ids" value="'+item.goods_id+'" '+
            'class="iceck sigle-iceck" type="checkbox"></div>'+
            '<div class="col-xs-3 goods-td"><div class="left">'+
            '<a href="javascript:void(0);" class="goodsdetails" data-sku="'+item.sku+'" target="_blank">'+
            '<img class="img-responsive lazy" src="'+item.img_thumb+'" data-original="'+item.img_original+'" border="0" alt="'+item.goods_name+'">'+
            '</a></div><p class="right "><a href="javascript:void(0);" target="_blank">'+
            '</a><a href="javascript:void(0);" class="goods-name goodsdetails" data-sku="'+item.sku+'" href="javascript:void(0);" target="_blank">'+item.goods_name+'</a></p></div>'+
            '<div class="col-xs-1 goods-th">'+item.sku+'</div>'+
            '<div class="col-xs-1 goods-td"><span class="c9"></span></div>'+
            '<div class="col-xs-2 goods-td text-center">￥'+price.toFixed(2)+'<br><del>¥'+item.market_price+'</del></div>'+
            '<div class="col-xs-2 goods-td padding-left-50" data-type="goods_number">'+
            '<span class="goods_num_btn goods_cut" data-goods-id="'+item.goods_id+'">-</span>'+
            '<input type="text" name="goods_number" data-goods-id="'+item.goods_id+'" value="'+goods_number+'" maxlength="6" is_modulo="'+item.is_modulo+'"'+
            'class="number text-center" data-min="'+item.min_purchase_quantity+'" data-max="'+item.stock+'" data-number="'+goods_number+'">'+
            '<span class="goods_num_btn goods_add" data-goods-id="'+item.goods_id+'">+</span></div>'+
            '<div class="col-xs-1 goods-td"><span class="c-brand subtotal"><input type="hidden" name="tatolprice" value="'+tatol_price+'" />'+
            '￥<em class="cart-tatol-price" price="'+price.toFixed(2)+'" >'+tatol_price+'</em></span></div>'+
            '<div class="col-xs-1 goods-td text-center"><a class="del-goods" href="javascript:void(0);" data-goods-id="'+item.goods_id+'">删除</a>'+
            '<br><a class="collect-goods" data-goods-id="'+item.goods_id+'" href="javascript:void(0);" title="移入收藏夹">移入收藏夹</a></div></div></div>';
	}
	goodsTable.html(strHtml);

}
//商品数量 参数验证
goodsTable.on("afterpaste","input[name=goods_number]",function(){
	var val = $(this).val().replace(/\D/g,'');
	$(this).val(val);
});
goodsTable.on("keyup","input[name=goods_number]",function(){
	var val = $(this).val().replace(/\D/g,'');
	$(this).val(val);
});
//修改商品数量
goodsTable.on("blur","input[name=goods_number]",function(){
	var $this = $(this);
	//为空 设值为最小数量
	if($.string.isEmpty($this.val())){
		$this.val($this.attr("data-min"));
	}
	if(parseInt($this.val())<parseInt($this.attr("data-min"))){
		$this.val($this.attr("data-min"));
	}
	var goods_row = $this.closest(".goods-row");
	var goods_number = goods_row.find("input[name=goods_number]");
	var tatol = goods_row.find(".cart-tatol-price");
	var tatol_input = goods_row.find("input[name=tatolprice]");//隐藏文本域 更新商品总价格
	var goods_id = $this.attr("data-goods-id");
	var num = parseInt($this.val());//商品数量
	var is_modulo = goods_number.attr("is_modulo");//是否成倍增加
	var min_num = parseInt(goods_number.attr("data-min"));//最小数量
	var price = parseFloat(tatol.attr("price"));//商品单价
	if(is_modulo=="1"){
		if(num%min_num!=0){
			num = Math.floor(num/min_num)*min_num;
		}
	}
	var backCall = function(results){
		if(results.code!="0X0000"){
			num = parseInt(goods_number.attr("data-number"));
		}
		var tatol_price = (num*price).toFixed(2);
		tatol.html(tatol_price);
		tatol_input.val(tatol_price);
		goods_number.val(num);
		calculateOrderPrice();
	};
	$.cartService.setCart(goods_id,num,backCall);
});
//商品数量 +1
goodsTable.on("click",".goods_add",function(){
	var $this = $(this);
	var goods_row = $this.closest(".goods-row");
	var goods_number = goods_row.find("input[name=goods_number]");
	var tatol = goods_row.find(".cart-tatol-price");
	var tatol_input = goods_row.find("input[name=tatolprice]");//隐藏文本域 更新商品总价格
	var num = parseInt(goods_number.val());//当前数量
	var min_num = parseInt(goods_number.attr("data-min"));//最小数量
	var is_modulo = goods_number.attr("is_modulo");//是否成倍增加
	var price = parseFloat(tatol.attr("price"));//商品单价
	var tatolPrice = parseFloat(tatol_input.val());//商品总价
	var goods_id = $this.attr("data-goods-id");
	
	var backCall = function(results){
		if(results.code!="0X0000"){
			num = parseInt(goods_number.attr("data-number"));
		}else{
			if(is_modulo=="1"){
				num += min_num;
			}else{
				++num;
			}
		}
		goods_number.val(num);
		tatol.html((price*num).toFixed(2));
		tatol_input.val((price*num).toFixed(2));
		calculateOrderPrice();
	};
	$.cartService.addOne(goods_id,backCall,min_num);
});
//商品数量 -1
goodsTable.on("click",".goods_cut",function(){
	var $this = $(this);
	var goods_row = $this.closest(".goods-row");
	var goods_number = goods_row.find("input[name=goods_number]");
	var tatol = goods_row.find(".cart-tatol-price");
	var tatol_input = goods_row.find("input[name=tatolprice]");//隐藏文本域 更新商品总价格
	var min_num = parseInt(goods_number.attr("data-min"));//最小数量
	var is_modulo = goods_number.attr("is_modulo");//是否成倍增加
	var num = parseInt(goods_number.val());//当前数量
	var price = parseFloat(tatol.attr("price"));//商品单价
	var tatolPrice = parseFloat(tatol_input.val());//商品总价
	var goods_id = $this.attr("data-goods-id");
	if(num<=min_num){
		layer.tips("商品数量不能小于最少数量"+min_num,goods_number)
		return;
	}
	if(num<=0){
		layer.tips("商品数量不能为0",goods_number)
		return;
	}
	var goods_id = $this.attr("data-goods-id");
	if(is_modulo=="1"){
		num -= min_num;
	}else{
		--num;
	}
	var backCall = function(){
		
		goods_number.val(num);
		tatol.html((price*num).toFixed(2));
		tatol_input.val((price*num).toFixed(2));
		calculateOrderPrice();
	};
	$.cartService.delOne(goods_id,backCall,min_num);
})

//全选/反选
$(page_id).on("change",".check-all",function(){
	var iceck = $(page_id+" .sigle-iceck");
	if($(this).is(':checked')){
		iceck.prop("checked",true);
		$(page_id+" .check-all").prop("checked",true);
	}else{
		iceck.prop("checked",false);
		$(page_id+" .check-all").prop("checked",false);
	}
	calculateOrderPrice();
});
//单选
goodsTable.on("change",".iceck",function(){
	var check_all = $(page_id+" .check-all");
	var iceck = goodsTable.find(".iceck");
	var isFlag = true;
	if($(this).is(':checked')){
		iceck.each(function(k,v){
			if(!$(this).is(':checked')){
				isFlag = false
			}
		});
		if(isFlag){
			check_all.prop("checked",true);
		}else{
			check_all.prop("checked",false);
		}
	}else{
		check_all.prop("checked",false);
	}
	calculateOrderPrice();
});
//删除
goodsTable.on("click",".del-goods",function(){
	var $this = $(this);
	var goods_id = $this.attr("data-goods-id");
	//询问框
	layer.confirm('是否确定删除购物车该商品？', {
	  btn: ['确定','取消'] //按钮
	}, function(){
		var backCall = function(){
			//html列表删除该商品
			$this.closest(".goods-row").remove();
			if(goodsTable.find(".goods-row").length==0){
				$(".goods-table,#cart-bar,.demo11").hide();
				$("#no-goods-data").show();
			}else{
				$("#no-goods-data").hide();
				$(".goods-table,#cart-bar,.demo11").show();
			}
			//购物车数量
			$("#cart-num").text(count_num);
			calculateOrderPrice();
		};
		$.cartService.delCart(goods_id,"",backCall);
	}, function(){
	  
	});
	
});

//删除选中
$(page_id+" #del-more").on("click",function(){
	var goods_id = "";
	$(page_id+" input[name=cart_ids]:checked").each(function(k,v){
		if(k!=0){
			goods_id += ",";
		}
		goods_id += $(this).val();
	});
	if($.string.isEmpty(goods_id)){
		layer.msg("请选勾选商品！");
		return;
	}
	var delCartCall = function(){
		$(page_id+" input[name=cart_ids]:checked").closest(".goods-row").remove();
		$(page_id+" .check-all").prop("checked",false);
		//购物车数量
		var product = goodsTable.find(".sigle-iceck").size();
		$("#cart-num").text(count_num);
		calculateOrderPrice();
	};
	$.cartService.delCart(goods_id,"删除商品成功！",delCartCall);
});
//移入收藏夹
goodsTable.on("click",".collect-goods",function(){
	var goods_id = $(this).attr("data-goods-id");
	var setSelfCollectGoodsCall = function(results){
		layer.msg(results.message,{icon:6});
	};
	htService.setSelfCollectGoods(setSelfCollectGoodsCall,goods_id);
});
//结算or立即购买or立即采购
$(page_id).on("click","#settlement-btn,#buy-now-btn,#purchase-btn",function(){
	var goods_input = goodsTable.find("input[name=cart_ids]:checked");
	var id = $(this).attr("id");
	//购买类型
	var type;//type: 1-C端结算 or B端立即购买  0:B端立即采购
	if(goods_input.length==0){
		layer.msg("请先勾选商品！");
		return;
	}
	switch(id){
		case "settlement-btn":
			//结算
			type = "1";
			break;
		case "buy-now-btn":
			//立即购买
			type = "1";
			break;
		case "purchase-btn":
			//立即采购
			type = "0";
			break;
		default: type="0";
	}
	var param = new Array();
	goods_input.each(function(k,v){
		var goods_number_input = $(this).closest(".goods-row").find("input[name=goods_number]");
		var goods_id = $(this).val();
		var goods_number = goods_number_input.val();
		var goods = {"goods_id":goods_id,"quantity":goods_number};
		param[k] = goods;
	});
	//使用Base64加密
	var baseStr = $.Base64.encode(JSON.stringify(param));
	$.redirect("index/settlement",{"product-list":baseStr,"type":type});
});
//计算选中商品总价之和
function calculateOrderPrice(){
	//选中的商品
	var checkProduct = goodsTable.find(".sigle-iceck:checked");
	var order_tatol = 0.00;
	checkProduct.each(function(k,v){
		//获取隐藏文本域中的商品总价
		var product_tatol = $(this).closest(".goods-row").find("input[name=tatolprice]").val();
		order_tatol += parseFloat(product_tatol);
	});
	$(page_id+" #J_SelectedItemsCount").html(checkProduct.length);
	$(page_id+" #subtotal_2").html("¥"+order_tatol.toFixed(2));
}
