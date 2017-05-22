//用户名
var userName = $("input[name='username']");
//登录密码
var passWord = $("input[name='password']");

var submit = $("#J_SubmitStatic");

var htService = $.htService;

var loginName = $.getStorage("loginName");
var loginPwd = $.getStorage("loginPwd");

var userNameList = $("#userNameList");


if($.string.isNotEmpty(loginName) && $.string.isNotEmpty(loginPwd)){
	userName.val(loginName);
	passWord.val(Base64.decode(loginPwd));
	$("input[name=user_faith]").prop("checked",true);
}

$("input[type=password]").keydown(function(e){ 
	var curKey = e.which; 
	if(curKey == 13){ 
	submit.click(); 
	return false; 
	} 
}); 
//登录
var userLoginIdlistArr = []; // 初始化一个空数组 用来存放 用户登录过的账号
submit.on("click",function(){
	var nameVal = userName.val();
	var pwdVal = passWord.val();
	if( $.getStorage("userLoginIdlist") ){ //如果有这个storag
		userLoginIdlistArr = JSON.parse($.getStorage("userLoginIdlist")); //就把它取出来赋值给userLoginIdlistArr
	}
	if(!nameVal){
		layer.tips("用户名不能为空！",userName);
		return;
	}
	if(!pwdVal){
		layer.tips("密码不能为空！",passWord);
		return;
	}
	if(pwdVal.length<6){
		layer.tips("密码长度不能低于6位数！",passWord);
		return;
	}
	
	
	
	//登录回调函数
	var loginCall = function(results){
		if(results.code=="0X0000"){
			var  loginval=$(".login-text").val();
			var  isInArrFlag = false; // 声明一个判断当前登录账号是否已经存入了数组和storage的flag  如果当前登录账号已经存入了 则为true
			if(nameVal){
				var len = userLoginIdlistArr.length;   // 用户登录过的数组长度
				var userJson = {
								"username":nameVal,
								"userpwd":Base64.encode(pwdVal)
								};
				if(len == 0|| typeof len == 'undefined'){  // 如果数组长度为0 说明数组为空 直接存入
					userLoginIdlistArr.push(userJson);
				} else {
					for( var i=0; i<len; i++ ){
						if(userLoginIdlistArr[i].username == loginval){// 循环遍历存入了账号的数组 如果里面有跟当前账号相同的 证明当前登录的账号之前已经存入过
							isInArrFlag = true;
							break;
						}
					}
					if(!isInArrFlag){
						userLoginIdlistArr.push(userJson);
					}
				}
				$.setLocalStorage("userLoginIdlist",JSON.stringify(userLoginIdlistArr));
			}
			//判断是否自动登陆
			if($("input[name=user_faith]").is(":checked")){
				$.setLocalStorage("loginName",userName.val());
				$.setLocalStorage("loginPwd",Base64.encode(passWord.val()));
			}else{
				$.removeStorage("loginName");
				$.removeStorage("loginPwd");
				$.removeStorage("payinfo");
			}
			$("#J_Message .error").html("").hide();
			var data = results.data;
			var strData = JSON.stringify(data);
			//用户信息存储cookie
			$.setSessionStorage("userInfo",strData);
			var returnUrl = $.getQueryString('return_url');
			if($.string.isEmpty(returnUrl))
				$.redirect("Index/index");
			else
				window.location.href = $.Base64.decode(returnUrl);
		}else{
			passWord.val("");
			$("#J_Message .error").html(results.message).show();
		}
	}
	htService.login(loginCall,nameVal,pwdVal);
});

// 监听登录框keyup事件
userName.keyup(function(){
	var userlogin = $.getStorage("userLoginIdlist");
	if(userlogin){ //如果有这个storage
		userLoginIdlistArr = JSON.parse(userlogin); //就把它取出来赋值给userLoginIdlistArr
		var nameInput = userName.val(); // 用户当前输入的
		var insertVal = "";
		var isShowNameList = false;
		for(var i=0,len=userLoginIdlistArr.length; i<len; i++){
			var name = userLoginIdlistArr[i].username;
			var pwd = userLoginIdlistArr[i].userpwd;
			if( name.indexOf(nameInput) != -1 ){ // 循环遍历 userLoginIdlistArr 查询 nameInput 是否在userLoginIdlistArr中 如果不在返回-1
				// userLoginIdlistArr[i].indexOf(nameInput) != -1 证明当前输入的值在 userLoginIdlistArr[i] 中匹配到了 把它的账号全称( userLoginIdlistArr[i] )取出来
				insertVal += "<li><span userpwd="+ pwd +" class='inertUsername'>"+name+"</span><span class='del'>X</span></li>";   // 这个值就是匹配到的值 需要dom操作插入到你的下拉菜单中去
				isShowNameList = true;
			}
		}
		if(isShowNameList)userNameList.html(insertVal).show();
		else userNameList.hide();
	}
})
//li绑定事件点击选中	
$("#userNameList").on("click",".inertUsername",function(){
	userName.val($(this).text());
	passWord.val(Base64.decode($(this).attr("userpwd")));
	$("#userNameList").hide();
});

// 删除
$("#userNameList").on("click",".del",function(){
	var userlogin = $.getStorage("userLoginIdlist");
	var curUsername = $(this).siblings().text();
	userLoginIdlistArr = JSON.parse(userlogin);
	for(var i=0,len=userLoginIdlistArr.length; i<len; i++){
			if( curUsername == userLoginIdlistArr[i].username ){ 
				userLoginIdlistArr.splice(i,1);break;
			}
		}
	$.setLocalStorage("userLoginIdlist",JSON.stringify(userLoginIdlistArr));
	$(this).closest("li").remove();
})

userName.on("blur",function(e){
	setTimeout(function(){
		userNameList.hide();
	},500);
});

//免费注册
$("#J_RegisterLink1").on("click",function(){
	$.redirect("register");
});

//忘记密码
$("#forget-pw-safe").on("click",function(){
	$.redirect("index/rejectPwd",null,"_bank");
});
