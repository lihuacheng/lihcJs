//商品信息
var goods_info = $.goods_info;
//不同规格的SKU商品
var extension = goods_info.extension;

var htService = $.htService;
//B端用户才显示 微仓库存
if($.isUserB()){
	$("#mv_stock_span").show()
}
$(".attribute").on("click",function(){
	$(".attribute").removeClass("active");
	$(this).addClass("active");
	//获取不同规格的 GOODS_ID
	var goods_id = $(this).attr("data-id");
	if(extension.length){
		for(var i=0;i<extension.length;i++){
			var goods = extension[i];
			//验证数据 是返回的一个正确的  单个json对象
			if(goods instanceof Array || goods=="" ||typeof goods == "null"){
				layer.alert("商品数据不存在！");
				return;
			}
			if(goods.goods_id == goods_id){
				updProductHtml(goods)
				break;
			}
		}
		$(".dl-sale").show();
	}else {
		$(".dl-sale").hide();
	}
});
//数量-1
$(".goods_cut").on("click",function(){
	var val = $("#number").val();
	var min = $("#number").attr("data-min");
	var is_modulo = $("#number").attr("is_modulo");
	if(val==0||val<min){
		layer.tips("最小起购量："+min+"",$("#number"));
		return;
	}
	if($.string.isEmpty(val)){
		$("#number").val(min);
		layer.tips("最小起购量："+min+",",$("#number"));
		return;
	}
	if(val==min){
		layer.tips("最小起购量："+min+"",$("#number"));
		return;
	}
	//是否成倍减少
	if(is_modulo=="1"){
		$("#number").val(parseInt(val)-parseInt(min));
	}else{
		$("#number").val(parseInt(val)-1);
	}
	
});
//数量+1
$(".goods_add").on("click",function(){
	var val = $("#number").val();
	var min = $("#number").attr("data-min");
	var is_modulo = $("#number").attr("is_modulo");
	var stock_num = $("#stock-num").html();
	var stock_num = $("#stock-num").html();
	if(parseInt(min)>parseInt(stock_num)){
		$("#number").val(min);
		layer.tips("库存量不足",$("#number"));
		return;
	}
	if($.string.isEmpty(val)){
		$("#number").val(min);
		return;
	}
	//最大数量不能超过库存
	if(parseInt(val)>=parseInt(stock_num)){
		$("#number").val(stock_num);
		layer.tips("不能超过库存量",$("#number"));
		return;
	}
	//是否成倍增加
	if(is_modulo=="1"){
		$("#number").val(parseInt(val)+parseInt(min));
	}else{
		$("#number").val(parseInt(val)+1);
	}
});
//数量文本框 验证
$("#number").on("blur",function(){
	var val = $(this).val();
	var min = $("#number").attr("data-min");
	var is_modulo = $("#number").attr("is_modulo");
	var stock_num = $("#stock-num").html();
	if(parseInt(min)>parseInt(stock_num)){
		$("#number").val(min);
		layer.tips("库存量不足",$("#number"));
		return;
	}
	if($.string.isEmpty(val)){
		$("#number").val(min);
		return;
	}
	if(parseInt(val)<parseInt(min)){
		$("#number").val(min);
		return;
	}
	//最大数量不能超过库存
	if(parseInt(val)>parseInt(stock_num)){
		$("#number").val(stock_num);
		layer.tips("不能超过库存量",$("#number"));
		return;
	}
	if(is_modulo=="1"&&(parseInt(val)%parseInt(min))!=0){
		val = Math.floor(parseInt(val)/parseInt(min))*parseInt(min);
		$(this).val(val)
	}
});
//缺货登记
$(".want-book").on("click",function(){
	htService.getLastSkuArrivalEmail(function(results){
		if(results.code!="0X0000"){
			layer.alert(results.message,{icon:6});
			return;
		}
		var data = results.data;
		var email = data.email;
		var strHtml = '<div class="layer-open-html">该货品暂时缺货，请在下面输入您的E-mail地址，当我们有现货供应时，我们会发送邮件通知您！</div>\
		  <div class="layer-open-html"><p>您的邮箱：</p><p><input type="text" class="layer-open-text" value="'+email+'"/></p></div>\
		  <div class="layer-open-html"><button class="btn btns btn-primary layer-open-btn">提交</button></div>';
		//页面层
		layer.open({
		  type: 1,
		  title:"缺货登记",
		  skin: 'layui-layer-rim', //加上边框
		  area: ['420px', '240px'], //宽高
		  content: strHtml
		});
	});
	
});
//缺货登记 提交邮箱 预绑定事件
$("body").on("click",".layer-open-btn",function(){
	var sku = $("#sku").html();
	var emali = $(".layer-open-text").val();
	if($.string.isEmpty(emali)){
		layer.tips("邮箱不能为空！",$(".layer-open-text"));
		return;
	}
	htService.arrivalNotify(function(results){
		if(results.code=="0X0000"){
			layer.msg("提交缺货登记成功！");
		}else{
			layer.msg(results.message);
		}
	},emali,sku);
})
//加入购物车
$(".add-cart").on("click",function(){
	var val = $(this).val();
	var min = $("#number").attr("data-min");
	var stock_num = $("#stock-num").html();
	if(parseInt(min)>parseInt(stock_num)){
		$("#number").val(min);
		layer.tips("库存量不足",$("#number"));
		return;
	}
	//最大数量不能超过库存
	if(parseInt(val)>parseInt(stock_num)){
		$("#number").val(stock_num);
		layer.tips("不能超过库存量",$("#number"));
		return;
	}
	var goods_id = $("#check-goods-id").val();
	var number = $("#number").val();
	
		//询问框
		layer.confirm('　　　　　　　　　　　　　　　　　<b>消费者告知书</b></br>尊敬的客户：</br>　　您好！在您选购境外商品前，麻烦您仔细阅读此文，同意本文所告知内容后再进行下单购买：</br>1、 您在本（公司）网站上购买的境外商品等同于原产地直接购买，从保税区或境外直接发出，仅 　　限个人自用不得进行销售，商品本身无中文标签，您可以查看网站的翻译或在线联系我们的客 　　服。</br>2、 您购买的境外商品适用的品质、健康、安全、卫生、环保、标识等项目适用标准与我国质量 　　　安全标准不同，可能不符合我国《食品安全法》的标准，所以在使用过程中由此可能产生的危　　　害或损失以及其他风险，将由您个人承担。</br>3、 单个包裹金额超2000元的，订购人不等于支付人，不能通过海关的审核。</br>　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　   海豚供应链', {
		  btn: ['我清楚 , 去购物车结算','取消'], //按钮
		  area: ['698px', '426px'], //宽高
		}, function(){
			var backCall = function(){
		  		//$.cartView.getListCart(0,99);
				$.redirect("Index/shopping");
			};
			$.cartService.addCart(goods_id,number,backCall,false);
		}, function(){
		});
	

});
$("#collect").on("click",function(){
	var goods_id = $("#check-goods-id").val();
	$.addSelfCollectGoods(goods_id);
});
//更新商品数据HTML
function updProductHtml(goods){
	var gallery = goods.gallery;
	var price_spread = (parseFloat(goods.market_price)-parseFloat(goods.price)).toFixed(2);
	//海豚价
	$("#ht_price").html(goods.price);
	//商品名称
	$("#goods_name").html(goods.goods_name);
	//单件价格
	$("#item_price").html(goods.single_price);
	//市场价
	$("#market_price").html(goods.market_price);
	//省 多少钱
	$("#price_spread").html(price_spread);
	//商品编号
	$("#sku").html(goods.sku);
	//贸易方式
	$("#business_type_name").html(goods.business_type_name);
	//数量
	$("#number").val(goods.min_purchase_quantity);
	//最小采购数量	
	$("#number").attr("data-min",goods.min_purchase_quantity);
	//是否成倍增加
	$("#number").attr("is_modulo",goods.is_modulo);
	//库存
	$("#stock-num").html(goods.stock);
	if(parseInt(goods.stock)>0){
		$(".add-cart").removeClass("disabled");
		$(".want-book").hide();
		$("#outstock").hide();
		$("#stock").show();
	}else{
		$(".add-cart").addClass("disabled");
		$(".want-book").show();
		$("#stock").hide();
		$("#outstock").show();
	}
	if(goods.price != goods.single_price ){
		$(".title-num3").show();
	}else {
		$(".title-num3").hide();
	}
	if(parseInt(goods.is_deleted)==1||parseInt(goods.is_on_sale)==0){
		$("#shelvesOrDelete").show();
		$(".add-cart").hide();
	}else{
		$("#shelvesOrDelete").hide();
		$(".add-cart").show();
	}


	//微仓库存
	$("#mv_stock").html(goods.mv_stock);
	//B端用户才显示 微仓库存
	if($.isUserB()){
		$("#mv_stock_span").show()
	}
	//商品详情
	$("#decoration").html(goods.description_html);
	//商品ID
	$("#check-goods-id").val(goods.goods_id);
	
	var img_url_html = "";
	var thumb_img_html = "";
	for(var n=0;n<gallery.length;n++){
		//大图
		var item = gallery[n];
		img_url_html += '<div class="ks-imagezoom-wrap" id="goods_img_'+item.img_id+'" style="';
		if(n==0){
			img_url_html += 'display:block;';
		}else{
			img_url_html += 'display:none;';
		}
		img_url_html += '"><a href="javascript:void(0);"><img class="img-responsive jqzoom" src="'+item.img_url+'"'+
		    'alt="" rel="'+item.img_url+'" style="cursor: crosshair;"></a></div>';
		//缩略图
		thumb_img_html += '<li><div class="tb-pic" num="'+item.img_id+'"><a href="javascript:void(0);">'+
	    '<img class="img-responsive" src="'+item.thumb_url+'"'+
	    'mid="'+item.img_url+'" big="'+item.img_original+'" alt=""></a></div></li>';
	}
	//大图轮播
	if(img_url_html!=""){
		$("#img_url_list").html(img_url_html);
	}
	if(thumb_img_html!=""){
		$("#thumblist").html(thumb_img_html);
		$("#thumblist").find("li").eq(0).addClass("tb-selected");
	}
	//延迟加载商品图片
	$("img.lazy").lazyload({effect: "fadeIn"});
	if($().imagezoom){
		$(".jqzoom").imagezoom({
			yzoom:400,
			xzoom:400
			});
		$("#thumblist li a").mouseover(function(){
			//增加点击的li的class:tb-selected，去掉其他的tb-selecte
			$(this).parents("li").addClass("tb-selected").siblings().removeClass("tb-selected");
			//赋值属性
			$(".jqzoom").attr('src',$(this).find("img").attr("mid"));
			$(".jqzoom").attr('rel',$(this).find("img").attr("big"));
		});
		
	}
}
if($().imagezoom){
	$(".jqzoom").imagezoom({
		yzoom:400,
		xzoom:400
		});
	$("#thumblist li a").mouseover(function(){
		//增加点击的li的class:tb-selected，去掉其他的tb-selecte
		$(this).parents("li").addClass("tb-selected").siblings().removeClass("tb-selected");
		//赋值属性
		$(".jqzoom").attr('src',$(this).find("img").attr("mid"));
		$(".jqzoom").attr('rel',$(this).find("img").attr("big"));
	});
	
}
//延迟加载商品图片
$("img.lazy").lazyload({effect: "fadeIn"});

var handId;//计时器id
function ZouMa() {
	var self = this;
	this.maxLength = 5; //最低显示数   
	this.Timer = 2500;//计时器间隔时间
	this.Ul = $("#ul-div-pm");
	this.Start = function () {
		if(self.Ul.find(".li-div-pm").length > 5){
			handId = setInterval(self.Play, self.Timer);
		}
	}
	this.Play = function () {
	  	var img = self.Ul.find(".li-div-pm").eq(0);
	  	var left = img.eq(0).width();
	  	img.animate({ "marginLeft": (-1 * left) + "px" }, 600, function () {
		   	//appendTo函数是实现走马灯一直不间断播放的秘诀。
		   	$(this).css("margin-left", "auto").appendTo(self.Ul);
	  	});
	}
	if(self.Ul.find(".li-div-pm").length < 5){
 		$('.right2').css('display','none');
 		$('.left2').css('display','none');
 		return;
 	}
	//鼠标摸上去停止轮播		 
	$('.rowK,#ZouMa_right,#ZouMa_left').on('mouseenter mouseleave', function (e) {
	 	if(self.Ul.find(".li-div-pm").length < 5){
	 		$('.right2').css('display','none');
	 		$('.left2').css('display','none');
	 		return;
	 	}
	 	if (e.type == 'mouseenter') {
	   		clearInterval(handId);
	    }else {
	      handId = setInterval(self.Play, self.Timer);
	    }
	});
	//左
	$("#ZouMa_right").on("click",function(){
		var img = self.Ul.find(".li-div-pm").eq(0);
		var last = self.Ul.find(".li-div-pm").last();
	  	var left = last.width();
		img.animate({ "marginLeft": (1 * left) + "px"}, 300, function () {
			img.css("margin-left", "auto")
		   	last.prependTo(self.Ul);
	  	});
	});
	//右
	$("#ZouMa_left").on("click",function(){
		var img = self.Ul.find(".li-div-pm").eq(0);
	  	var left = img.eq(0).width();
		img.animate({ "marginLeft": (-1 * left) + "px"}, 300, function () {
		   	$(this).css("margin-left", "auto").appendTo(self.Ul);
	  	});
	});
}
var Ul = $("#ul-div-pm").find(".li-div-pm");
if(Ul.length>0){
	var zm = new ZouMa();
	zm.Start();
}
			
//选中显示 用户协议文本
$("#check-sign-ly").on("click",function(){
	//页面层
	layer.open({
	  type: 1,
	  title :"声明",
	  skin: 'layui-layer-rim', //加上边框
	  area: ['947px', '596px'], //宽高
	  content: $(".sign-content-ly").html()
	});
	
	$(".next-btn-ly").click(function(){
		layer.closeAll();
	});
});




