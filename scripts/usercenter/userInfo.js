//页面级ID
var page_id = "#userInfo"
//用户ID
var user_id;

var htService = $.htService;
//tab 切換
var info_tab = $("#info_tab li");
//tab div
var tab_content = $(".tab-content .tab-pane");

//tab栏切换
info_tab.on("click",function(){
	info_tab.removeClass("active");
	$(this).addClass("active");
	tab_content.removeClass("active").eq($(this).index()).addClass("active");
});
//出生日期 
var birthday = $(page_id+" #birthday");
//用户名 
var checkName = $(page_id+" #checkName");
//邮箱 
var email = $(page_id+" #email");
//微信 
var weixin = $(page_id+" #weixin");
//qq
var qq = $(page_id+" #qq");
//手机号 
var phoneNumber = $(page_id+" #phoneNumber");
//姓名
var userName = $(page_id+" #userName");
//昵称
var nick = $(page_id+" #nick");
//获取用户信息
getUserInfo();
//显示时间控件
$(page_id+" #birthday").on("focus",function(){
	WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'{%y-100}-01-01',maxDate:'{%y-0}-12-31'});
});
	
//确认修改基础资料
$(page_id+ " #update_info_submit").on("click",function(){
	var birthdayVal = birthday.val();
	var sexVal = $(page_id+" input[name='sex']:checked").val();
	var emailVal = email.val();
	var weixinVal = weixin.val();
	var qqVal = qq.val();
	var phoneNumberVal = phoneNumber.val();
	var userNameVal = userName.val();
	var nickVal = nick.val();
	var checkNameVal = checkName.val();
	if($.string.isEmpty(checkNameVal)){
		layer.tips("用户名不能为空！",checkName);
		return;
	}
	//校验日期格式
	if(!$.string.isDate(birthdayVal)){
		layer.tips("出生日期格式不正确,请重新选择！",birthday);
		return;
	}
	if(!$.string.isEmail(emailVal)){
		layer.tips("请输入正确的邮箱地址！",email);
		return;
	}
	if($.string.isEmpty(weixinVal)){
		layer.tips("微信号不能为空！",weixin);
		return;
	}
	if($.string.isEmpty(qqVal)){
		layer.tips("QQ号不能为空！",qq);
		return;
	}
	if($.string.isEmpty(phoneNumberVal)){
		layer.tips("手机号码不能为空！",phoneNumber);
		return;
	}
	if($.string.isEmpty(nickVal)){
		layer.tips("昵称不能为空！",nick);
		return;
	}
	var param = {};
	param.user_name = checkNameVal;//用户名
	param.email = emailVal;//邮箱
	param.image_url = "";//头像地址
	param.nick = nickVal;//昵称
	param.birthday = birthdayVal;//生日
	param.name = userNameVal;//姓名
	param.qq = qqVal;//QQ
	param.wechat = weixinVal;//微信
	param.sex = sexVal;//性别 0保密 1男 2女
	param = JSON.stringify(param);
	var updateInfos = function(results){
		if(results.code=="0X0000"){
			//清空文本框数据
			old_password.val("");
			new_password.val("");
			comfirm_password.val("");
			layer.alert("修改成功！", {icon: 6});
		}else{
			layer.alert(results.message, {icon: 6});
		}
	};
	htService.updateInfos(updateInfos,param);
});

//原密码
var old_password = $(page_id+" #old_password");
//新密码
var new_password = $(page_id+" #new_password");
//确认新密码
var comfirm_password = $(page_id+" #comfirm_password");
//验证新密码格式是否正确，不能与老密码一致
new_password.on("blur",function(){
	var pwdVal = new_password.val();
	if(pwdVal.length<6){
		layer.tips("密码不能小于6位！",new_password);
		return;
	}
	if(pwdVal.length>20){
		layer.tips("密码不能大于20位！",new_password);
		return;
	}
	var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-zA-Z]|[0-9]){6,}$/;
	if(!reg.test(pwdVal)){
		layer.tips("密码至少是数字、字母、符号，任意两种组合以上！",new_password);
		return;
	}
	if(!$.valida.isLegalPwd($(this).val(),$(this))){
		return;
	}
	if(old_password.val()==new_password.val()){
		layer.tips("新密码不能与原密码一致！",$(this));
		return;
	}
});
//验证两次输入密码是否一致
comfirm_password.on("blur",function(){
	if(comfirm_password.val()!=new_password.val()){
		layer.tips("两次输入密码不一致！",$(this));
		return;
	}
});
//确认修改密码
$(page_id+" #comfirm_submit").on("click",function(){
	var oldVal = old_password.val();
	var newVal = new_password.val();
	var comfirmVal = comfirm_password.val();
	if($.string.isEmpty(oldVal)){
		layer.tips("原密码不能为空！",old_password);
		return;
	}
	if($.string.isEmpty(newVal)){
		layer.tips("新密码不能为空！",new_password);
		return;
	}
	var pwdVal = new_password.val();
	if(pwdVal.length<6){
		layer.tips("密码不能小于6位！",new_password);
		return;
	}
	if(pwdVal.length>20){
		layer.tips("密码不能大于20位！",new_password);
		return;
	}
	var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-zA-Z]|[0-9]){6,}$/;
	if(!reg.test(pwdVal)){
		layer.tips("密码至少是数字、字母、符号，任意两种组合以上！",new_password);
		return;
	}
	if($.string.isEmpty(comfirmVal)){
		layer.tips("确认密码不能为空！",comfirm_password);
		return;
	}
	if(!$.valida.isLegalPwd(newVal,new_password)){
		return;
	}
	if(oldVal==newVal){
		layer.tips("新密码不能与原密码一致！",new_password);
		return;
	}
	if(comfirmVal!=newVal){
		layer.tips("两次输入密码步一致！",comfirm_password);
		return;
	}
	var updatePasswordCall = function(results){
		if(results.code=="0X0000"){
        	$.removeStorage("userInfo");
			layer.alert("密码修改成功，请重新登陆！", {
	          skin: 'layui-layer-moon',closeBtn: 0
	        }, function(){
	          	$.redirect("index/login",{"return_url": $.Base64.encode(window.location.href)});
	        });
		}else{
			layer.alert(results.message, {icon: 6});
		}
	};
	htService.updatePassword(updatePasswordCall,oldVal,newVal);
});


//获取用户基础资料
function getUserInfo(){
	var infoCall = function(results){
		if(results.code=="0X0000"){
			var data = results.data;
			user_id = data.user_id;
			var data_birthday = data.birthday;
			if($.string.isNotEmpty(data_birthday)){
				birthday.val(data_birthday);
			}
			var data_sex = parseInt(data.sex);
			$(page_id+" input[name='sex']").eq(data_sex).attr("checked",'checked'); 
			email.val(data.email);
			weixin.val(data.wechat);
			userName.val(data.name);
			qq.val(data.qq);
			phoneNumber.val(data.mobile_phone);
			nick.val(data.nick);
			checkName.val(data.user_name);
		}else{
			layer.alert(results.message, {icon: 6});
		}
	};
	htService.info(infoCall);
}