//页面级ID
var page_id = "#wareHouse"

var htService = $.htService;
//排序 DESC：倒叙  ASC：升序
var sortingVal = "DESC";

var sorting = $(page_id+" #sorting");

var filter = {
	page : 1,
	page_size : 30,
};
var keyword = "";

//搜索
$(page_id+" #search-btn").on("click",function(){
    var has_stock = $(page_id+" #has_stock").val();
    if(has_stock == 'lack'){
        $('#out-of-stock-div').show();
        $('#out-of-stock-btn').show();
        $('.quehuotable .out_of_stock').show();
        $('.quehuotable .have_stock').hide();
    }else{
        $('#out-of-stock-div').hide();
        $('#out-of-stock-btn').hide();
        $('.quehuotable .out_of_stock').hide();
        $('.quehuotable .have_stock').show();
    }
	getStockList(1,30);
});

//全选/反选
$(page_id+" .selectall").on("change",function(){
	if($(this).is(":checked")){
		$(page_id+" input[name=goods_id]").prop("checked",true);
		$(page_id+" .selectall").prop("checked",true);
	}else{
		$(page_id+" input[name]").prop("checked",false);
		$(page_id+" .selectall").prop("checked",false);
	}
	
});
//单选
$(page_id).on("change","input[name=goods_id]",function(){
	var isFlag = true;
	if($(this).is(':checked')){
		$(page_id+" input[name=goods_id]").each(function(k,v){
			if(!$(this).is(':checked')){
				isFlag = false
			}
		});
		if(isFlag){
			$(page_id+" .selectall").prop("checked",true);
		}else{
			$(page_id+" .selectall").prop("checked",false);
		}
	}else{
		$(page_id+" .selectall").prop("checked",false);
	}
})
//我的库存 排序
$(page_id+" #mystock").on("click",function(){

	if(sorting.hasClass("daosanjiao")){
		sortingVal = "ASC";//升序
		sorting.removeClass("daosanjiao");
	}else{
		sortingVal = "DESC";//倒叙
		sorting.addClass("daosanjiao");
	}
	getStockList(1,30);
});

//再次选购
$(page_id+" #add-to-cart-btn").on("click",function(){
	var goods_list  = new Array();
	var goods_input = $(page_id+" input[name=goods_id]:checked");
	if(goods_input.length==0){
		layer.msg("请先勾选商品！");
		return false;
	}
	$(page_id+" input[name=goods_id]:checked").each(function(k,v){
		//商品数量写死1
		var  goods = {"goods_id":$(this).val(),"quantity":$(this).attr("quantity")};
		goods_list[k] = goods;
	});
	$.cartService.batchAddCart(JSON.stringify(goods_list),"加入购物车成功!",function(){
		$.cartView.getListCart(0,99);
	});
});

//分页回调
var backCall = function(page,page_size){
	filter.page = parseInt(page);
	filter.page_size = parseInt(page_size);
	var offset = filter.page;
	var limit = filter.page_size;
	getStockList(offset,limit);
};
//获取微仓库存列表
function getStockList(offset,limit){
	keyword = $(page_id+" #keyword").val();
	var has_stock = $(page_id+" #has_stock").val();
	var is_include_purchase_no_pay = $('#out-of-stock-div #purchase_checkbox').is( ":checked" );
	var getStockList = function(results){
		if(results.code=="0X0000"){
			
			var data = results.data;
			var list = data.list;
			filter = data.filter;
			// if(data.length<=0||list.length<=0){
			// 	$(page_id+" #not-date").show();
			// 	$(page_id+" #add-to-cart").hide();
			// 	return;
			// }
			$(page_id+" #not-date").hide();
			$(page_id+" #add-to-cart").show();
			if(has_stock == 'lack'){
                updTableHtml4Lack(list);
			}else{
                updTableHtml(list);
            }
			$.page.htPage($(page_id+" #pager"),filter,backCall);
		}else if(results.code=="0X0010"){
			$(page_id+" #not-date").show();
			$(page_id+" #add-to-cart").hide();
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
    if(has_stock == 'lack'){
        htService.getLackStockList(getStockList,keyword,null,sortingVal,offset,limit,is_include_purchase_no_pay);
    }else{
        htService.getStockList(getStockList,keyword,"quantity",sortingVal,offset,limit,has_stock);
    }
}
//更新HTML
function updTableHtml(list){
	var strHtml = "";
	for(var i=0;i<list.length;i++){
		var goods = list[i];
		strHtml += '<tr class="order-td"><td class="tdright">'+
		    '<input type="checkbox" class="goods_id" name="goods_id" quantity="'+goods.min_sale_quantity+'" value="'+goods.goods_id+'">'+
		    '</td><td class="tdleft">'+
		    '<a class="pic" target="_blank" href="javascript:void(0);" style="position: relative;">'+
		    '<img class="img-responsive lazy goodsdetails"  data-sku="'+goods.sku+'"   data-original="'+goods.img_url+'" alt="'+goods.goods_name+'"></a>' +
			'<div class="desc">'+
		    '<a href="javascript:void(0);" goods-id="'+goods.goods_id+'" ' +
			'class="goodsdetails"  data-sku="'+goods.sku+'" '+
		    'title="'+goods.goods_name+'" target="_blank" >'+
		    goods.goods_name+'</a></div></td>'+
		    '<td class="tdcenter">'+goods.sku+'</td>'+
		    '<td class="tdcenter"><span>'+goods.quantity+'</span></td>'+
		    '<td class="tdcenter"><span>'+goods.available+'</span></td>'+
		    '<td class="tdcenter">'+goods.stock+'</td></tr>';
	}
	$(page_id+" #updTableHtml").html(strHtml);
	$.string.loadImage(page_id);
}

//更新HTML for Lack
function updTableHtml4Lack(list){
    var strHtml = "";
    for(var i=0;i<list.length;i++){
        var goods = list[i];
        strHtml += '<tr class="order-td"><td class="tdright">'+
            '<input type="checkbox" class="goods_id" name="goods_id" quantity="'+goods.min_sale_quantity+'" value="'+goods.goods_id+'">'+
            '</td><td class="tdleft">'+
            '<a class="pic" target="_blank" href="javascript:void(0);" style="position: relative;">'+
            '<img class="img-responsive lazy goodsdetails"  data-sku="'+goods.sku+'"   data-original="'+goods.img_url+'" alt="'+goods.goods_name+'"></a>' +
            '<div class="desc">'+
            '<a href="javascript:void(0);" goods-id="'+goods.goods_id+'" ' +
            'class="goodsdetails"  data-sku="'+goods.sku+'" '+
            'title="'+goods.goods_name+'" target="_blank" >'+
            goods.goods_name+'</a></div></td>'+
            '<td class="tdcenter">'+goods.sku+'</td>'+
            '<td class="tdcenter"><span>'+goods.available+'</span></td>'+
            '<td class="tdcenter"><span>'+goods.order_used+'</span></td>'+
            '<td data-val="'+goods.purchase_no_pay+'" class="tdcenter purchase_no_pay"><span>'+goods.purchase_no_pay+'</span></td>'+
            '<td class="tdcenter out_of_stock"><span>'+goods.out_of_stock+'</span></td>'+
            '<td class="tdcenter"><span>'+goods.stock+'</span></td>'+
            '<td class="tdcenter"><span>'+goods.need_quantity+'</span></td></tr>';
    }
    $("#out-of-stock-btn").show();
    $(page_id+" #updTableHtml").html(strHtml);
    $.string.loadImage(page_id);
}

//一键采购
$(page_id).on("click","#out-of-stock-btn",function(){
    var is_include_purchase_no_pay = 0;
    if($('#out-of-stock-div #purchase_checkbox').is( ":checked" )){
        is_include_purchase_no_pay = 1;
    }
    $.redirect("index/procurementList",{"is_include_purchase_no_pay":is_include_purchase_no_pay},"_blank");
});

// 是否包含采购单未付款
$('#out-of-stock-div #purchase_checkbox').click(function () {
    if($(this).is( ":checked" )){
        $('.quehuotable .purchase_no_pay').each(function () {
            var val = $(this).data('val'); // 采购单未付款占用
            var next_val = parseInt($(this).next().text()); // 缺货数量
            $(this).html(val);
            $(this).next().html(next_val + val);
        });
        $(page_id+" #search-btn").click();
    }else{
        $('.quehuotable .purchase_no_pay').each(function () {
            $(this).html(0);
            var val = $(this).data('val'); // 采购单未付款占用
            var out_of_stock_td = $(this).next();
            var next_val = parseInt(out_of_stock_td.text()); // 缺货数量
            var after_val = next_val - val;
            if(after_val > 0) {
                alert('程序错误');
            }else{
                out_of_stock_td.html(after_val);
            }
        });
        $(page_id+" #search-btn").click();
    }
});

getStockList(1,30);