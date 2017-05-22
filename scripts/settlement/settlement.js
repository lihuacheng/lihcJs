//页面级ID
var page_id = "#settlement"

var htService = $.htService;
//是不是B端用户
var isUserB = $.isUserB();
//是否需要带出默认地址   B端 1-带出  C端 0-不带出
var default_addr = 0;
//选中的收货地址ID
var check_address_id = 0;
//购买商品ID和数量 array
var product_list;
//是否判断是否是立即采购
var type = $.getQueryString("type")=="0"?true:false;
//是否超出临界商品库存量
var isSecurity = false;

getProductList();
//获取商品信息
function getProductList(){
	// B端用户 立即采购 不显示选择地址
	if(isUserB&&type){
		$(page_id+" #check-address").hide();
		default_addr = 0;
	}else{
		$(page_id+" #check-address").show();
		default_addr = 1;
	}
	//获取地址栏参数
	product_list = $.getQueryString("product-list");
	if(!product_list){
		layer.alert("商品信息不存在,请重新操作！",{icon:6});
		return;
	}
	//使用Base64解密
	product_list = $.Base64.decode(product_list);
	if(!product_list){
		layer.alert("商品信息不存在,请重新操作！",{icon:6});
		return;
	}
	//判断字符串 数据格式是否正确  不正确则捕获异常处理
	try{
		product_list = JSON.parse(product_list);
	}catch(e){
		layer.alert("商品信息不正确,请重新操作！",{icon:6});
		return;
	}finally{
		// console.log(product_list);
	}
	var goods_id_in = "";
	for(var i=0;i<product_list.length;i++){
		var  product = product_list[i];
		goods_id_in+=product['goods_id']
		if(i!=(product_list.length-1)){
			goods_id_in+=","
		}
	}
	var getGoodsInfoByIdsCall = function(results){
		if(results.code=="0X0000"){
			var data = results.data;
			var list = data.list;
			var addr_total = data.addr_total|0;
			if(parseInt(addr_total)<=1){
				$("#get-address").hide();
			}
			updateHtml(list,product_list,addr);
			//B端 立即采购 不用选择地址
			if(isUserB&&type){
				return;
			}
			var addr = data.default_addr;
			if(addr instanceof Array){
				$(page_id+" #no-address").show();
				return;
			}
			updAddressHtml([addr]);
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.getGoodsInfoByIds(getGoodsInfoByIdsCall,goods_id_in,default_addr);
}
//更新商品信息html
function updateHtml(list,products){
console.log([list,products]);
	var strHtml = "";
	var all_tatol = 0.00;
	var listIdObj = {};
	for(var n=0; n<list.length; n++){
		listIdObj[list[n]['goods_id']] = list[n];
	}
	for(var i=0;i<products.length;i++){
		var item = listIdObj[products[i]['goods_id']];
		var goodsnumber = products[i]['quantity'];
		//判断B端高级用户 是否超过可用库存
		var has_stock = parseInt(item.has_stock);//需要库存
		var security_stock = parseInt(item.security_stock);//临界库存
		var stock = parseInt(item.stock);
		var toSecurity = stock-parseInt(goodsnumber);
		var security_html = "";
		if($.isUserVipB()){
			if(security_stock>toSecurity){
				isSecurity = true;
				security_html = '<span style="color:#f40;">安全库存量：'+security_stock+'，网站可用库存：'+stock+'，已超出：'+(security_stock-toSecurity)+'，建议减量<span>';
			}
		}
		var price = parseFloat(item.price);
		var product_tatol = (price*goodsnumber);
		all_tatol += product_tatol;
		strHtml += '<div class="clearfix goods-row1"><div class="col-xs-5 goods-td"><div class="left">'+
            '<a class="goodsdetails" href="javascript:void(0);" data-sku="' + item.goods_sn + '" target="_blank">'+
            '<img class="img-responsive lazy" src="'+item.img_original+'" data-original="'+item.img_original
            +'" border="0" alt="'+item.goods_name+'"></a></div><p class="right" style="margin-left:90px;">'+
            '<a class="goodsdetails" href="javascript:void(0);" data-sku="' + item.goods_sn + '" target="_blank">'+item.goods_name+' '+security_html+'</a>'+
            '<span class="c9 block"></span></p></div>'+
            '<div class="col-xs-2 goods-td text-center">'+item.goods_sn+'</div>'+
            '<div class="col-xs-2 goods-td text-center">￥'+price.toFixed(2)+'</div>'+
            '<div class="col-xs-1 goods-td text-center">'+goodsnumber+'</div>'+
            '<div class="col-xs-2 goods-td text-center">'+
            '<span class="c-brand subtotal">￥'+product_tatol.toFixed(2)+'</span></div></div>'+
            '<input name="cart_ids" data-num="'+goodsnumber+'" value="'+item.goods_id+'" type="hidden" />';
	}

	$(page_id+" #tatol-em-1").html(all_tatol.toFixed(2));
	$(page_id+" #tatol-em-2").html(all_tatol.toFixed(2));
	$(page_id+" #goods-table").html(strHtml);
}
//更新收货地址html
function updAddressHtml(addresList){
	var strHtml = "";
	$(page_id+" #no-address").hide();
	if(addresList.length>1){
		$(page_id+" #get-address").hide();
		$(page_id+" #set-address").show();
	}
	for(var n=0;n<addresList.length;n++){
		var item = addresList[n];
		var consignee = item.consignee;
		if(consignee.length>=4){
			consignee = consignee.substring(0,3)+"..";
		}
		strHtml += '<div class="settlement3 address"><div class="settlement31">';
		if(item.is_default=="1"){
			check_address_id = item.user_addr_id;
			strHtml += '<span title="点击选中地址" address-id="'+item.user_addr_id+'" class="set-check settlement311 check-address-div">';
		}else{
			strHtml += '<span title="点击选中地址" address-id="'+item.user_addr_id+'" class="set-check settlement311">';
		}
        strHtml += ''+consignee+' '+item.province+'</span>'+
            '<span class="settlement312"> '+consignee+' '+item.province+' '+item.city+' '+item.district+' '+item.address+' </span>'+
            '<span>'+item.mobile+'</span>';
        if(item.is_default=="1"){
        	strHtml += '<a href="javascript:void(0);" class="edit-addr-a" data-id="'+item.user_addr_id+'">编辑</a>'+
        	'<a href="javascript:void(0);" class="del-addr" data-id="'+item.user_addr_id+'">删除</a><span class="settlement313">默认地址</span></div>';
        }else{
        	strHtml += '<a href="javascript:void(0);" class="settlement-a" data-id="'+item.user_addr_id+'">设置默认</a>'+
        	'<a href="javascript:void(0);" class="edit-addr-a" data-id="'+item.user_addr_id+'">编辑</a>'+
        	'<a href="javascript:void(0);" class="del-addr" data-id="'+item.user_addr_id+'">删除</a></div>';
        }
        strHtml += '</div>';
	}
	$(page_id+" #address-list").html(strHtml);
}
//新增收货地址
$(page_id+" #go-shipAddress").on("click",function(){
	// $.redirect("index/shipAddress",{},"_blank");
	//1: 中国下什么的所有省份
	$.getRegionList(province,1);
	province.change();
	$("#address-layer,#address-layer-ui").show();

});
//更多地址
$(page_id+" #get-address").on("click",function(){
	var getAddrListCall = function(results){
		if(results.code=="0X0000"){
			var data = results.data;
			var list = data.list;
			updAddressHtml(list);
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.getAddrList(getAddrListCall,1,10);
});
//收起地址
$(page_id+" #set-address").on("click",function(){
	var addres_list = $(page_id+" #address-list");
	addres_list.find(".address").hide();
	addres_list.find(".check-address-div").closest(".address").show();
	$(page_id+" #set-address").hide();
	$(page_id+" #get-address").show();
});
//设置选中
$(page_id+" #address-list").on("click",".set-check",function(){
	check_address_id = $(this).attr("address-id");
	$(page_id+" #address-list .set-check").removeClass("check-address-div");
	$(this).addClass("check-address-div");
});

//返回购物车
$(page_id+" #back-cart").on("click",function(){
	$.redirect("index/shopping");
});

//提交订单
$(page_id+" #submit-order").on("click",function(){
	if(!product_list){
		layer.alert("商品信息不存在,请返回上一步！");
		return;
	}
	//B端用户点击的立即采购  就不用选择收货地址了
	if(!(isUserB&&type)&&check_address_id==0){
		layer.alert("请先选择收货地址！");
		return;
	}

	var shop_type = "normal_buy";//购物车下单
	//B端 立即采购 不用选择地址
	if(isUserB&&type){
		if(isSecurity){
			//询问框
			layer.confirm('您部分采购商品超出安全库存,是否继续下单！若继续下单，需市场部审批后，财务方可付款。', {
			  btn: ['继续下单','取消'] //按钮
			}, function(){
			    createPurchaseOrder(product_list);
			}, function(){
			  
			});
		}else{
			createPurchaseOrder(product_list);
		}
		
	}else{
		//创建普通订单
		var createCOrderCall = function(results){
			if(results.code=="0X0000"){
				var data = results.data;
				var c_order_sn = data.c_order_sn;
				$.redirect("index/Pay",{"order_sn":c_order_sn});
			}else{
				layer.alert(results.message,{icon:6});
			}
		};
		htService.createCOrder(createCOrderCall,shop_type,check_address_id,JSON.stringify(product_list));
	}
});
//创建采购订单
function createPurchaseOrder(product_list){
	var createPurchaseOrderCall = function(results){
		if(results.code=="0X0000"){
			var data = results.data;
			var purchase_order_sn = data.purchase_order_sn;
			//是否是B端高级用户
			if($.isUserVipB()){
				//墨绿深蓝风
				layer.alert("采购订单创建成功,去采购进货列表查看！", {
				  skin: 'layui-layer-molv' //样式类名
				  ,closeBtn: 0
				}, function(){
				  $.redirect("index/purchaseOrder");
				});
			}else{
				$.redirect("index/Pay",{"order_sn":purchase_order_sn});
			}
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.createPurchaseOrder(createPurchaseOrderCall,JSON.stringify(product_list),"website");
}
var address_id = "#address-layer-ui";
//用户姓名
var username = $(address_id+ " #username");
//身份证号
var idno = $(address_id+ " #idno");
//手机号码
var phonenumber = $(address_id+ " #phonenumber");
//详细地址
var addresstext = $(address_id+ " #addresstext");
//省
var province = $(address_id+ " #province");
//市
var city = $(address_id+ " #city");
//区
var district = $(address_id+ " #district");

var provinceVal = $(address_id+ " #provinceVal");

var cityVal = $(address_id+ " #cityVal");

var districtVal = $(address_id+ " #districtVal");
//地址ID
var useraddrid = $(address_id+" #user_addr_id");
//是否默认选中 checkbox
var isdefault = $(address_id+" #isdefault");
//取消
var cancelbtn = $(address_id+" .cancel-btn");
//保存
var savebtn = $(address_id+" .save-btn");
//省
province.on("change",function(){
	var val = $(this).find("option:selected").val();
	provinceVal.val(val);
	// district.html("");
	$.getRegionList(city,val);
	var c_val = city.find("option:selected").val();
	cityVal.val(c_val);
	$.getRegionList(district,c_val);
	// var d_val = district.find("option:selected").val();
	// districtVal.val(d_val);
});
//市
city.on("change",function(){
	var val = $(this).find("option:selected").val();
	$.getRegionList(district,val);
	cityVal.val(val);
	// var d_val = district.find("option:selected").val();
	// districtVal.val(d_val);
});
//区
district.on("change",function(){
	var val = $(this).find("option:selected").val();
	districtVal.val(val);
});
//取消按钮  清空文本框 隐藏域 下拉框 复选框数据
cancelbtn.on("click",function(){
	useraddrid.val("");
	username.val("");
	idno.val("");
	phonenumber.val("");
	addresstext.val("");
	provinceVal.val("-1");
	cityVal.val("-1");
	districtVal.val("-1");
	//选中select下拉框  触发change事件
	province.find('option[value="-1"]').attr("selected","selected");
	city.find('option[value="-1"]').attr("selected","selected");
	district.find('option[value="-1"]').attr("selected","selected");
	isdefault.attr("checked",false);
});
//保存收货地址
savebtn.on("click",function(){
	var id =  $.trim(useraddrid.val());
	var name =  $.trim(username.val());
	var id_no =  $.trim(idno.val());
	var phone =  $.trim(phonenumber.val());
	var addr =  $.trim(addresstext.val());
	var province_id = parseInt(provinceVal.val());
	var city_id = parseInt(cityVal.val());
	var district_id = parseInt(districtVal.val());
	var isFalg = isdefault.is(':checked');
	if($.string.isEmpty(name)){
		layer.tips("收货人姓名不能为空！",username);
		return;
	}
	if($.string.isEmpty(id_no)){
		layer.tips("身份证号码不能为空！",idno);
		return;
	}
	if(!$.string.isCardID(id_no)){
		layer.tips("身份证号码格式不正确或已失效！",idno);
		return;
	}
	if($.string.isEmpty(phone)){
		layer.tips("手机号码不能为空！",phonenumber);
		return;
	}
	if(!$.string.isMobile(phone)){
		layer.tips("手机号码格式不正确！",phonenumber);
		return;
	}
	if($.string.isEmpty(addr)){
		layer.tips("详细地址不能为空！",addresstext);
		return;
	}
	if(province_id==-1||city_id==-1||district_id==-1){
		layer.alert("请选所属地址的省/市/区！",{icon: 6});
		return;
	}
	var param = {
		"consignee": name,
		"id_card_number" : id_no,
		"country_id": "1",
		"province_id": province_id,
		"city_id": city_id,
		"district_id": district_id,
		"address": addr,
		"mobile": phone,
		"is_default": (isFalg?1:0)
	};
	param = JSON.stringify(param);
	var setAddrCall = function(results){
		if(results.code=="0X0000"){
			cancelbtn.trigger("click");
			$(address_id+" #address-layer-close").trigger("click");
			$(page_id+" #get-address").trigger("click");
			layer.alert("添加收货地址成功！", {icon: 6});
		}else{
			layer.alert(results.message, {icon: 6});
		}
	};
	htService.setAddr(setAddrCall,param,id);

});
$(address_id+" #address-layer-close").on("click",function(){
	cancelbtn.trigger("click");
	$("#address-layer,#address-layer-ui").hide();
});
//事件委托机制  预绑定 设置默认地址事件
$(page_id+" #address-list").on("click",".settlement-a",function(){
	var address_id = $(this).attr("data-id");
	//询问框：是否设置默认地址
	layer.confirm('是否设置该收货地址为默认地址？', {
	  btn: ['确定','取消'] //按钮
	}, function(){
		setAddrDefault(address_id)
	}, function(){
	  	layer.closeAll();
	});
	
});
/** 设置默认收货地址 **/
function setAddrDefault(address_id){
	var setAddrDefaultCall = function(results){
		if(results.code=="0X0000"){
			$(page_id+" #get-address").trigger("click");
			layer.msg("设置成功！");
		}else{
			layer.alert(results.message, {icon: 6});
		}
	};
	htService.setAddrDefault(setAddrDefaultCall,address_id);
}
//事件委托机制  预绑定 修改事件
$(page_id+" #address-list").on("click",".edit-addr-a",function(){
	var address_id = $(this).attr("data-id");
	var getAddrInfoCall = function(results){
		if(results.code=="0X0000"){
			//console.log(results);
			$.getRegionList(province,1);
			var data = results.data;
			var isDefault = parseInt(data.is_default);//1:默认选中  0：不选中
			useraddrid.val(data.user_addr_id);
			username.val(data.consignee);
			idno.val(data.id_card_number);
			phonenumber.val(data.mobile);
			addresstext.val(data.address);
			provinceVal.val(data.province_id);
			cityVal.val(data.city_id);
			districtVal.val(data.district_id);
			//选中select下拉框  触发change事件
			province.find('option[value="'+data.province_id+'"]').prop("selected","selected");
			province.change();
			city.find('option[value="'+data.city_id+'"]').prop("selected","selected");
			city.change();
			district.find('option[value="'+data.district_id+'"]').prop("selected","selected");
			if(isDefault==1){
				isdefault.attr("checked",true);
			}else{
				isdefault.attr("checked",false);
			}
			$("#address-layer,#address-layer-ui").show();
		}else{
			layer.alert(results.message, {icon: 6});
		}
	};
	htService.getAddrInfo(getAddrInfoCall,address_id);
});
//事件委托机制  预绑定 删除事件
$(page_id+" #address-list").on("click",".del-addr",function(){
	var address_id = $(this).attr("data-id");
	//询问框：是否删除
	layer.confirm('您确定删除该条地址信息？', {
	  btn: ['确定','取消'] //按钮
	}, function(){
		delAddr(address_id)
	}, function(){
	  	layer.closeAll();
	});
	
});
/** 删除收货地址 **/
function delAddr(address_id){
	var delAddrCall = function(results){
		if(results.code=="0X0000"){
			$(page_id+" #get-address").trigger("click");
			layer.msg("删除成功！");
		}else{
			layer.alert(results.message, {icon: 6});
		}
	};
	htService.delAddr(delAddrCall,address_id);
}