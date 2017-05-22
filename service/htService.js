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

/** 检查用户名/手机号是否存在 **/
htService.prototype.checkUserInfo = function(call,info,type){
	var paramMap = {}
	paramMap["url"] = "user/checkUserInfo";
	paramMap["type"] = type;
	paramMap["value"] = info;
	$.request(paramMap,call,true,false);
};

/** 发送图片验证码 **/
htService.prototype.captchaBase64 = function(call){
	var paramMap = {}
	paramMap["url"] = "user/captchaBase64";
	$.request(paramMap,call,false,false,"正在发送...");
};

/** 发送短信验证码 **/
htService.prototype.sendSms = function(call,mobile,type,captcha){
	var paramMap = {}
	paramMap["url"] = "user/sms";
	paramMap["mobile_phone"] = mobile;
	paramMap["type"] = type;
	paramMap["captcha"] = captcha;
	$.request(paramMap,call,true,false,"正在发送...");
};

/** 注册 **/
htService.prototype.register = function(call,password,mobilephone,code,type){
	var paramMap = {}
	paramMap["url"] = "user/register";
	paramMap["password"] = password;
	paramMap["mobile_phone"] = mobilephone;
	paramMap["code"] = code;
	paramMap["type"] = type;
	$.request(paramMap,call,true,false,"正在注册中,请稍后...");
};

/** 忘记密码-第二步 验证短信验证码 **/
htService.prototype.forgetPasswordValid = function(call,code){
	var paramMap = {}
	paramMap["url"] = "user/forgetPasswordValid";
	paramMap["code"] = code;
	$.request(paramMap,call,true,false,"正在验证短信验证码,请稍后...");
};

/** 忘记密码-第三步 修改密码 **/
htService.prototype.forgetPassword = function(call,code,password){
	var paramMap = {}
	paramMap["url"] = "user/forgetPassword";
	paramMap["code"] = code;
	paramMap["password"] = password;
	$.request(paramMap,call,true,false,"正在修改密码,请稍后...");
};

/** 用户中心 start **/

/** 修改密码 **/
htService.prototype.updatePassword = function(call,old_password,new_password){
	var paramMap = {}
	paramMap["url"] = "user/updatePassword";
	paramMap["old_password"] = old_password;
	paramMap["new_password"] = new_password;
	$.request(paramMap,call,true,false,"正在修改密码,请稍后...");
}; 
/** 修改基础资料 **/
htService.prototype.updateInfos = function(call,infos){
	var paramMap = {}
	paramMap["url"] = "user/updateInfos";
	paramMap["infos"] = infos;
	$.request(paramMap,call,true,false,"正在修改密码,请稍后...");
}; 
/** 获取基础资料 **/
htService.prototype.info = function(call){
	var paramMap = {}
	paramMap["url"] = "user/info";
	$.request(paramMap,call,true,false,"正在获取用户信息,请稍后...");
}; 

/** 新增或修改收货地址 address_id:不传新增 传则修改**/
htService.prototype.setAddr = function(call,address_info,address_id){
	var paramMap = {}
	paramMap["url"] = "userAddr/setAddr";address_id
	paramMap["address_id"] = address_id;
	paramMap["address_info"] = address_info;
	$.request(paramMap,call,true,false,"正在操作中,请稍后...");
}; 

/** 删除收货地址 **/
htService.prototype.delAddr = function(call,address_id){
	var paramMap = {}
	paramMap["url"] = "userAddr/delAddr";
	paramMap["address_id"] = address_id;
	$.request(paramMap,call,true,false,"正在操作中,请稍后...");
};

/** 设置默认收货地址 **/
htService.prototype.setAddrDefault = function(call,address_id){
	var paramMap = {}
	paramMap["url"] = "userAddr/setAddrDefault";
	paramMap["address_id"] = address_id;
	$.request(paramMap,call,true,false,"正在操作中,请稍后...");
};

/** 获取收货地址列表 **/
htService.prototype.getAddrList = function(call,page,page_size){
	var paramMap = {}
	paramMap["url"] = "userAddr/getList";
	paramMap["page"] = page;
	paramMap["page_size"] = page_size;
	$.request(paramMap,call,true,false,"数据加载中,请稍后...");
};

/** 获取收货地址详细信息 **/
htService.prototype.getAddrInfo = function(call,address_id){
	var paramMap = {}
	paramMap["url"] = "userAddr/getAddrInfo";
	paramMap["address_id"] = address_id;
	$.request(paramMap,call,true,false,"正在加载收货地址,请稍后...");
};

/** 获取当前用户的收藏列表 **/
htService.prototype.getCollectGoodsList = function(call,page,page_size,order_by){
	var paramMap = {}
	paramMap["url"] = "CollectGoods/getSelfList";
	paramMap["page"] = page;
	paramMap["page_size"] = page_size;
	paramMap["order_by"] = order_by;
	$.request(paramMap,call,true,false,"正在获取收藏列表,请稍后...");
};

/** 增加收藏 **/
htService.prototype.setSelfCollectGoods = function(call,goods_id){
	var paramMap = {}
	paramMap["url"] = "CollectGoods/setSelfCollectGoods";
	paramMap["goods_id"] = goods_id;
	$.request(paramMap,call,true,false,"正在加入收藏,请稍后...");
};

/** 获取当前用户的收藏数量 **/
htService.prototype.getSelfTotal  = function(call){
	var paramMap = {}
	paramMap["url"] = "CollectGoods/getSelfTotal";
	$.request(paramMap,call,true,false,"数据加载中,请稍后...");
};

/** 删除收藏 **/
htService.prototype.delSelfCollectGoods  = function(call,goods_id){
	var paramMap = {}
	paramMap["url"] = "CollectGoods/delSelfCollectGoods";
	paramMap["goods_id"] = goods_id;
	$.request(paramMap,call,true,false,"正在删除,请稍后...");
};

/** 获取所有的消息列表 **/
htService.prototype.getMessageList = function(call,page,limit,type,is_read){
	var paramMap = {}
	paramMap["url"] = "MessageView/getSelfList";
	paramMap["page"] = page;
	paramMap["limit"] = limit;
	paramMap["type"] = type;
	paramMap["is_read"] = is_read;
	$.request(paramMap,call,true,false,"获取消息列表,请稍后...");
};

/** 获取指定类型的消息总数 **/
htService.prototype.getMessageTotal = function(call,type,is_read){
	var paramMap = {}
	paramMap["url"] = "MessageView/getSelfTotal";
	paramMap["type"] = type;
	paramMap["is_read"] = is_read;
	$.request(paramMap,call,true,false,"获取消息数量,请稍后...");
};

/** 标记已读消息 **/
htService.prototype.setSelfReadInc = function(call,message_id){
	var paramMap = {}
	paramMap["url"] = "MessageView/setSelfReadInc";
	paramMap["message_id"] = message_id;
	$.request(paramMap,call,true,false,"获取消息数量,请稍后...");
};

/** 标记已读消息 **/
htService.prototype.delSelfMsg = function(call,message_id){
	var paramMap = {}
	paramMap["url"] = "MessageView/delSelfMsg";
	paramMap["message_id"] = message_id;
	$.request(paramMap,call,true,false,"获取消息数量,请稍后...");
};

/** 用户中心 end **/

/** 订单接口  C端 start **/

/** 订单创建 **/
htService.prototype.getCreateCOrder = function(call,type,address_id,goods_list){
	var paramMap = {}
	paramMap["url"] = "COrder/createCOrder";
	paramMap["type"] = type;
	paramMap["address_id"] = address_id;
	paramMap["goods_list"] = goods_list;
	$.request(paramMap,call,true,false,"创建订单中,请稍后...");
};

/** 订单查询 **/
htService.prototype.getCOrderList = function(call,type,keyword,page,page_szie){
	var paramMap = {}
	paramMap["url"] = "COrder/getList";
	paramMap["type"] = type;
	paramMap["keyword"] = keyword;
	paramMap["page"] = page;
	paramMap["page_szie"] = page_szie;
	$.request(paramMap,call,true,false,"查询订单中,请稍后...");
};

/** 将一组商品列表按收货地址对应的仓库拆分成多组商品 **/
htService.prototype.splitGoodsListByConsigneeAddress = function(call,address_id,goods_list){
	var paramMap = {};
	paramMap["url"] = "COrder/splitGoodsListByConsigneeAddress";
	paramMap["address_id"] = address_id;
	paramMap["goods_list"] = goods_list;
	$.request(paramMap,call,true,false,"正在拆单中...");
};

/** 订单数量 **/
htService.prototype.getCOrderTotal = function(call,type,keyword,page,page_szie){
	var paramMap = {}
	paramMap["url"] = "COrder/getTotal";
	paramMap["type"] = type;
	$.request(paramMap,call,true,false,"数据加载中,请稍后...");
};

/** 订单详情 **/
htService.prototype.getCOrderDetails = function(call,order_id){
	var paramMap = {}
	paramMap["url"] = "COrder/getOneOrder";
	paramMap["order_id"] = order_id;
	$.request(paramMap,call,true,false,"数据加载中,请稍后...");
};

/** 订单创建 **/
htService.prototype.createCOrder = function(call,type,address_id,goods_list){
	var paramMap = {}
	paramMap["url"] = "COrder/createCOrder";
	paramMap["type"] = type;
	paramMap["address_id"] = address_id;
	paramMap["goods_list"] = goods_list;
	$.request(paramMap,call,true,false,"正在创建订单,请稍后...");
};

/** 取消订单 **/
htService.prototype.cancelCOrder = function(call,order_id){
	var paramMap = {}
	paramMap["url"] = "COrder/cancelOrder";
	paramMap["order_id"] = order_id;
	$.request(paramMap,call,true,false,"正在取消订单,请稍后...");
};

/** 确认收货 **/
htService.prototype.closeCOrder = function(call,order_id){
	var paramMap = {}
	paramMap["url"] = "COrder/closeOrder";
	paramMap["order_id"] = order_id;
	$.request(paramMap,call,true,false,"正在取消订单,请稍后...");
};

/** 订单接口  C端 start **/

/** 订单接口  B端 start **/

/** 从购物车创建采购订单 **/
htService.prototype.createPurchaseOrder = function(call,goodsList,create_from_platform){
	var paramMap = {}
	paramMap["url"] = "PurchaseOrder/createPurchaseOrder";
	paramMap["goodsList"] = goodsList;
	paramMap["create_from_platform"] = create_from_platform;
	$.request(paramMap,call,true,false,"正在创建采购订单,请稍后...");
};

/** 获取符合条件的采购单列表 **/
htService.prototype.getPurchaseOrderList = function(call,order_by,order_by_dir,offset,limit,order_status,goods){
	var paramMap = {}
	paramMap["url"] = "PurchaseOrder/getPurchaseOrderList";
	paramMap["order_by"] = order_by;
	paramMap["order_by_dir"] = order_by_dir;
	paramMap["offset"] = offset;
	paramMap["limit"] = limit;
	paramMap["order_status"] = order_status;
	paramMap["goods"] = goods;
	$.request(paramMap,call,true,false,"订单加载中,请稍后...");
};

/** 获取符合条件的采购单总数 **/
htService.prototype.getPurchaseOrderCount = function(call,order_status){
	var paramMap = {}
	paramMap["url"] = "PurchaseOrder/getPurchaseOrderCount";
	paramMap["order_status"] = order_status;
	$.request(paramMap,call,true,false,"数据加载中,请稍后...");
};

/** 获取指定的采购单 **/
htService.prototype.getPurchaseOrder = function(call,purchase_order_id,goods){
	var paramMap = {}
	paramMap["url"] = "PurchaseOrder/getPurchaseOrder";
	paramMap["purchase_order_id"] = purchase_order_id;
	paramMap["goods"] = goods;
	$.request(paramMap,call,true,false,"订单加载中,请稍后...");
};

/** 取消采购单 **/
htService.prototype.cancelPurchaseOrder = function(call,purchase_order_id){
	var paramMap = {}
	paramMap["url"] = "PurchaseOrder/cancel";
	paramMap["purchase_order_id"] = purchase_order_id;
	$.request(paramMap,call,true,false,"订单加载中,请稍后...");
};

/** 获取符合条件的销售单列表 **/
htService.prototype.getSalesOrderList = function(call,order_by,order_by_dir,
	offset,limit,order_status,goods,logistics, snOrId, add_time_start ,add_time_end){
	var paramMap = {}
	paramMap["url"] = "SalesOrder/getSalesOrderList";
	paramMap["order_by"] = order_by;
	paramMap["order_by_dir"] = order_by_dir;
	paramMap["offset"] = offset;
	paramMap["limit"] = limit;
	paramMap["order_status"] = order_status;
	paramMap["goods"] = goods;
	paramMap["logistics"] = logistics;
	paramMap['sn_or_id'] = snOrId;
	paramMap["add_time_start"] = add_time_start;
	paramMap["add_time_end"] = add_time_end;
	$.request(paramMap,call,true,false,"数据加载中,请稍后...");
};

/** 全部通知发货 **/
htService.prototype.notifyALL = function(call){
	var paramMap = {}
	paramMap["url"] = "SalesOrder/notifyALL";
	$.request(paramMap,call,true,false,"正在全部通知中,请稍后...");
};

/** 获取符合条件的销售单总数 **/
htService.prototype.getSalesOrderCount = function(call,order_status,snOrId){
	var paramMap = {}
	paramMap["url"] = "SalesOrder/getSalesOrderCount";
	paramMap["order_status"] = order_status;
	paramMap['sn_or_id'] = snOrId;
	$.request(paramMap,call,true,false,"数据加载中,请稍后...");
};

/** 获取指定的销售订单 **/
htService.prototype.getSalesOrder = function(call,sales_order_id,goods,logistics){
	var paramMap = {}
	paramMap["url"] = "SalesOrder/getSalesOrder";
	paramMap["sales_order_id"] = sales_order_id;
	paramMap["goods"] = goods;
	paramMap["logistics"] = logistics;
	$.request(paramMap,call,true,false,"数据加载中,请稍后...");
};

/** 销售订单取消 **/
htService.prototype.cancelSalesOrder = function(call,sales_order_id){
	var paramMap = {}
	paramMap["url"] = "SalesOrder/cancel";
	paramMap["sales_order_id"] = sales_order_id;
	$.request(paramMap,call,true,false,"取消订单中,请稍后...");
};

/** 通知发货，仅标记状态，由后台计划任务执行 doNotify **/
htService.prototype.notifySalesOrder = function(call,sales_order_id){
	var paramMap = {}
	paramMap["url"] = "SalesOrder/notify";
	paramMap["sales_order_id"] = sales_order_id;
	$.request(paramMap,call,true,false,"正在请求通知发货,请稍后...");
};

/** 销售订单确认收货 **/
htService.prototype.receiveSalesOrder = function(call,sales_order_id){
	var paramMap = {}
	paramMap["url"] = "SalesOrder/receive";
	paramMap["sales_order_id"] = sales_order_id;
	$.request(paramMap,call,true,false,"正在请求通知发货,请稍后...");
};

/** 创建销售订单 **/
htService.prototype.createSalesOrder = function(call,param){
	var paramMap = {}
	paramMap["url"] = "SalesOrder/createSalesOrder";
	paramMap["sales_order_sn"] = param.sales_order_sn;
	paramMap["shop_amount"] = param.shop_amount;
	paramMap["consignee"] = param.consignee;
	paramMap["province_id"] = param.province_id;
	paramMap["city_id"] = param.city_id;
	paramMap["district_id"] = param.district_id;
	paramMap["province"] = param.province;
	paramMap["city"] = param.city;
	paramMap["district"] = param.district;
	paramMap["address"] = param.address;
	paramMap["mobile"] = param.mobile;
	paramMap["id_card_number"] = param.id_card_number;
	paramMap["site_type"] = param.site_type;
	paramMap["site_name"] = param.site_name;
	paramMap["consumer_note"] = param.consumer_note;
	paramMap["create_from_platform"] = param.create_from_platform;
	paramMap["is_check"] = param.is_check;
	paramMap["payment_info_method"] = param.payment_info_method;
	paramMap["payment_info_number"] = param.payment_info_number;
	paramMap["payment_info_name"] = param.payment_info_name;
	paramMap["payment_info_id_card_number"] = param.payment_info_id_card_number;
	paramMap["goodsList"] = param.goodsList;
	$.request(paramMap,call,true,false,"创建订单中,请稍后...");
};

/** 修改销售订单 **/
htService.prototype.editSalesOrder = function(call,param){
	var paramMap = {}
	paramMap["url"] = "SalesOrder/editSalesOrder";
	paramMap["sales_order_id"] = param.sales_order_id;
	paramMap["shop_amount"] = param.shop_amount;
	paramMap["consignee"] = param.consignee;
	paramMap["province"] = param.province;
	paramMap["city"] = param.city;
	paramMap["district"] = param.district;
	paramMap["province_id"] = param.province_id;
	paramMap["city_id"] = param.city_id;
	paramMap["district_id"] = param.district_id;
	paramMap["address"] = param.address;
	paramMap["mobile"] = param.mobile;
	paramMap["id_card_number"] = param.id_card_number;
	paramMap["site_type"] = param.site_type;
	paramMap["site_name"] = param.site_name;
	paramMap["consumer_note"] = param.consumer_note;
	paramMap["create_from_platform"] = param.create_from_platform;
	paramMap["goodsList"] = param.goodsList;
	paramMap["sku"] = param.sku;
	paramMap["quantity"] = param.quantity;
	paramMap["sales_price"] = param.sales_price;
	paramMap["is_check"] = param.is_check;
	$.request(paramMap,call,true,false,"正在提交订单数据,请稍后...");
};

/** 销售订单导入列表查询接口 **/
htService.prototype.getUploadSalesOrderList = function(call,task_id,page,page_size){
	var paramMap = {}
	paramMap["url"] = "SalesOrder/getUploadSalesOrderList";
	paramMap["task_id"] = task_id;
	paramMap["page"] = page;
	paramMap["page_size"] = page_size;
	$.request(paramMap,call,true,false,"正在查询导入销售订单列表,请稍后...");
};

/** 销售订单单个保存接口 **/
htService.prototype.saveOneSalesOrder = function(call,task_id,index,sale_order_info){
	var paramMap = {}
	paramMap["url"] = "SalesOrder/saveOneSalesOrder";
	paramMap["task_id"] = task_id;
	paramMap["index"] = index;
	paramMap["sale_order_info"] = sale_order_info;
	$.request(paramMap,call,true,false,"正在保存订单,请稍后...");
};

/** 销售订单单个删除接口 **/
htService.prototype.deleteUploadSalesOrder = function(call,task_id,index){
	var paramMap = {}
	paramMap["url"] = "SalesOrder/deleteUploadSalesOrder";
	paramMap["task_id"] = task_id;
	paramMap["index"] = index;
	$.request(paramMap,call,true,false,"正在删除订单,请稍后...");
};

/** 销售订单保存接口 **/
htService.prototype.importSalesOrderSubmit = function(call,task_id){
	var paramMap = {}
	paramMap["url"] = "SalesOrder/submit";
	paramMap["task_id"] = task_id;
	$.request(paramMap,call,true,false,"正在保存订单,请稍后...");
};


/** 一键采购，加入到购物车 **/
htService.prototype.quickPurchaseOrder = function(call,is_include_purchase_no_pay){
	var paramMap = {}
	paramMap["url"] = "SalesOrder/quickPurchaseOrder";
    paramMap["is_include_purchase_no_pay"] = is_include_purchase_no_pay;
	$.request(paramMap,call,true,false,"获取采购列表,请稍后...");
};

/** 一键采购，加入到购物车 **/
htService.prototype.quickBuy = function(call,goodsList,goods_id,quantity,create_from_platform){
	var paramMap = {}
	paramMap["url"] = "PurchaseOrder/quickBuy";
	paramMap["goods_id"] = goods_id;
	paramMap["goodsList"] = goodsList;
	paramMap["quantity"] = quantity;
	paramMap["create_from_platform"] = create_from_platform;
	$.request(paramMap,call,true,false,"一键采购中,请稍后...");
};

/** 获取用户符合条件的微仓库存列表 **/
htService.prototype.getStockList = function(call,keyword,order_by,order_by_dir,offset,limit,has_stock){
	var paramMap = {}
	paramMap["url"] = "MwStock/getStockList";
	paramMap["keyword"] = keyword;
	paramMap["order_by"] = order_by;
	paramMap["order_by_dir"] = order_by_dir;
	paramMap["page"] = offset;
	paramMap["page_size"] = limit;
	paramMap["has_stock"] = has_stock;
	$.request(paramMap,call,false,false,"数据加载中,请稍后...");
};

/** 获取用户符合条件的微仓库存列表的缺貨采購 **/
htService.prototype.getLackStockList = function(call,keyword,order_by,order_by_dir,offset,limit,is_include_purchase_no_pay){
    var paramMap = {}
    paramMap["url"] = "MwStock/lackStockList";
    paramMap["keyword"] = keyword;
    paramMap["order_by"] = order_by;
    paramMap["order_by_dir"] = order_by_dir;
    paramMap["page"] = offset;
    paramMap["page_size"] = limit;
    paramMap["is_include_purchase_no_pay"] = is_include_purchase_no_pay;
    $.request(paramMap,call,false,false,"数据加载中,请稍后...");
};

/** 创建销售订单拉出所有微仓库存 **/
htService.prototype.getStockListNew = function(call,keyword,order_by,order_by_dir,offset,limit,has_stock){
	var paramMap = {}
	paramMap["url"] = "MwStock/getStockListNew";
	paramMap["keyword"] = keyword;
	paramMap["order_by"] = order_by;
	paramMap["order_by_dir"] = order_by_dir;
	paramMap["page"] = offset;
	paramMap["page_size"] = limit;
	paramMap["has_stock"] = has_stock;
	$.request(paramMap,call,false,true,"数据加载中,请稍后...");
};

// /** 获取用户符合条件的微仓库存列表 **/
// htService.prototype.getStockList = function(call,order_by,order_by_dir,offset,limit){
// 	var paramMap = {}
// 	paramMap["url"] = "MwStock/getStockList";
// 	paramMap["order_by"] = order_by;
// 	paramMap["order_by_dir"] = order_by_dir;
// 	paramMap["offset"] = offset;
// 	paramMap["limit"] = limit;
// 	$.request(paramMap,call,true,false,"数据加载中,请稍后...");
// };

/** 订单接口  B端 end **/

/**  购物车 start **/

/** 购物车批量新增 **/

htService.prototype.batchAddCart = function(call,goods_list){
	var paramMap = {}
	paramMap["url"] = "cart/batchAdd";
	paramMap["goods_list"] = goods_list;
	$.request(paramMap,call,true,false,"正在加入购物车,请稍后...");
};

/** 购物车列表 **/
htService.prototype.getListCart = function(call,page,page_size){
	var paramMap = {}
	paramMap["url"] = "cart/getList";
	paramMap["page"] = page;
	paramMap["page_size"] = page_size;
	$.request(paramMap,call,false,false,"购物车加载中,请稍后...");
};

/** 购物车新增/修改/删除 **/
htService.prototype.modifyCart = function(call,goods_id,number,type){
	var paramMap = {}
	paramMap["url"] = "cart/modify";
	paramMap["goods_id"] = goods_id;
	paramMap["number"] = number;
	paramMap["type"] = type;
	$.request(paramMap,call,true,false,"操作请求中,请稍后...");
};

/**  购物车 end **/

/**  商品 start **/
/** 根据商品id获取列表接口  **/
htService.prototype.getGoodsInfoByIds = function(call,goods_id_in,default_addr){
	var paramMap = {}
	paramMap["url"] = "goods/getGoodsInfoByIds";
	paramMap["goods_id_in"] = goods_id_in;
	paramMap["default_addr"] = default_addr;
	$.request(paramMap,call,true,false,"正在获取商品列表,请稍后...");
};
/**  商品详情接口   **/
htService.prototype.getGoodsInfo = function(call,sku,description,gallery,standard,extension,brand_sku){
	var paramMap = {}
	paramMap["url"] = "goods/getGoodsInfo";
	paramMap["sku"] = sku;
	paramMap["description"] = description;
	paramMap["gallery"] = gallery;
	paramMap["standard"] = standard;
	paramMap["extension"] = extension;
	paramMap["brand_sku"] = brand_sku;
	$.request(paramMap,call,true,false,"正在获取商品列表,请稍后...");
};
//商品查询列表接口 
htService.prototype.searchGoods = function(call,param){
	var paramMap = {}
	paramMap["url"] = "search/index_v2";
	paramMap["page"] = param.page;
	paramMap["page_size"] = param.page_size;
	paramMap["brand_id"] = param.brand_id;
	paramMap["is_best"] = param.is_best;
	paramMap["is_new"] = param.is_new;
	paramMap["is_hot"] = param.is_hot;
	paramMap["has_stock"] = param.has_stock;
	paramMap["order_by"] = param.order_by;
	paramMap["order_by_dir"] = param.order_by_dir;
	paramMap["order_by_string"] = param.order_by_string;
	paramMap["keyword"] = param.keyword;
	paramMap["category_id_in"] = param.category_id_in;
	paramMap["category_id"] = param.category_id;
	paramMap["top_category_id"] = param.top_category_id;
	paramMap["goods_id_in"] = param.goods_id_in;
	paramMap["goods_id"] = param.goods_id;
	paramMap["min_price"] = param.min_price;
	paramMap["max_price"] = param.max_price;
	paramMap["has_brand"] = param.has_brand;
	paramMap["has_category"] = param.has_category;
	paramMap["has_price"] = param.has_price;
	$.request(paramMap,call,true,true,"正在查询商品信息,请稍后...");
};
/**  商品 end **/
/** 公共API start **/

/** 获取地区信息 **/
htService.prototype.getRegionList = function(call,id){
	var paramMap = {}
	paramMap["url"] = "Region/getList";
	paramMap["id"] = id;
	$.request(paramMap,call,true,false,"地区数据加载中,请稍后...");
};

/**  获取符合条件的公告列表 **/
htService.prototype.getBulletinList = function(call,keyword,valid,page,page_size,order_by,order_by_dir){
	var paramMap = {}
	paramMap["url"] = "Bulletin/getBulletinList";
	paramMap["keyword"] = keyword;
	paramMap["valid"] = valid;
	paramMap["page"] = page;
	paramMap["page_size"] = page_size;
	paramMap["order_by"] = order_by;
	paramMap["order_by_dir"] = order_by_dir;
	$.request(paramMap,call,true,false,"正在加载公告列表,请稍后...");
};

/**  获取指定的公告 **/
htService.prototype.getBulletin = function(call,bulletin_id){
	var paramMap = {}
	paramMap["url"] = "Bulletin/getBulletin";
	paramMap["bulletin_id"] = bulletin_id;
	$.request(paramMap,call,true,false,"正在加载公告详情,请稍后...");
};

/**  获取用户最近一次的通知邮箱   **/
htService.prototype.getLastSkuArrivalEmail = function(call){
	var paramMap = {}
	paramMap["url"] = "User/getLastSkuArrivalEmail";
	$.request(paramMap,call,true,false,"正在加载,请稍后...");
};

/**  提交缺货登记   **/
htService.prototype.arrivalNotify = function(call,email,sku){
	var paramMap = {}
	paramMap["url"] = "Goods/arrivalNotify";
	paramMap["email"] = email;
	paramMap["sku"] = sku;
	$.request(paramMap,call,true,false,"正在提交缺货登记,请稍后...");
};
/** 公共API end **/



/** 支付API start **/

/** 去支付 **/
htService.prototype.toPay = function(call, param){
	var paramMap = {}
	paramMap["url"] = "Payment/toPay";
	paramMap["order_sn"] = param.order_sn;
	paramMap["pay_code"] = param.pay_code;
	$.request(paramMap,call,true,false,"支付数据加载中,请稍后...");
};
/** 验证是否支付支付 **/
htService.prototype.checkOrderPay = function(call, param){
	var paramMap = {}
	paramMap["url"] = "Payment/isPaid";
	paramMap["order_sn"] = param.order_sn;
	paramMap["send_order_sn"] = param.code;
	paramMap
	$.request(paramMap,call,true,false,"支付数据加载中,请稍后...");
};
/** 设置支付身份信息 **/
htService.prototype.setPayer = function(call,c_order_id,payer_name,payer_id_card_no){
	var paramMap = {};
	paramMap["url"] = "COrder/setPayer";
	paramMap["c_order_id"] = c_order_id;
	paramMap["payer_name"] = payer_name;
	paramMap["payer_id_card_no"] = payer_id_card_no;
	$.request(paramMap,call,true,false,"正在提交支付身份信息，请稍后...");
};
/** 支付API end **/


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