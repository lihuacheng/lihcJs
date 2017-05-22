//页面级ID
var page_id = "#shipAddress"

var htService = $.htService;
//收货地址列表
var table = $(page_id+" #address_table");
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


//获取收货地址列表
getAddrList();

//事件委托机制  预绑定 修改事件
table.on("click",".upd-addr",function(){
	var address_id = $(this).attr("data-id");
	var getAddrInfoCall = function(results){
		if(results.code=="0X0000"){
			//console.log(results);
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
		}else{
			layer.alert(results.message, {icon: 6});
		}
	};
	htService.getAddrInfo(getAddrInfoCall,address_id);
});

//事件委托机制  预绑定 删除事件
table.on("click",".del-addr",function(){
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

//事件委托机制  预绑定 设置默认地址事件
table.on("click",".setDefault",function(){
	var address_id = $(this).attr("data-id");
	//询问框：是否删除
	layer.confirm('是否设置该收货地址为默认地址？', {
	  btn: ['确定','取消'] //按钮
	}, function(){
		setAddrDefault(address_id)
	}, function(){
	  	layer.closeAll();
	});
	
});

/**  获取收货地址列表 **/
function getAddrList(page,size){
	var getAddrListCall = function(results){
		if(results.code=="0X0000"){
			//console.log(results);
			var data = results.data;
			if(data.length==0){
				table.append('<tr id="no-tips" class="tr_address"><td colspan="5">暂无收货地址信息,请添加...</td></tr>');
				return;
			}

			var addrList = data.list;
			var strHtml = "";
			$(page_id+" .menu-title b").html(addrList.length);
			for(var i=0;i<addrList.length;i++){
				var addr = addrList[i];
				var is_default = parseInt(addr.is_default);
				strHtml += '<tr class="tr_address">'+
					'<td>'+addr.consignee+'</td>'+
					'<td>'+addr.country+''+addr.province+''+addr.city+
					''+addr.district+
					''+addr.address+'</td>'+
					'<td>'+addr.mobile+'</td>'+
					'<td>'+
						'<a class="upd-addr check-btn" data-id="'+addr.user_addr_id+'" href="javascript:void(0);">修改</a>'+
						'<a class="del-addr check-btn" data-id="'+addr.user_addr_id+'" href="javascript:void(0);">删除</a>'+
					'</td>'+
					'<td>';

				if(is_default==1){
					strHtml+='<div class="check-btn">默认地址</div>';
				}else{
					strHtml+='<a class="setDefault" data-id="'+addr.user_addr_id+'" '+
					' href="javascript:void(0);">设置默认地址</a>';
				}
				strHtml +='</td></tr>';
			}
			table.find(".tr_address").remove();
			table.append(strHtml);
		}else{
			layer.alert(results.message, {icon: 6});
		}
	};
	htService.getAddrList(getAddrListCall,page,size);
}

/** 删除收货地址 **/
function delAddr(address_id){
	var delAddrCall = function(results){
		if(results.code=="0X0000"){
			layer.msg("删除成功！");
			getAddrList();
		}else{
			layer.alert(results.message, {icon: 6});
		}
	};
	htService.delAddr(delAddrCall,address_id);
}

/** 设置默认收货地址 **/
function setAddrDefault(address_id){
	var setAddrDefaultCall = function(results){
		if(results.code=="0X0000"){
			layer.msg("设置成功！");
			getAddrList();
		}else{
			layer.alert(results.message, {icon: 6});
		}
	};
	htService.setAddrDefault(setAddrDefaultCall,address_id);
}

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
	// districtVal.val("d_val");	
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
	// provinceVal.val("-1");
	// cityVal.val("-1");
	// districtVal.val("-1");
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
			getAddrList();
			cancelbtn.trigger("click");
			//1: 中国下什么的所有省份
			$.getRegionList(province,1);
			province.change();
			layer.alert("操作成功！", {icon: 6});
		}else{
			layer.alert(results.message, {icon: 6});
		}
	};
	htService.setAddr(setAddrCall,param,id);

});
//1: 中国下什么的所有省份
$.getRegionList(province,1);
// province.change();