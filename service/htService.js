/**
  * name:海豚所有ajax请求服务
  * author:lhc
  */
var jquery = $;

function htService(){};

/** 登录 **/
htService.prototype.login = function(call,username,password) {
	var paramMap = {}
	paramMap["url"] = "user/login";
	paramMap["user_name"] = username;
	paramMap["password"] = password;
	paramMap["type"] = 'website';
	$.request(paramMap,call,true,false,"正在登录");
};


/** 测试 **/
htService.prototype.test = function(call, param){
	var paramMap = {}
	paramMap["url"] = "index/test";
	paramMap["param"] = param;
	$.requestHome(paramMap,call,true,false,"测试中,请稍后...");
};
//实例化 htService请求服务对象
var htService = new htService();
var service = {
	"htService":htService
};
jquery.extend(service);