/**
  * name:字符串工具类
  * author:lhc
  */
var $ = jQuery;
/**
 * 定义$.string的命名空间
 */
$.extend({string:{}});
/**
 * 定义$.string命名空间里面的方法
 */
$.extend($.string,{
	/**
	 * 功能：判断字符串是否为空,空格也算空
	 * 参数：str:需要判断的字符串
	 * 返回: true,false
	 */
	isEmpty : function(str){
		return (typeof(str) == "undefined" || str == null || $.trim(str) == "" || $.trim(str) == "undefined" || $.trim(str) == "null");
	},
	/**
	 * 功能：判断字符串是否是非空
	 * 参数：str:需要判断的字符串
	 * 返回: true,false
	 */
	isNotEmpty : function(str){
		return !$.string.isEmpty(str);
	},
	/**
	 * 功能：生成num位数的随机码
	 * 参数: num:随机码的位数
	 * 返回：生成的随机码
	 */
	random : function(num){
		var checkCode = "";
		for (var i=0; i < num; i ++){
			var ran = Math.random();
			number = Math.round(ran * 10000);
			if (number % 2 === 0){
				code = String.fromCharCode(48 + (number % 10));
			}else{
				code = String.fromCharCode(65 + (number % 26));
			}
			checkCode += code;
		}
		return checkCode;
	},
	/**
	 * 功能:全部替换字符
	 * 参数:source:原字符串
	 *      oldStr:需要替换的字符串值
	 *      newStr:用来替换的字符串值
	 * 返回:替换后的新的字符串
	 */ 
	replaceAll : function(source,oldStr,newStr){
		return source.split(oldStr).join(newStr);
	},
	/**
	 * 功能:去掉两边空格(如果入参是undefined,null自动转换为"")
	 * 参数:str:需要操作的字符串
	 * 返回:去掉空格后的字符串
	 */ 
	trim2 : function(str){
		if($.string.isEmpty(str)){
			return "";
		}else{
			return $.trim(str);
		}
	},
	/**
	 * 功能:判断字符串是否以固定值结尾
	 * 参数：source:要判断的字符串值
	 *       str:固定值
	 * 返回:true,false
	 */
	endsWith : function(source,str){
		if($.string.isEmpty(source) || $.string.isEmpty(str)){
			return false;
		}else if(source.length < str.length){
			return false;
		}else if(source.substring(source.length - str.length , source.length) === str){
			return true;
		}else{
			return false;
		}
		return true;
	},
	/**
	 * 功能：判断字符串是否以固定值结尾
	 * 参数：source:要判断的字符串值
	 *       str:固定值
	 * 返回:true,false
	 */
	startWith : function(source,str){
		if($.string.isEmpty(source) || $.string.isEmpty(str)){
			return false;
		}else if(source.length < str.length){
			return false;
		}else if(source.substring(0 , str.length) === str){
			return true;
		}else{
			return false;
		}
		return true;
	},
	/**
	 * 功能:判断字符串是否日期，正确格式为:yyyy-mm-dd或者yyyy/mm/dd
	 * 参数：strValue:要校验的日期字符串
	 * 返回：true,false
	 */
	isDate : function(strValue){
		if($.string.isEmpty(strValue))
			return false;
		var r = strValue.match(/^(\d{4})(-|\/)(\d{2})\2(\d{2})$/); 
		if(r == null)
			return false; 
		var d= new Date(r[1], r[3]-1, r[4]); 
		return ((d.getFullYear() == r[1]) && ((d.getMonth() + 1) == r[3]) && (d.getDate() == r[4]));
	},
	/**
	 * 功能：判断是否长时间，形如 (2003-12-05 13:04:06)
	 * 参数：str:要校验的日期字符串
	 * 返回: true,false
	 */
	isDateTime : function(str){
		var reg = /^(\d{4})(-|\/)(\d{2})\2(\d{2}) (\d{2}):(\d{2}):(\d{2})$/; 
		var r = str.match(reg); 
		if(r == null) 
			return false; 
		var d= new Date(r[1], r[3]-1,r[4],r[5],r[6],r[7]); 
		return ((d.getFullYear() == r[1]) && ((d.getMonth() + 1) == r[3]) && (d.getDate() == r[4]) && (d.getHours() == r[5]) && (d.getMinutes() == r[6]) && (d.getSeconds() == r[7]));
	},
	/**
	 * 功能：判断字符串是否为字母或数字
	 * 参数：strValue:要校验的字符串
	 * 返回：true,false
	 */
	isAlphaNumeric : function(strValue){
		if($.string.isEmpty(strValue))
			return false;
	    // 只能是 A-Z a-z 0-9 之间的字母数字 或者为空
		var pattern = /^[A-Za-z0-9]+$/;
	    return $.executeExp(pattern, strValue);
	},
	/**
	* 功能:判断是否为中文、英文、字母或_
	* 参数：strValue:要校验的字符串
	* 返回: true,false
	*/
	isCnAndEnNumeric : function(strValue){
		var pattern = /^[_0-9a-zA-Z\u4e00-\u9fa5]+$/;  
		return $.executeExp(pattern, strValue);
	},
	/**
	* 功能:判断是否为英文、字母或_
	* 参数：strValue:要校验的字符串
	* 返回: true,false
	*/
	isEnNumeric : function(strValue){
		var pattern = /^[_0-9a-zA-Z]+$/;  
		return $.executeExp(pattern, strValue);
	},
	/**
	 * 功能:判断是否为中文
	 * 参数： strValue:要校验的字符串 
	 * 返回: true,false
	 */
	isCnAndEn : function(strValue){
		if ($.string.isEmpty(strValue))
			return false;
		var pattern = /^[\u4e00-\u9fa5]+$/;
		return $.executeExp(pattern, strValue);
	},
	/**
	 * 功能:判断是否是正确的Email
	 * 参数： strValue:要校验的字符串
	 * 返回：true,false
	 */
	isEmail : function(strValue){
		if($.string.isEmpty(strValue))
			return false;
	    var pattern = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	    return $.executeExp(pattern, strValue);
	},
	/**
	 * 功能:判断是否是货币
	 * 参数： strValue:要校验的字符串
	 * 返回: true,false
	 */
	isMoney : function(strValue){
		if($.string.isEmpty(strValue))
			return false;
		var pattern = /^[+-]?\d+(,\d{3})*(\.\d+)?$/;
	    return $.executeExp(pattern, strValue);
	},
	/**
	 * 功能：判断是否为数字
	 * 参数: strValue:要校验的字符串
	 * 返回: true,false
	 */
	isNumeric : function(strValue){
		if ($.string.isEmpty(strValue))
			return false;
		var pattern = /^[0-9]*$/;
	    return $.executeExp(pattern, strValue);
	},
	/**
	 * 功能:判断是否为浮点数（不带正负号）
	 * 参数： strValue：要校验的字符串
	 * 返回: true,false
	 */
	isNumberFloat : function(strValue){
		if ($.string.isEmpty(strValue)) 
			return false;
		var pattern = /^\d+(\.\d+)?$/;
	    return $.executeExp(pattern, strValue);
	},
	/**
	 * 功能：判断是否为手机号码
	 * 参数： strValue：要校验的字符串
	 * 返回: true,false
	 */
	isMobile : function(strValue){
		if ($.string.isEmpty(strValue))
			return false;
		var pattern = /^(1)[0-9]{10}$/;
	    return $.executeExp(pattern, strValue);
	},
	/**
	 * 功能：判断是否为电话
	 * 参数： strValue：要校验的字符串
	 * 返回: true,false
	 */
	isPhone : function(strValue){
		if ($.string.isEmpty(strValue)) 
			return false;
		var pattern = /(^\(\d{3,5}\)\d{6,8}(-\d{2,8})?$)|(^\d+-\d+$)|(^(1)[0-9]{10}$)/;
	    return $.executeExp(pattern, strValue );
	},
	/**
	 * 功能：判断是否为固话
	 * 参数： strValue：要校验的字符串
	 * 返回: true,false
	 */
	isTel : function(strValue){
		if ($.string.isEmpty(strValue)) 
			return false;
		var pattern = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
	    return $.executeExp(pattern, strValue );
	},
	/**
	 * 功能：判断是否为邮政编码
	 * 参数： strValue：要校验的字符串
	 * 返回: true,false
	 */
	isPostalCode : function(strValue){
		if ($.string.isEmpty(strValue)) 
			return false;
		var pattern = /(^\d{6}$)/;
	   	return $.executeExp(pattern, strValue);
	},
	/**
	 * 功能：判断是否为合法的URL
	 * 参数： strValue：要校验的字符串
	 * 返回: true,false
	 */
	isURL : function(strValue){
		if ($.string.isEmpty(strValue)) 
			return false;
	    var pattern = /^(http|https|ftp):\/\/(\w+\.)+[a-z]{2,3}(\/\w+)*(\/\w+\.\w+)*(\?\w+=\w*(&\w+=\w*)*)*/;
	    return $.executeExp(pattern, strValue);
	},
	/**
	 * 功能：字符串转成数字
	 * 参数： strValue：要转换的字符串
	 * 返回: 结果
	 */
    strToInt : function (strValue){
    	while(strValue.length > 1 && $.string.startWith(strValue,"0")){
    		strValue = strValue.substring(1,strValue.length);
    	}
    	return parseInt(strValue);
    },
	/**
	 * 功能:验证身份证的有效性
	 * 参数： strValue：要校验的字符串
	 * 返回: true,false
	 */
	isCardID : function(strValue){
		if($.string.isEmpty(strValue)){
			return false;	
		}
		var vcity = { 11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
				21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",
				33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",
				42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",
				51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",
				63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
		//校验长度，类型,身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
		var pattern = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
		if($.executeExp(pattern, strValue) === false){
			return false;
		}
		//检查省份
		var province = strValue.substr(0,2);
		if(vcity[province] == undefined){
		    return false;
		}
		//校验生日
		var len = strValue.length;
		//身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
		if(len == 15){
			var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
			var arr_data = strValue.match(re_fifteen);
			var year = $.string.strToInt('19' + arr_data[2]);
			var month = $.string.strToInt(arr_data[3]);
			var day = $.string.strToInt(arr_data[4]);
			var birthday = new Date('19'+year+'/'+month+'/'+day);
			//var birthday = new Date();
			birthday.setFullYear(year);
			birthday.setMonth(month - 1);
			birthday.setDate(day);
			var now = new Date();
			var now_year = now.getFullYear();
			//年月日是否合理
			if(birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day){
				//判断年份的范围（3岁到100岁之间)
				var time = now_year - year;
				if(!(time >= 3 && time <= 100)){
					return false;
				}
			}else{
				return false;
			}
		}
		//身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
		if(len == 18){
			var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
			var arr_data = strValue.match(re_eighteen);
			var year = $.string.strToInt(arr_data[2]);
			var month = $.string.strToInt(arr_data[3]);
			var day = $.string.strToInt(arr_data[4]);
			var birthday = new Date(year+'/'+month+'/'+day);
			//var birthday = new Date();
			birthday.setFullYear(year);
			birthday.setMonth(month - 1);
			birthday.setDate(day);
			var now = new Date();
			var now_year = now.getFullYear();
			//年月日是否合理
			if(birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day){
				//判断年份的范围（3岁到100岁之间)
				var time = now_year - year;
				if(!(time >= 3 && time <= 100)){
					return false;
				}
			}else{
				return false;
			}
		}
		//检验位的检测
		//15位转18位
		if(strValue.length == 15){
		   var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
		   var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
		   var cardTemp = 0, i;
		   strValue = strValue.substr(0, 6) + '19' + strValue.substr(6, strValue.length - 6);
		   for(i = 0; i < 17; i ++){
			   cardTemp += strValue.substr(i, 1) * arrInt[i];
		   }
		   strValue += arrCh[cardTemp % 11];
		}
		if(strValue.length == 18){
		    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
		    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
		    var cardTemp = 0, i, valnum;
		    for(i = 0; i < 17; i ++){
		    	cardTemp += parseInt(strValue.substr(i, 1)) * arrInt[i];
		    }
		    valnum = arrCh[cardTemp % 11];
		    if (!(valnum == strValue.substr(17, 1))){
		       return false;
		    }
		}
		return true;
	},
	/**
	 * 功能:判断是否为6位数字密码
	 * 参数 strValue
	 */
	isPwd : function (strValue){
		if ($.string.isEmpty(strValue)) 
			return false;
		var pattern = /^[0-9]{6}$/;
		return $.executeExp(pattern, strValue);
	},
	/**
	 * 功能:判断是否为6位数字强密码
	 * 参数 strValue : 需要检验的密码字符串
	 *      filter ： 要过滤数组,数组中的每一项都不能包含当前的密码串，否则认为密码为弱密码，比如可以用身份证，手机等校验
	 */
	isStrongPwd : function(strValue,filters){
		if (!/^\d{6}$/.test(strValue)) return false; // 不是6位数字
		if (/([\d])\1{2}/.test(strValue)) return false;  // 3个一样
		var str = strValue.replace(/\d/g, function($0, pos) {
			return parseInt($0)-pos;
		});
		if (/^(\d)\1+$/.test(str)) return false;  // 顺增
		str = strValue.replace(/\d/g, function($0, pos) {
			return parseInt($0)+pos;
		});
		if (/^(\d)\1+$/.test(str)) return false;  // 顺减
		var temp = "";
		for(var i = 0; i < strValue.length; i ++){
			var c = strValue.charAt(i);
			if(temp.indexOf(c) == -1){
				temp += c;
			}
		}
		if(temp.length <= 2) return false;
		var flag = true;
		var map = {};
		for(var i = 0; i < strValue.length; i ++){
			var c = strValue.charAt(i);
			if($.string.isEmpty(map[c])){
				map[c] = 0;
			}
			map[c] = (map[c] + 1);
			if(map[c] >= (strValue.length/2)){
				flag = false;
			}
		}
		if(flag == false){
			return false;
		}
		if(filters && filters.length > 0){
			for(var i = 0; i < filters.length; i ++){
				var filter = filters[i];
				if(filter.indexOf(strValue) > -1){
					return false;
				}
			}
		}
		return true;
	},
	/**
	 * 功能:判断是否为银行卡号(银行卡号Luhm校验)
	 *      Luhm校验规则：16位银行卡号（19位通用）:
		    1.将未带校验位的 15（或18）位卡号从右依次编号 1 到 15（18），位于奇数位号上的数字乘以 2。
		    2.将奇位乘积的个十位全部相加，再加上所有偶数位上的数字。
		    3.将加法和加上校验位能被 10 整除。
	 * 参数： strValue：需要检验的银行卡字符串
	 */
	isBankCode : function(strValue){
		strValue = $.trim(strValue);
		if(!$.string.isNumeric(strValue)){
			return false;
		}
		var length = strValue.length;
		if (length < 12) {
			return false;
		}else if (length > 19 || length == 18) {
			return true;
		}
		var flag = true;
		var iRet = 0,i = 0,mark = 0,temp = 0;
		while(i < (length - 1)){
			mark += parseInt(strValue.charAt(i));
		    i ++;
		    temp = parseInt(strValue.charAt(i)) * 2;
		    i ++;
		    mark = Math.floor(temp / 10) + temp % 10;
		}
		if(mark % 10 == 0){
			flag = true;
		}else{
			flag = parseInt(strValue.charAt(length - 1)) == (10 - mark % 10);
		}
		if(!flag){
			//开头6位
//				var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,63,65,68,69,84,87,88,90,91,92,93,94,95,96,97,98,99";
//				if (strBin.indexOf(strValue.substring(0, 2)) == -1) {
//					return false;
//				}
			var lastNum = strValue.substr(strValue.length - 1, 1);    //取出最后一位（与luhm进行比较）
			var first15Num = strValue.substr(0, strValue.length - 1); //前15或18位
			var newArr = [];
			for ( var i = first15Num.length - 1; i > -1; i --) { //前15或18位倒序存进数组
				newArr.push(first15Num.substr(i, 1));
			}
			var arrJiShu = []; //奇数位*2的积 <9
			var arrJiShu2 = []; //奇数位*2的积 >9
			var arrOuShu = []; //偶数位数组
			for ( var j = 0; j < newArr.length; j++) {
				if ((j + 1) % 2 == 1) {//奇数位
					if (parseInt(newArr[j]) * 2 < 9)
						arrJiShu.push(parseInt(newArr[j]) * 2);
					else
						arrJiShu2.push(parseInt(newArr[j]) * 2);
				} else
					//偶数位
					arrOuShu.push(newArr[j]);
			}
			var jishu_child1 = [];//奇数位*2 >9 的分割之后的数组个位数
			var jishu_child2 = [];//奇数位*2 >9 的分割之后的数组十位数
			for ( var h = 0; h < arrJiShu2.length; h++) {
				jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
				jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
			}
			var sumJiShu = 0; //奇数位*2 < 9 的数组之和
			var sumOuShu = 0; //偶数位数组之和
			var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
			var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
			var sumTotal = 0;
			for ( var m = 0; m < arrJiShu.length; m++) {
				sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
			}
			for ( var n = 0; n < arrOuShu.length; n++) {
				sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
			}
			for ( var p = 0; p < jishu_child1.length; p++) {
				sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
				sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
			}
			//计算总和
			sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu)
					+ parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);
			//计算Luhm值
			var k = parseInt(sumTotal) % 10 == 0 ? 10
					: parseInt(sumTotal) % 10;
			var luhm = 10 - k;
			flag = (lastNum == luhm || luhm % lastNum == 0 || lastNum % luhm == 0 );
		}
		return flag;
	},
     /**
	  * 生成标准连接
	  * @param string url 地址
	  * @param string | object arg 参数
	  * @returns
	  */
 	urlArgs : function (url,arg){
	    if(typeof arg == 'string'){
	        var exArr = arg.split('&');
	        var strArr = {};
	        for(var i=0;i<exArr.length;i++){
	            var exArrTmp = exArr[i].split('=');
	            if(exArrTmp.length == 2){
	                if(exArrTmp[0].length > 0)
	                    strArr[exArrTmp[0]] = exArrTmp[1];
	            }
	        }
	        return urlArgs(url,strArr);
	    }else if(typeof arg == 'object' && !$.isArray(arg)){
	        var firstF = '?';
	        if(url.indexOf('?') >= 0){
	            firstF = '&';
	        }
	        for(var i in arg){
	            url += firstF + i + '=' + arg[i];
	            if(firstF != '&') firstF = '&';
	        }
	        return url;
	    }else{
	        return url;
	    }
	},
	loadImage : function(page_id){
		var page_id = page_id === "" || page_id === null || typeof page_id =="undefined" ? "body":page_id;
		$(page_id+' img.lazy').lazyload({
           appear:function(){
               var $this=$(this);
               $this.after('<span class="lazy-bg"></span>').parent().css('position','relative');
           },
           load:function(){
           		$(this).nextAll('.lazy-bg').remove();
           }

       });
	}
});


/**
 * 定义$.valida的命名空间
 */
$.extend({valida:{}});
/**
 * 定义$.valida命名空间里面的方法
 */
$.extend($.valida,{
	/**
	  *验证密码是否合法
	  */
	isLegalPwd : function(pwd,item){
		var reg = /^[\x21-\x7E]{6,20}$/;
		if(!reg.test(pwd)){
			layer.tips("密码格式不正确！",item);
			return false;
		}
		return true;
	},
	//销售订单：状态转换
	sellOrderStatus : function(sellOrderStatus){
		sellOrderStatus = sellOrderStatus+"";//parseInt(sellOrderStatus);
		var orderStatusName = "";
		switch(sellOrderStatus){
			case "1" : 
				orderStatusName = "缺货采购";
				break;
			case "2" : 
				orderStatusName = "待通知发货";
				break;
			case "3" : 
				orderStatusName = "待收货";
				break;
			case "SALES_ORDER_STATUS_CREATE" : 
				orderStatusName = "新建";
				break;
			case "SALES_ORDER_STATUS_NOTIFY_FAIL" : 
				orderStatusName = "通知发货失败";
				break;
			case "SALES_ORDER_STATUS_NOTIFY" : 
				orderStatusName = "通知发货处理中";
				break;
			case "SALES_ORDER_STATUS_NOTIFY_SUCCESS" : 
				orderStatusName = "通知发货成功";
				break;
			case "SALES_ORDER_STATUS_SYNC_ERP" : 
				orderStatusName = "已推送到 ERP";
				break;
			case "SALES_ORDER_STATUS_SHIPPED" : 
				orderStatusName = "已发货";
				break;
			case "SALES_ORDER_STATUS_RECEIVED" : 
				orderStatusName = "已收货";
				break;
			case "SALES_ORDER_STATUS_CANCELLED" : 
				orderStatusName = "已取消";
				break;
			case "SALES_ORDER_STATUS_RETURN_GOODS" :
				orderStatusName = "已取消";
				break;
			default:; 
		}
		return orderStatusName;
	},
	//采购订单状态
	purchaseOrderStatus : function(purchaseOrderStatus){
		var orderStatusName = "";
		switch(purchaseOrderStatus){
			case "PURCHASE_ORDER_STATUS_CREATE" : 
				orderStatusName = "待付款";
				break;
			case "PURCHASE_ORDER_STATUS_PAID" : 
				orderStatusName = "已付款";
				break;
			case "PURCHASE_ORDER_STATUS_CANCELLED" : 
				orderStatusName = "已取消";
				break;
			case "PURCHASE_ORDER_STATUS_ABORTED" : 
				orderStatusName = "已失效";
				break;
			default:; 
		}
		return orderStatusName;
	},
	//我的订单状态
	myOrderStatus : function(myOrderStatus){
		var orderStatusName = "";
		switch(myOrderStatus){
			case "self_need_pay":
				orderStatusName = "待付款";
				break;
			case "self_need_delivery":
				orderStatusName = "待发货";
				break;
			case "shipped":
				orderStatusName = "待收货";
				break;
			case "cancel":
				orderStatusName = "已取消";
				break;
			case "finished":
				orderStatusName = "已完成";
				break;
			case "return":
				orderStatusName = "退货退款";
				break;
			default:; 
		}
		return orderStatusName;
	}
});


/**
 * 定义$.config的命名空间
 */
$.extend({config:{}});
/**
 * 定义$.config命名空间里面的方法
 */
 var cart = {
 	operation:{
 		add:"add",
 		sub:"sub",
 		set:"set",
 		del:"del"
 	}
 };
$.extend($.config,{
	"cart" : cart
});
