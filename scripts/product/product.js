var htService = $.htService;
//分页初始化参数
var filter = JSON.parse($("#filter").val());
//分页DIV
var pager = $("#pager");
//品牌list
var brand_list = $("#brand-list .brand");
//综合排序
var sorts = $(".sorts .sort .zh");
//价格排序
var price_list = $("#price-list .sort a");
//最低价格
var min_price = $('input[name="min_price"]');
//最高价格
var max_price = $('input[name="max_price"]');
//分类ID
var category = $("input[name=category]");
//关键字
var keyword = $("input[name=keyword]");
//分页回调
var backCall = function (page, page_size) {
    var param = getParam();
    filter.page = param.page = page;
    filter.page_size = param.page_size = page_size;
    searchGoods(param);
};
$.page.htPage(pager, filter, backCall);

//品牌选择
brand_list.on("click", function () {
    brand_list.removeClass("cur");
    $(this).addClass("cur");
    var param = getParam();
    searchGoods(param);
});
//价格选择
price_list.on("click", function () {
    sorts.removeClass("active");
    var order_type = $(this).attr("order-type");
    $("#sort_price").addClass("active").attr("order-type", order_type);
    var text = $(this).html();
    $("#sort_price").find("#sort_price_text").show().html(text);
    var param = getParam();
    searchGoods(param);
});
//综合排序选择
sorts.on("click", function () {
    sorts.find("span").hide();
    $(this).find("span").show()
    sorts.removeClass("active").attr("order-type", "ASC");
    $(this).addClass("active").attr("order-type", "DESC");
    ;
    $("#sort_price").find("#sort_price_text").show().html("价格");
    var param = getParam();
    searchGoods(param);
});
//价格 确定
$('#price_btn').click(function () {
    var min_price_val = min_price.val();
    var max_price_val = max_price.val();
    var temp = 0;
    min_price_val = parseInt(min_price_val) == '' ? 0 : parseInt(min_price_val);
    max_price_val = parseInt(max_price_val) == '' ? 0 : parseInt(max_price_val);
    if (min_price_val > max_price_val) {
        layer.tips("最大价格必须大于最小价格:" + min_price_val, max_price);
        return;
    }
    var param = getParam();
    searchGoods(param);
});
$('#checkB1').prop("checked",false);
//是否显示有货
$('#checkB1').change(function(){
	var param = getParam();
    searchGoods(param);
});
// //去商品详情
// $("body").on("click", ".to-detail", function () {
//     var sku = $(this).attr("sku");
//     $.redirect("Index/details", {"sku": sku},"_blank");
// });
//获取参数
function getParam() {
    var param = {}
    param.page = 1;
    param.page_size = 24;
    var brand_id = $("#brand-list").find('.cur').attr("brand-id");
    if (brand_id != "all") {
        param.brand_id = brand_id;
    }
    // param.is_best;
    // param.is_new;
    // param.is_hot;
    // param.has_stock;
    var zh = $(".sorts .sort").find(".active");
    var order_by = zh.attr("data-type");
    if (order_by != "all") {
        param.order_by = order_by;
        param.order_by_dir = zh.attr("order-type");
    }
    var keywordVal = keyword.val();
    var categoryVal = category.val();
    var min_priceVal = min_price.val();
    var max_priceVal = max_price.val();
    var goods_id_inVal = $.getQueryString("goods_id_in");
    param.has_stock = $('#checkB1').is(":checked")?1:0;
    if ($.string.isNotEmpty(keywordVal)) {
        param.keyword = keywordVal;
    }
    if ($.string.isNotEmpty(categoryVal)) {
        param.category_id = categoryVal;
    }
    if ($.string.isNotEmpty(min_priceVal)) {
        param.min_price = min_priceVal;
    }
    if ($.string.isNotEmpty(max_priceVal)) {
        param.max_price = max_priceVal;
    }
    if ($.string.isNotEmpty(goods_id_inVal)) {
        param.goods_id_in = goods_id_inVal;
    }
    return param;
}
//查询商品
function searchGoods(param) {
    var searchGoodsCall = function (results) {
        if (results.code == "0X0000") {
            var data = results.data;
            var list = data.list;
            filter = data.filter;
            updProductHtml(list, filter);
            $.page.htPage(pager, filter, backCall);
        } else {
            layer.alert(results.message, {icon: 6});
        }
    };
    htService.searchGoods(searchGoodsCall, param);
}
//更新商品列表HTML
function updProductHtml(list, filter) {
    var strHtml = "";
    if (list.length == 0) {
        $("#product-sreach-name").html(keyword.val());
        $("#product-list-div").hide();
        $("#product-no-data").show();
        return;
    }
    $("#record_count").html(list.length);
    $(".c-brand").html(filter.page);
    $(".c-count").html(filter.page_count);
    $("#product-no-data").hide();
    $("#product-list-div").show();
    var yiqiangguang = $("#yiqiangguang").val();
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        strHtml += '<div class="homewrap1">';
        if (item.has_stock != "1") {
            strHtml += '<div class="yiqiangguang1";><img src="'+ yiqiangguang + '" /></div>';
        }
        strHtml +=
            '<a class="to-detail goodsdetails" href="javascript:void(0);" data-sku="' + item.goods_sn + '" ">' +
                '<div class="wrap_1">' +
                    '<img class="lazy" src="/Public/images/lazy_home.png" data-original="' + item.img_original + '">' +
                '</div>' +
            '<div class="wrap_2">' +
                 '<p>'+ item.goods_name + '</p>' +
            '</div>'+
            '<div class="wrap_33">' +
                 '<span>¥' + item.price + '</span>' +
                 '<span><del>¥' + item.market_price+ '</del></span>' ;
                if(item.price != item.single_price){
                    strHtml += '<span class="wrapDj">单件¥'+item.single_price+'</span>';
                }
        strHtml += '</div>'; 
        if( item.extension.length>0){
            strHtml +=' <div class="homewrap2">'+
                '<a href="javascript:void(0);" data-sku="' + item.goods_sn + '" class="goodsdetails"> <div class="homewrap21">'+item.goods_name+'</div></a>'+
                '<ul class="homewrap22">';
            for (var j = 0; j < item.extension.length; j++) {
                var item1  =item.extension[j];
                strHtml += '<a href="javascript:void(0);" data-sku="' + item1.sku + '" target="_blank" class="goodsdetails"><li ><span>'+item1.attribute+'</span><span class="homewrap221">¥'+item1.single_price+'/件 </span></li></a>';
            }
            strHtml +='</ul>'+
                '</div>';
        }
        strHtml+='</a></div> ';
    }
    $("#product-list-div").html(strHtml);
    //商品图片延迟加载
    $("img.lazy").lazyload({effect: "fadeIn"});
}
/**  侧栏翻页 start**/
var disabled = "disabled";
var page = parseInt($(".c-brand").html());
var count = parseInt($(".c-count").html());
if(page==count){
    $(".next").addClass(disabled);
}
//侧栏 上一页
$(".prev").on("click",function(){
    pager.find("#page-prev").trigger("click");
    var page = parseInt($(".c-brand").html());
    var count = parseInt($(".c-count").html());
    if(page==1){
        $(this).addClass(disabled);
    }
});
//侧栏 下一页
$(".next").on("click",function(){
    pager.find("#page-next").trigger("click");
    var page = parseInt($(".c-brand").html());
    var count = parseInt($(".c-count").html());
    if(page<count){
        $(".prev").removeClass(disabled);
    }
    if(page==count){
        $(this).addClass(disabled);
    }else{
        $(this).removeClass(disabled);
    }
});
/**  侧栏翻页 end**/

//商品图片延迟加载
$("img.lazy").lazyload({effect: "fadeIn"});

$("#J_expandBtn").on("click",function(){
    $("dd#brand-dd").addClass("brand-dd");
    $(this).hide();
});