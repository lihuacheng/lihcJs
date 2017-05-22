//页面级ID
var page_id = "#newSettlement"

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

//用户姓名
var username = $(page_id+ " #username");
//身份证号
var idno = $(page_id+ " #idno");
//手机号码
var phonenumber = $(page_id+ " #phonenumber");
//详细地址
var addresstext = $(page_id+ " #addresstext");
//省
var province = $(page_id+ " #province");
//市
var city = $(page_id+ " #city");
//区
var district = $(page_id+ " #district");

var provinceVal = $(page_id+ " #provinceVal");

var cityVal = $(page_id+ " #cityVal");

var districtVal = $(page_id+ " #districtVal");
//地址ID
var useraddrid = $(page_id+" #user_addr_id");
//是否默认选中 checkbox
var isdefault = $(page_id+" #isdefault");
//取消
var cancelbtn = $(page_id+" .cancel-btn");
//保存
var savebtn = $(page_id+" .save-btn");

getProductList();
//获取商品信息
function getProductList(){
	// B端用户 立即采购 不显示选择地址
	if(isUserB&&type){
		$(page_id+" #check-address,#check-address-string").hide();
		default_addr = 0;
	}else{
		$(page_id+" #check-address,#check-address-string").show();
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
			updProductHtml(list,product_list,addr);
			//B端 立即采购 不用选择地址
			if(isUserB&&type){
				return;
			}
			var addr = data.default_addr;
			if(addr instanceof Array){
				$(page_id+" #no-address").show();
				return;
			}
			updAddressHtml([addr],false);
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.getGoodsInfoByIds(getGoodsInfoByIdsCall,goods_id_in,default_addr);

}
//更新商品信息html  作废
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
        strHtml += '<div class="goods-row1_zy3"><div class="col-xs-5_zy3 goods-td_zy3">\
                    <div class="left"><a class="goodsdetails" href="javascript:void(0);" data-sku="' + item.goods_sn + '" target="_blank">\
                    <img class="img-respon img-responsive lazy" src="'+item.img_original+'" data-original="'+item.img_original+'" border="0" alt="'+item.goods_name+'" /></a>\
                    </div><p class="right"><a class="goodsdetails" href="javascript:void(0);" data-sku="' + item.goods_sn + '" target="_blank">'+item.goods_name+' '+security_html+'</a></p></div>\
                    <div class="col-xs-2_zy3 goods-td">'+item.goods_sn+'</div>\
                    <div class="col-xs-2_zy3 goods-td">￥'+price.toFixed(2)+'</div>\
                    <div class="col-xs-3_zy3 goods-td text-center">'+goodsnumber+'</div>\
                    <div class="col-xs-4_zy3 goods-td text-center">￥'+product_tatol.toFixed(2)+'</div></div>\
                    <input name="cart_ids" data-num="'+goodsnumber+'" value="'+item.goods_id+'" type="hidden" />';
	}
	$(page_id+" #tatol-em-1").html(all_tatol.toFixed(2));
	$(page_id+" #tatol-em-2").html(all_tatol.toFixed(2));
	// $(page_id+" #goods-table").html(strHtml);
}

//更新商品信息html 
function updProductHtml(list,products){
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

        strHtml += '<div class="goods-row1_zy3 name">\
                        <div class="col-xs-5_zy3 goods-td_zy3" style="width: 44.5%;">\
                            <div class="left">\
                                <a class="goodsdetails" href="javascript:void(0);" data-sku="' + item.goods_sn + '" target="_blank">\
                                    <img class="img-respon img-responsive lazy" src="'+item.img_original+'" data-original="'+item.img_original+'" border="0" alt="'+item.goods_name+'" >\
                                </a>\
                            </div>\
                                <p class="right">\
                                    <a class="goodsdetails" href="javascript:void(0);" data-sku="' + item.goods_sn + '" target="_blank">\
                                        '+item.goods_name+' '+security_html+'</a></p>\
                        </div>\
                        <div class="col-xs-2_zy3 goods-td">￥'+price.toFixed(2)+'</div>\
                        <div class="col-xs-3_zy3 goods-td text-center">'+goodsnumber+'</div>\
                        <div class="col-xs-4_zy3 goods-td text-center">￥'+product_tatol.toFixed(2)+'</div>\
                    </div>';
	}
	$(page_id+" #tatol-em-1").html(all_tatol.toFixed(2));
	$(page_id+" #tatol-em-2").html(all_tatol.toFixed(2));
	var html = "";
	if(!(isUserB&&type)){
		html = '<div class="goods-title-row"><div class="goods-title-left">发货地：<span>未分配</span></div>\
	<div class="goods-title-right">本仓金额：<span>'+all_tatol.toFixed(2)+'</span></div></div>';
	}
    html += '<div class="goods-list">'+strHtml+'</div>';
	$(page_id+" #goods-table").html(html);
}

//更新收货地址html
function updAddressHtml(addresList,type){
	var strHtml = "";
	$(page_id+" #no-address").hide();
	if(addresList.length>1&&type==true){
		$(page_id+" #get-address").hide();
		$(page_id+" #set-address").show();
	}
	for(var n=0;n<addresList.length;n++){
		var item = addresList[n];
		var consignee = item.consignee;
		var mobile = item.mobile;
		var isCheckAddress = "";
		if(item.is_default=="1"){
			check_address_id = item.user_addr_id;
			isCheckAddress = "check-address-div";
			showAddressStr($.Base64.encode(JSON.stringify(item)));
			splitGoodsListByConsigneeAddress(check_address_id,product_list);
		}
		strHtml += '<li class="morenchoice '+isCheckAddress+'" data-json="'+$.Base64.encode(JSON.stringify(item))+'" address-id="'+item.user_addr_id+'" >\
            <div class="choise-address-content-zy3">\
            <div class="choise-address-top-zy3">\
            <div class="choise-address-name">'+item.consignee+' 收</div>';
        if(item.is_default=="1"){
        	strHtml += '<div class="moren-address-ad">默认地址</div>';
		}else{
			strHtml += '<div class="settlement-a moren-address-ad" data-id="'+item.user_addr_id+'">设置默认</div>';
        }
        strHtml += '</div><div class="address-content-bottom-zy3">\
            <span> '+item.province+'</span><span>'+item.city+'</span><span>'+item.district+'</span><span>'+item.address+'</span>\
        	<br><span>'+item.mobile+'</span></div>\
            <div class="address-content-cancel edit-addr-a" data-id="'+item.user_addr_id+'">修改</div>\
            <div class="address-content-delete del-addr" data-id="'+item.user_addr_id+'">删除</div></div></li>';
		
	}
	$(page_id+" #address-list").html(strHtml);
}
//更多地址
$(page_id+" #get-address").on("click",function(){
	var getAddrListCall = function(results){
		if(results.code=="0X0000"){
			var data = results.data;
			var list = data.list;
			updAddressHtml(list,true);
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.getAddrList(getAddrListCall,1,10);
});
//收起地址
$(page_id+" #set-address").on("click",function(){
	var addres_list_li = $(page_id+" #address-list li");
	addres_list_li.each(function(k,v){
		if(k>2){
			$(this).hide();
		}
	});
	$(page_id+" #set-address").hide();
	$(page_id+" #get-address").show();
});
//设置选中
$(page_id+" #address-list").on("click",".morenchoice",function(){
	check_address_id = $(this).attr("address-id");
	splitGoodsListByConsigneeAddress(check_address_id,product_list	);
	var dataJson = $(this).attr("data-json");
	showAddressStr(dataJson)
	$(page_id+" #address-list .morenchoice").removeClass("check-address-div");
	$(this).addClass("check-address-div");
});
//显示选中的收货地址信息
function showAddressStr(data){
	var dataJson = JSON.parse($.Base64.decode(data));
	var check_addressStr = dataJson.province+""+dataJson.city+""+dataJson.district+""+dataJson.address;
	$(page_id+" #check-name").html(dataJson.consignee);
	$(page_id+" #check-addressStr").html(check_addressStr);
	$(page_id+" #check-phone").html(dataJson.mobile);
}
//返回购物车
$(page_id+" #back-cart").on("click",function(){
	$.redirect("index/shopping");
});

//新增收货地址
$(page_id+" #go-shipAddress").on("click",function(){
	// $.redirect("index/shipAddress",{},"_blank");
	//1: 中国下什么的所有省份
	$.getRegionList(province,1);
	province.change();
	$(page_id+" #address_info").show();
	$(this).hide();

});
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
			$(page_id+" #get-address").trigger("click");
			layer.alert("添加收货地址成功！", {icon: 6});
		}else{
			layer.alert(results.message, {icon: 6});
		}
	};
	htService.setAddr(setAddrCall,param,id);

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
			$(page_id+" #address_info").show();
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
//提交订单
$(page_id+" #submit-order").on("click",function(){
	if(!product_list){
		layer.alert("商品信息不存在,请返回上一步！",{icon:6});
		return;
	}
	//B端用户点击的立即采购  就不用选择收货地址了
	if(!(isUserB&&type)&&check_address_id==0){
		layer.alert("请先选择收货地址！",{icon:6});
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
				var strHtml = "";
				for(var i=0;i<data.length;i++){
					var item = data[i];
					var c_order_id = item.c_order_id;
					var c_order_sn = item.c_order_sn;
					var order_amount = item.order_amount;
					var warehouse_id = item.warehouse_id;
					var warehouse_name = item.warehouse_name;
					var goods_list =  item.goods_list;
					var goods_name = "";
					for(var j=0;j<goods_list.length;j++){
						if(j!=0){
							goods_name += "<br>";
						}
						goods_name += goods_list[j].goods_name;
					}
					strHtml +='<tr><td>'+c_order_sn+'</td>\
					<td>'+goods_name+'</td>\
                    <td>'+warehouse_name+'</td>\
                    <td>￥'+order_amount+'</td>\
                    <td><input class="btn btn-primary zhifubao-btn cd-btn" order_id="'+c_order_id+'" order_sn="'+c_order_sn+'" type="button" value="去支付"></td></tr>';
				}
				$(".goods-table-cd").append(strHtml);
				$("#submit-order-div").hide();
				$("#save-succ-div").show();
				// var c_order_sn = data.c_order_sn;
				// $.redirect("index/Pay",{"order_sn":c_order_sn});
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
				},{icon:6});
			}else{
				$.redirect("index/Pay",{"order_sn":purchase_order_sn});
			}
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.createPurchaseOrder(createPurchaseOrderCall,JSON.stringify(product_list),"website");
}
//选仓 拆单
function splitGoodsListByConsigneeAddress(address_id,goods_list){
	var splitGoodsListByConsigneeAddressCall = function(results){
		console.log(results);
		if(results.code=="0X0000"){
			var list = results.data;
			var html = "";
			var all_tatol = 0.00;
			for(var i=0;i<list.length;i++){
				var row = list[i];
				var warehouse_name = row.warehouse_name;
				var goods = row.goods_list;
				var cang_tatol = 0.00;
				var strHtml = "";
				for(var j=0;j<goods.length;j++){
					var item = goods[j];
					var goodsnumber = item.quantity;
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
					cang_tatol += product_tatol;

			        strHtml += '<div class="goods-row1_zy3 name">\
			                        <div class="col-xs-5_zy3 goods-td_zy3" style="width: 44.5%;">\
			                            <div class="left">\
			                                <a class="goodsdetails" href="javascript:void(0);" data-sku="' + item.goods_sn + '" target="_blank">\
			                                    <img class="img-respon img-responsive lazy" src="'+item.img_original+'" data-original="'+item.img_original+'" border="0" alt="'+item.goods_name+'" >\
			                                </a>\
			                            </div>\
			                                <p class="right">\
			                                    <a class="goodsdetails" href="javascript:void(0);" data-sku="' + item.goods_sn + '" target="_blank">\
			                                        '+item.goods_name+' '+security_html+'</a></p>\
			                        </div>\
			                        <div class="col-xs-2_zy3 goods-td">￥'+price.toFixed(2)+'</div>\
			                        <div class="col-xs-3_zy3 goods-td text-center">'+goodsnumber+'</div>\
			                        <div class="col-xs-4_zy3 goods-td text-center">￥'+product_tatol.toFixed(2)+'</div>\
			                    </div>';
				}
				html += '<div class="goods-title-row"><div class="goods-title-left">发货地：<span>'+warehouse_name+'</span></div>\
			    <div class="goods-title-right">本仓金额：<span>'+cang_tatol.toFixed(2)+'</span></div></div><div class="goods-list">'+strHtml+'</div>';
				all_tatol += cang_tatol;
			}
			$(page_id+" #tatol-em-1").html(all_tatol.toFixed(2));
			$(page_id+" #tatol-em-2").html(all_tatol.toFixed(2));
			$(page_id+" #goods-table").html(html);
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.splitGoodsListByConsigneeAddress(splitGoodsListByConsigneeAddressCall,address_id,JSON.stringify(goods_list));
}

//去支付按钮
$("body").on("click",".cd-btn",function(){
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
});

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