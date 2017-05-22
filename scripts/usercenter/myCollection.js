//页面级ID
var page_id = "#myCollection"
var operation = $.config.cart.operation;
var htService = $.htService;
var filter = {
	page : 1,
	page_size : 12
};


//获取消息列表
function getCollectGoodsList(page,page_size){
	var getCollectGoodsListCall = function(results){
		console.log(results);
		if(results.code=="0X0000"){
			var data = results.data;
			filter = data.filter;
			var list = data.list;
			if(list.length){
				updTableHtml(list,filter.record_count);
			}else {
				$(page_id+" #product-list").hide();
				$(page_id+" #not-data").show();
			}
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.getCollectGoodsList(getCollectGoodsListCall,page,page_size);
}
var backCall = function(page,page_size){
	filter.page = page;
	filter.page_size = page_size;
	getCollectGoodsList(filter.page,filter.page_size);
};
//更新页面列表
function updTableHtml(list,record_count){
	$(page_id+" #record_count").html(record_count);
	$(page_id+" #product-list").show();
	$(page_id+" #not-data").hide();
	var strHtml = "";
	for(var i=0;i<list.length;i++){
		var item = list[i];
		strHtml += '<div class="div-border div-box">'+
			'<div class="buy-box" style="display: none;">'+
            '<button class="addcart" goods-id="'+item.goods_id+'" min="'+item.min_sale_quantity+'"> 加入购物车 </button>'+
            '<button class="buynow " goods-id="'+item.goods_id+'" min="'+item.min_sale_quantity+'"> 删除商品 </button></div>'+
            '<div class="wrap_1 wrap_cool_div">' +
			'<a href="javascript:void(0);" class="goodsdetails" data-sku="'+item.sku+'">'+
			'<img src="'+item.img_original+'"></a></div>'+
            '<a href="javascript:void(0);" class="goodsdetails" '+
			' data-sku="'+item.sku+'"><div class="wrap_2 div-hidden wrap_cool_div_2"><p title="'+item.goods_name+'">'+item.goods_name+'</p></div></a>'+
            '<div class="wrap_33"><span>￥'+item.market_price+'</span><span>￥'+item.price+'</span></div></div>';
	}
	$(page_id+" #product-div").html(strHtml);
	$.page.htPage($(page_id+" #pager"),filter,backCall);
}
//预绑定事件  加入购物车
$(page_id+" #product-list").on("click",".addcart",function(){
	var goods_id = $(this).attr("goods-id");
	var min = $(this).attr("min");
	//回调渲染头部购物车
	var backCall = function(){
		$.cartView.getListCart();
		layer.alert("加入购物车成功！",{icon:6});
	};
	$.cartService.addCart(goods_id,min,backCall);
});

//预绑定事件  删除商品
$(page_id+" #product-list").on("click",".buynow",function(results){
	var goods_id = $(this).attr("goods-id");
	var delSelfCollectGoodsCall = function(results){
		if(results.code=="0X0000"){
			getCollectGoodsList(filter.page,filter.page_size);
			layer.alert("删除收藏成功");
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.delSelfCollectGoods(delSelfCollectGoodsCall,goods_id);
});


getCollectGoodsList(filter.page,filter.page_size);