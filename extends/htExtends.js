/**
  * name:JS拓展工具类
  * author:lhc
  */
var jquery = $;

var htService = $.htService;

var operation = $.config.cart.operation;

var outHtml = "";

var apiUrl = "Api/api";
// var hostUrl = //"http://localhost/haitun/api.php/";
var ext = {
	/**
	 * 功能:封装ajax公共请求方法
	 * 参数：param:入参包括URL
	 *      callback:执行成功回调函数
	 *		isLoad：是否显示加载层
	 *		isAsync：是否异步
	 *		title：加载层提示信息
     *      netMethod: 请求方式  
	 */
	request : function(param,callback,isLoad,isAsync,title,netMethod){
	    var isAsync = (typeof(isAsync) == "undefined" || isAsync === null || isAsync === "") ? true : isAsync;
	    var title = (typeof(title) == "undefined" || title === null || title === "") ? "正在请求数据":title;
	    var netMethod = (typeof(netMethod) == "undefined" || netMethod === null || netMethod === "") ? "post" : netMethod;;
        
        var url = $.homeU(apiUrl, [], false);
        var requestParam = {};
        requestParam['type'] = netMethod;
        requestParam['url'] = param["url"];
        delete param["url"];
        requestParam['data'] = param;
        // requestParam['PHPSESSID'] = $.getStorage("PHPSESSID");

	    var option = {
	        url: url,//url,
	        data: requestParam,
	        type: netMethod,
	        dataType: "json",
	        async: isAsync,
            beforeSend: function(XMLHttpRequest) {
                if(isLoad)layer.msg(title, {icon: 16,shade: 0.01});
            },
	        success: function(data, textStatus,XMLHttpRequest) {
	        	if(isLoad)layer.closeAll();
                if(data.code=="0X0004"){
                    // layer.alert('请先登陆！', {
                    //   skin: 'layui-layer-moon',closeBtn: 0
                    // }, function(){
                    //   $.redirect("index/login",{"return_url": $.Base64.encode(window.location.href)});
                    // });
                    $.redirect("index/login",{"return_url": $.Base64.encode(window.location.href)});
                    return;
                }
	            callback(data);
	        },
	        complete: function(XMLHttpRequest, textStatus) {
                // alert("complete");
	        },
	        //abort会执行error方法
	        error: function(XMLHttpRequest, textStatus, errorThrown) {
                // alert("error");
	        }
	    };
	    $.ajax(option);
	},
    /**
     * 功能:封装ajax公共请求方法
     * 参数：param:入参包括URL
     *      callback:执行成功回调函数
     *      isLoad：是否显示加载层
     *      isAsync：是否异步
     *      title：加载层提示信息
     */
    requestHome : function(param,callback,isLoad,isAsync,title){
        var isAsync = (typeof(isAsync) == "undefined" || isAsync === null || isAsync === "") ? true : isAsync;
        var title = (typeof(title) == "undefined" || title === null || title === "") ? "正在请求数据":title;
        var url = $.homeU(param.url, [], false);
        delete param["url"];
        //添加callback参数 解决火狐 47版本以下 发不出网络请求兼容问题
        // param['callback'] = '?';
        var option = {
            url: url,//url,
            data: param,
            type: "post",
            dataType: "json",
            // xhrFields: {
            //     withCredentials: true
            // },
            // crossDomain: true,
            async: isAsync,
            beforeSend: function(XMLHttpRequest) {
                XMLHttpRequest.withCredentials = true;
                if(isLoad)layer.msg(title, {icon: 16,shade: 0.01});
            },
            success: function(data, textStatus,XMLHttpRequest) {
                if(isLoad)layer.closeAll();
                if(data.code=="0X0004"){
                    layer.alert('请先登陆！', {
                      skin: 'layui-layer-moon',closeBtn: 0
                    }, function(){
                      $.redirect("index/login",{"return_url": $.Base64.encode(window.location.href)});
                    });
                    return;
                }
                callback(data);
            },
            complete: function(XMLHttpRequest, textStatus) {
                alert("complete");
            },
            //abort会执行error方法
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("error");
            }
        };
        $.ajax(option);
    },
	/**
	 * 功能:设置session级别的cookie值
	 * 参数：key:cookie的名称
	 *      value:cookie的值
	 */
	setSessionStorage : function(key,value){
		$.cookie(key, encodeURI(value),{path: '/',secure: ''});
	},
	/**
	 * 功能:设置local级别的cookie值(持久化存储)
	 * 参数：key:cookie的名称
	 *      value:cookie的值
	 */
	setLocalStorage : function(key,value){
		$.cookie(key, encodeURI(value),{ expires: 360, path: '/',secure: ''});
	},
	/**
	 * 功能：获取cookie值
	 * 参数： key：cookie的名称
	 * 返回:  cookie的值
	 */
	getStorage : function(key){
		var value = $.cookie(key);
		if($.string.isEmpty(value)){
			value = "";
		}
		return decodeURI(value);
	},
	/**
	 * 功能：删除cookie值
	 * 参数： key：cookie的名称
	 * 返回:  cookie的值
	 */
	removeStorage : function(key){
		$.cookie(key, '',{path: '/',secure: '',expires: -1});
	},
	/**
	 * 功能:删除所有的cookie
	 */
	clearStorage : function(){
		$.clearCookie();
	},
	/**
     * 功能:对象转换成字符串
     * 参数:obj:要转换的对象 
     *      split0:第一层分割符号  ,
     *      split1:第二层分隔符    =
     * 返回：转换后的字符串 name=liubao,age=20,lover=xiaozhu
     */
    objectToString : function(obj,split0,split1){
    	var result = [];
        if(obj != null ){
            for(var key in obj){
            	var value = obj[key];
            	if($.string.isEmpty(value)){
            		value = "";
            	}
                result.push(key + split1 + value);
            }
        }
        return result.join(split0);
    },
	/**
	 *功能：页面跳转
	 * 参数： pageCode:页面地址code
	 *       jsonParam:页面参数
	 *       target:跳转方式(blank,self)
	 */
	 redirect : function(pageCode,jsonParam,target){
	 	var paramStr = "";
		if(jsonParam){
			paramStr = $.objectToString(jsonParam,"&","=");
		}
		if(paramStr.length > 0){
			paramStr = "?" + paramStr;
		}
		var pageUrl = $.homeU(pageCode) + "" + paramStr;
		if($.string.isEmpty(target) || target == "self"){
			window.location.href = pageUrl;
		}else{
			 window.open(pageUrl);
		}
	 },
	 /**
      * 功能:正则表达式的匹配
      * 参数：pattern:正则表达式
      *      str:校验的值
      * 返回:true,false
      */
     executeExp : function(pattern, str){
    	return pattern.test(str);
     },
     /**
      * 功能:获取cookie中 userInfo信息
      */
     getUserInfo : function(){
     	var userInfo = $.getStorage("userInfo");
     	if($.string.isEmpty(userInfo)){
     		// layer.alert("请先登陆！",{icon:6});
     		return false;
     	}else{
     		return JSON.parse(userInfo);
     	}
     },
     /**
      * 功能:判断是否B端用户
      */
     isUserB : function(){
     	var userInfo = $.getUserInfo();
     	if(!userInfo)
     		return false;
     	else{
     		var type = userInfo["user_type"]
     		if(type){
     			type = parseInt(type);
     			if(type>=0){
     				return true;
     			}else{
     				return false;
     			}
     		}else{
     			return false;
     		}
     	}
     },
     /**
      * 功能:判断是否B端1,2,3高级用户类型  
      */
     isUserVipB : function(){
        var userInfo = $.getUserInfo();
        if(!userInfo)
            return false;
        else{
            var type = userInfo["user_type"]
            if(type){
                type = parseInt(type);
                if(type>0){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }
     },
     /**
      * 功能:判断是否C端用户
      */
     isUserC : function(){
     	var userInfo = $.getUserInfo();
     	if(!userInfo)
     		return false;
     	else{
     		var type = userInfo["user_type"]
     		if(type){
     			type = parseInt(type);
     			if(type<0){
     				return true;
     			}else{
     				return false;
     			}
     		}else{
     			return false;
     		}
     	}
     },
     /**
      *功能：用户是否受数量控制
      */
     isSaleNumber : function(){
        var userInfo = $.getUserInfo();
        if(!userInfo)
            return true;
        else{
            var type = userInfo["is_sale_number_limit"]
            if(type){
                type = parseInt(type);
                if(type==1){
                    return true;
                }else{
                    return false;
                }
            }else{
                return true;
            }
        }
     },
     /**
      * 功能:获取URL参数值
      * 参数：name ：参数名称
      */
     getQueryString : function(name)
	 {
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	 },
     /**
       * 功能:获取地区联级信息
       * 参数：id ：国家ID
       *
       */
    getRegionListById : function(id){
        var regionlist;
        var getRegionLevelCall = function(results){
            if(results.code=="0X0000"){
                regionlist = results.data;
            }else{
                layer.alert(results.message, {icon: 6});
                return false;
            }
        };
        htService.getRegionList(getRegionLevelCall,id);
        return regionlist;
    },
    /** 绑定地区信息地址信息 **/
    getRegionList : function(item,id){
        item.html('<option value="-1">请选择</option>');
        var regionList = $.getRegionListById(id);
        var strHtml = "";
        for(var i=0;i<regionList.length;i++){
            var region = regionList[i];
            strHtml+='<option value="'+region.region_id+'">'+region.region_name+'</option>';
            
        }
        item.append(strHtml);
    },
    //加入收藏
    addSelfCollectGoods : function(goods_id,backCall){
        var setSelfCollectGoodsCall = function(results){
            if(results.code=="0X0000"){
                if(backCall)backCall();
                else{
                    layer.alert("收藏成功!");
                }
            }else{
                layer.alert(results.message,{icon:6});
            }
        };
        htService.setSelfCollectGoods(setSelfCollectGoodsCall,goods_id);
    },
    //图片验证码
    captchaBase64 : function(item){
        var $item  = $(item);
        htService.captchaBase64(function(results){
            if(results.code=="0X0000"){
                var data = results.data;
                $item.attr("src","data:image/jpg;base64,"+data.base64);
            }else{
                layer.alert(results.message,{icon:6});
            }
        });
    }

     /**
      * 功能:获取地区联级信息  有则直接取 持久化存储cookie，没有直接查API
      * 参数：id ：国家ID
      *
      */
   //   getRegionList : function(id){
   //   	//判断cookie 中是否存在 地区信息
   //   	var regionlist = $.getStorage("regionlist");
   //   	if($.string.isNotEmpty(regionlist)){
   //   		return regionlist;
   //   	}
   //   	//不存在则查API
   //   	var getRegionLevelCall = function(results){
   //   		if(results.code=="0X0000"){
   //   			regionlist = results.data;
   //   			regionlist = JSON.stringify(regionlist);
   //   			//地区信息 持久化存储cookie
   //   			$.setLocalStorage("regionlist",regionlist);
			// }else{
			// 	layer.alert(results.message, {icon: 6});
			// }
   //   	};
   //   	htService.getRegionList(getRegionLevelCall,id);
   //   	return regionlist;
   //   }

};

jquery.extend(ext);


//购物车API操作
var cartService = {
	//修改购物车
	modifyCartCall : function(goods_id,number,type,title,backCall,isShow){
        var isShow = (isShow==""||typeof isShow == "undefined")?isShow:true;
        // if(!$.getUserInfo()){
		//     return;
		// }
		function modifyCartCall(results){
			if(results.code=="0X0000"){
				if(backCall)backCall(results);
				if(title&&isShow)layer.msg(title);
			}else{
				layer.alert(results.message,{icon:6});
                if(backCall)backCall(results);
			}
		};
		htService.modifyCart(modifyCartCall,goods_id,number,type);
	}, 
	//加入购物车
	addCart : function(goods_id,number,backCall,isShow){
		$.cartService.modifyCartCall(goods_id,number,operation.add,"加入购物车成功",backCall,isShow)
	},
	//删除购物车
	delCart : function(goods_id,title,backCall){
		$.cartService.modifyCartCall(goods_id,0,operation.del,title,backCall)
	},
	//购物车商品数量减1
	delOne : function(goods_id,backCall,number){
        number = number?number:1;
		$.cartService.modifyCartCall(goods_id,number,operation.sub,"",backCall)
	},
	//购物车商品数量加1
	addOne : function(goods_id,backCall,number){
        number = number?number:1;
		$.cartService.modifyCartCall(goods_id,number,operation.add,"",backCall)
	},
	//设置购物车商品数量
	setCart : function(goods_id,number,backCall){
		$.cartService.modifyCartCall(goods_id,number,operation.set,"",backCall)
	},
    //批量加入购物车 goods_list格式 ：[{"goods_id":1,"quantity":1}]
    batchAddCart : function(goods_list,title,backCall){
        var batchAddCall = function(results){
            if(results.code=="0X0000"){
                if(backCall)backCall();
                if(title)layer.alert(title,{icon:6});
            }else{
                layer.alert(results.message,{icon:6});
            }
        };
        htService.batchAddCart(batchAddCall,goods_list);
    }
};
jquery.extend({"cartService":cartService});

//购物车视图操作
var cartView = {
	//获取购物车商品列表
	getListCart :function(page,page_size){
	    var getListCartCall = function(results){
	        if(results.code=="0X0000"){
	            var data = results.data;
	            var list = data.list;
	            var filter = data.filter;
                setTimeout(function(){
                    $.cartView.updateHtml(list,filter);
                },1000);
	        }else{
	            layer.alert(results.message,{icon:6});
	        }
	    };
	    htService.getListCart(getListCartCall,page,page_size);
	},
	//更新购物车HTML
	updateHtml : function (list,filter){
        $("#cart_load").hide();
	    $(".cartsNum").html(filter.record_count);
        //购物车数量 持久化保存cookie
        $.setLocalStorage("shopcart_count",filter.record_count);
	    if(list.length==0){
	        $("#shopCart #not-produt").show();
	        $("#shopCart #cart-info").hide();
	        $("#shopCart #product-list").html("");
	        return;
	    }
	    var strHtml = "";
	    var totalPrice = 0.00;
	    for(var i=0;i<list.length;i++){
	        var item = list[i];
	        //累计总价
	        totalPrice += parseFloat(item.price)*parseFloat(item.goods_number);
	        strHtml += '<div class="main_M2 cart-product" cart_id="'+item.cart_id+'">'+
	            '<div class="main_21 ">' +
				'<a href="javascript:void(0);" class="goodsdetails" data-sku="'+item.sku+'" target="_blank">'+
				'<img src="'+item.img_thumb+'" /></a></div>'+
	            '<div class="main_22 ">' +
				'<a href="javascript:void(0);" class="goodsdetails" data-sku="'+item.sku+'" target="_blank"><p>'+item.goods_name+'</p></a>'+
	            '<a class="del-cart mainM3" goods_id="'+item.goods_id+'">删除</a><span class="nunmain">×'+item.goods_number+'</span>'+
	            '<div class="main_23"><span>¥'+item.price+'</span><span>¥'+item.market_price+'</span>'+
	            '</div></div></div>';
	    }
	    //保留两位
	    totalPrice = totalPrice.toFixed(2);
	    $("#shopCart #totalPrice").html(totalPrice);
	    $("#shopCart #not-produt").hide();
	    $("#shopCart #cart-info").show();
	    $("#shopCart #product-list").html(strHtml);
	    //删除购物车商品  预绑定
		$("#shopCart").on("click",".del-cart",function(){
		    var goods_id = $(this).attr("goods_id");
		    var delCall = function(){
		        $.cartView.getListCart();
		    }
		    $.cartService.delCart(goods_id,"",delCall);
		});
		$("#to-cart-page").on("click",function(){
			$.redirect("index/shopping");
		});
	}

};
jquery.extend({"cartView":cartView})

/**
  *Base64 加密解密
  */
// private property
var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var Base64 = {
    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = $.Base64._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    },
    // public method for decoding
    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = $.Base64._utf8_decode(output);
        return output;
    },
    // private method for UTF-8 encoding
    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },
    // private method for UTF-8 decoding
    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}
jquery.extend({"Base64":Base64})