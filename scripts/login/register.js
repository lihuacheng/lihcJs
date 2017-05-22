//用户名
// var username = $("#username");
//密码
var password = $("#password");
//确认密码
var confirmPassword = $("#confirm_password");
//手机号
var phone = $("#phone");
//图片验证码
var yzmCode = $("#yzm_code");
//短信验证码
var smsCode = $("#sms_code");

//加载验证码图片
// $(".image-code").find("img").attr("src",$.apiU("user/captcha")+"?random="+Math.random());
$.captchaBase64(".image-code img");

var htService = $.htService;
//判断用户名称是否可用
var isUserNameFlag = false;
//判断手机号是否可用
var isMobileFlag = false;
//是否可以发送短信
var  isSendSms = true;
//手动清空value的值

$("input[type=text],input[type=password]").val("");

//验证用户名
// username.on("blur",function(){
// 	isLegalName($(this).val(),$(this));
// });
//验证密码
password.on("blur",function(){
	var pwdVal = $(this).val();
	if(pwdVal.length<6){
		layer.tips("密码不能小于6位！",$(this));
		return;
	}
	if(pwdVal.length>20){
		layer.tips("密码不能大于20位！",$(this));
		return;
	}
	var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-zA-Z]|[0-9]){6,}$/;
	if(!reg.test(pwdVal)){
		layer.tips("密码至少是数字、字母、符号，任意两种组合以上！",$(this));
		return;
	}
	$.valida.isLegalPwd(pwdVal,$(this));
});
//验证两次输入密码
confirmPassword.on("blur",function(){
	confirmPwd(password.val(),$(this).val(),$(this));
});
//验证手机号码
phone.on("blur",function(){
	isPhone($(this).val(),$(this));
});
//发送图片验证码
$(".image-code").on("click",function(){
	// $(this).find("img").attr("src",$.apiU("user/captcha")+"?random="+Math.random());
	$.captchaBase64(".image-code img");
});

//请登录
$("#please-login").on("click",function(){
	$.redirect("login");
});

//获取短信验证码
$(".sms-code-btn").on("click",function(){
	//短信验证码 倒计时中 不能发发送短信
	if(!isSendSms){
		return;
	}
	if(!isPhone(phone.val(),phone)){
		return;
	}
	// if(!isLegalName(username.val(),username)){
	// 	return;
	// }
	var pwdVal = password.val();
	if(pwdVal.length<6){
		layer.tips("密码不能小于6位！",password);
		return;
	}
	if(pwdVal.length>20){
		layer.tips("密码不能大于20位！",password);
		return;
	}
	var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-zA-Z]|[0-9]){6,}$/;
	if(!reg.test(pwdVal)){
		layer.tips("密码至少是数字、字母、符号，任意两种组合以上！",password);
		return;
	}
	if(!$.valida.isLegalPwd(password.val(),password)){
		return;
	}
	if(!confirmPwd(password.val(),confirmPassword.val(),confirmPassword)){
		return;
	}
	// checkUserNameOrMobile(username.val(),"user_name");
	// if(!isUserNameFlag){
	// 	return;
	// }
	checkUserNameOrMobile(phone.val(),"mobile_phone");
	if(!isMobileFlag){
		return;
	}
	if(yzmCode.val()==""){
		layer.tips("图片验证码不能为空",yzmCode);
		return;
	}
	sendSms();

});

//立即注册
$(".register-binding-btn").on("click",function(){
	// if(!isLegalName(username.val(),username)){
	// 	return;
	// }

	if(!isPhone(phone.val(),phone)){
		return;
	}
	var pwdVal = password.val();
	if(pwdVal.length<6){
		layer.tips("密码不能小于6位！",password);
		return;
	}
	if(pwdVal.length>20){
		layer.tips("密码不能大于20位！",password);
		return;
	}
	var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-zA-Z]|[0-9]){6,}$/;
	if(!reg.test(pwdVal)){
		layer.tips("密码至少是数字、字母、符号，任意两种组合以上！",password);
		return;
	}
	if(!$.valida.isLegalPwd(password.val(),password)){
		return;
	}
	if(!confirmPwd(password.val(),confirmPassword.val(),confirmPassword)){
		return;
	}

	// checkUserNameOrMobile(username.val(),"user_name");
	// if(!isUserNameFlag){
	// 	return;
	// }
	checkUserNameOrMobile(phone.val(),"mobile_phone");
	if(!isMobileFlag){
		return;
	}
	if(smsCode.val()==""){
		layer.tips("短信验证码不能为空",smsCode);
		return;
	}
	if(!$("#check-sign").is(":checked")){
		layer.tips("请先勾选用户协议",$(".agreement-title"));
		return;
	}
	register();
});
//协议确认
$("body").on("click","#sign-btn .next-btn",function(){
	$("#check-sign").prop("checked",true);
	layer.closeAll();
});
//选中显示 用户协议文本
$("#check-sign").on("change",function(){
	if($(this).is(":checked")){
		//页面层
		layer.open({
		  type: 1,
		  title :"海豚用户注册协议",
		  skin: 'layui-layer-rim', //加上边框
		  area: ['947px', '596px'], //宽高
		  content: $("#sign-content").html()
		});
	}
});

//选中显示 用户协议文本
$(".agreement-title").on("click",function(){
	//页面层
	layer.open({
	  type: 1,
	  title :"海豚用户注册协议",
	  skin: 'layui-layer-rim', //加上边框
	  area: ['947px', '596px'], //宽高
	  content: $("#sign-content").html()
	});
});

/**
  *验证用户名是否合法
  */
function isLegalName(name,item){
	if(!$.string.isCnAndEnNumeric(name)){
		layer.tips("不合法用户名！",item);
		return false;
	}
	return true;
}

/**
  *验证两次密码输入是否一致
  */
function confirmPwd(pwd,confirmPwd,item){
	if(!confirmPwd){
		layer.tips("确认密码不能为空！",item);
		return false;
	}

	if(pwd!=confirmPwd){
		layer.tips("两次密码请输入一致！",item);
		return false;
	}
	return true;
}

/**
  *验证手机格式是否正确
  */
function isPhone(phoneNum,item){
	if(!$.string.isMobile(phoneNum)){
		layer.tips("手机格式不正确！",item);
		return false;
	}
	return true;
}

//检查用户名/手机号是否存在 
function checkUserNameOrMobile(info,type){
	var checkUserInfoCall = function(results){
		if(results.code=="0X0000"){
			//type user_name:用户名称 mobile_phone：手机号码
			if(type=="user_name"){
				isUserNameFlag = true;
			}else{
				isMobileFlag = true;
			}
		}else{
			if(type=="user_name"){
				isUserNameFlag = false;
			}else{
				isMobileFlag = false;
			}
			layer.alert(results.message, {icon: 6});
		}
	};
	htService.checkUserInfo(checkUserInfoCall,info,type);
}
//发送短信验证码
function sendSms(){
	var mobile = phone.val();
	var code = yzmCode.val();
	var type = "register";//注册类型
	var sendSmsCall = function(results){
		if(results.code=="0X0000"){
			smsCodeInter();
		}else{
			//加载验证码图片
			$.captchaBase64(".image-code img");
			layer.alert(results.message, {icon: 6});
		}
	};
	htService.sendSms(sendSmsCall,mobile,type,code);
}
//注册
function register(){
	// var name = username.val();
	var pwd = password.val();
	var mobile = phone.val();
	var code = smsCode.val();

	var registerCall = function(results){
		if(results.code=="0X0000"){
			layer.alert('恭喜注册成功,马上去登录！', 
				{skin: 'layui-layer-red-1',closeBtn: 0,anim: 4},
				function(){
					$.redirect("index/login");
				}
			);
		}else{
			layer.alert(results.message, {icon: 6});
		}
	};
	htService.register(registerCall,pwd,mobile,code,"website");
}

function smsCodeInter(){
	var s = 0;
	var countdown = setInterval(function(){
		if(s==120){
			clearInterval(countdown);
			$(".sms-code-btn").html("获取验证码");
			isSendSms = true;
		}else{
			isSendSms = false;
			$(".sms-code-btn").html((120-s)+"s后重新获取");
		}
		++s;
	},1000)
}