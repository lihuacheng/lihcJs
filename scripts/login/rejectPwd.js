//手动清空value的值
$("input[type=text],input[type=password]").val("");
//页面ID 标示
var page_id = $("#page-reject");

var htService = $.htService;
//第一步DIV
var one_step = page_id.find(".one-step");
//第二步DIV
var two_step = page_id.find(".two-step");
//第三步DIV
var three_step = page_id.find(".three-step");
//第四步DIV
var four_step = page_id.find(".four-step");


/**  第一步 start **/
//手机号码
var one_phone = one_step.find("#one-phone");


//下一步
$(".one-step .next-btn").on("click",function(){
	var phone = one_phone.val();
	if(!$.string.isMobile(phone)){
		layer.tips("手机格式不正确！",one_phone);
		return;
	}
	var checkUserInfoCall = function(results){
		if(results.code=="0X0000"){
			//填充第二步数据
			var  sub_phone = phone.substring(0,3)+"****"+phone.substring(8,11);
			one_step.hide();
			checkLi(1);
			two_step.find("#mobile-input").val(phone);
			two_step.find("#mobile-number").html(sub_phone);
			two_step.show();
		}else{
			layer.alert(results.message, {icon: 6});
		}
	};
	htService.checkUserInfo(checkUserInfoCall,phone,"forget_password");
});
/**  第一步 end **/

/**  第二步 start **/

//手机号
var mobile_input = two_step.find("#mobile-input");
//验证码
var two_tp_code = two_step.find("#one-tp-code");
//短信验证码
var sms_code = two_step.find("#sms-code");
//验证码图片
var two_tp_img = two_step.find("#tp-img");

var two_look_no = two_step.find("#look-no");
//是否可以发送短信
var  isSendSms = true;

//加载验证码图片
// two_tp_img.find("img").attr("src",$.apiU("user/captcha")+"?random="+Math.random());
$.captchaBase64("#tp-img img");
//看不清，换一张
two_look_no.on("click",function(){
	// two_tp_img.find("img").attr("src",$.apiU("user/captcha")+"?random="+Math.random());
	$.captchaBase64("#tp-img img");
});
//获取短信验证码
$(".two-step #getSmsCode").on("click",function(){
	//短信验证码 倒计时中 不能发发送短信
	if(!isSendSms){
		return;
	}
	var mobileVal = mobile_input.val();
	var code = two_tp_code.val();
	if($.string.isEmpty(code)){
		layer.tips("验证码不能为空！",two_tp_code);
		return;
	}
	var updPwdSendSmsCall = function(results){
		if(results.code=="0X0000"){
			smsCodeInter();
		}else{
			//加载验证码图片
			// two_tp_img.find("img").attr("src",$.apiU("user/captcha")+"?random="+Math.random());
			$.captchaBase64("#tp-img img");
			layer.alert(results.message, {icon: 6});
		}
	};
	htService.sendSms(updPwdSendSmsCall,mobileVal,"forget_password",code);
});
//下一步
$(".two-step .next-btn").on("click",function(){
	var smsVal = sms_code.val();
	var forgetPasswordValidCall = function(results){
		if(results.code=="0X0000"){
			//填充第三步数据
			two_step.hide();
			checkLi(2);
			three_step.find("#three_sms_code").val(smsVal);
			three_step.show();
		}else{
			layer.alert(results.message, {icon: 6});
		}
	};
	htService.forgetPasswordValid(forgetPasswordValidCall,smsVal);
});
/**  第二步 end **/

/**  第三步 start **/

//新密码
var new_password = three_step.find("#new_password");
//确认新密码
var confirm_new_password = three_step.find("#confirm_new_password");
//验证密码格式
new_password.on("blur",function(){
	var newPwdVal = new_password.val();
	if(!$.valida.isLegalPwd(newPwdVal,new_password)){
		return;
	}
});
//验证两次密码是否输出一致
confirm_new_password.on("blur",function(){
	var newPwdVal = new_password.val();
	var cfNewPwdVal = confirm_new_password.val();
	if(newPwdVal!=cfNewPwdVal){
		layer.tips("两次输入密码不一致！",confirm_new_password);
		return;
	}
});
//下一步
three_step.find(".next-btn").on("click",function(){
	var newPwdVal = new_password.val();
	var cfNewPwdVal = confirm_new_password.val();
	//短语验证码  隐藏文本域
	var threeSmsCode = three_step.find("#three_sms_code").val();
	if(newPwdVal.length<6){
		layer.tips("密码不能小于6位！",new_password);
		return;
	}
	if(newPwdVal.length>20){
		layer.tips("密码不能大于20位！",new_password);
		return;
	}
	var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)]|[\(\)])+$)([^(0-9a-zA-Z)]|[\(\)]|[a-zA-Z]|[0-9]){6,}$/;
	if(!reg.test(newPwdVal)){
		layer.tips("密码至少是数字、字母、符号，任意两种组合以上！",new_password);
		return;
	}
	// if(!$.valida.isLegalPwd(newPwdVal,new_password)){
	// 	return;
	// }
	if(newPwdVal!=cfNewPwdVal){
		layer.tips("两次输入密码不一致！",confirm_new_password);
		return;
	}
	var forgetPasswordCall = function(results){
		if(results.code=="0X0000"){
			three_step.hide();
			checkLi(3);
			four_step.show();
		}else{
			layer.alert(results.message, {icon: 6});
		}
	};
	htService.forgetPassword(forgetPasswordCall,threeSmsCode,newPwdVal);
});
/**  第三步 end **/

/**  第四步 start **/
//去登录
var goLogin = four_step.find("#go-login");
//跳转登录页面
goLogin.on("click",function(){
	$.redirect("index/login")
});

/**  第四步 end **/

/** 进度条 index:li下标 **/
function checkLi(index){
	$(".bar-type li").removeClass("check-li").eq(index).addClass("check-li");
}
/**
  *验证密码是否合法
  */
function isLegalPwd(pwd,item){
	var reg = /^[\x21-\x7E]{6,20}$/;
	if(!reg.test(pwd)){
		layer.tips("密码格式不正确！",item);
		return false;
	}
	return true;
}
//短信验证码倒计时
function smsCodeInter(){
	var s = 0;
	var countdown = setInterval(function(){
		if(s==120){
			clearInterval(countdown);
			$("#getSmsCode").html("获取验证码");
			isSendSms = true;
		}else{
			isSendSms = false;
			$("#getSmsCode").html((120-s)+"s后重新获取");
		}
		++s;
	},1000)
}