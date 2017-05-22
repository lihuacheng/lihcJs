//页面级ID
var page_id = "#sellOrder"

var htService = $.htService;

var userInfo = $.getUserInfo();

var userId = userInfo.user_id;

var taskNameCookie = "task_list_"+userId;

var nav = $(page_id+" #J_navbar .redline");
//主Content
var main_content = $(page_id+" #main-content");
//物流导出Content
var logistics_content = $(page_id+" #logistics-content");
//订单列表
var J_BoughtTable = $(page_id+" #J_BoughtTable");
//客户订单nav 切换
var tablecss = $(page_id+" #tablecss li");
//编辑订单DIV
var edit_div = $(page_id+" #edit-div");
//批量导入DIV
var importother = $(page_id+" #import-other");
var editsaleorder = $(page_id+" #editsaleorder");
//编辑添加商品列表
var add_goods_list = $(page_id+" #add-goods-list");
//分页DIV
var pager = $(page_id+" #pager");

// var site_type = $(page_id+" select[name=site_type]");
// var site_name = $(page_id+" select[name=site_name]");
var sales_order_sn = $(page_id+" input[name=sales_order_sn]");
var shop_amount = $(page_id+" input[name=shop_amount]");
var payment_info_method = $(page_id+" select[name=payment_info_method]");
var payment_info_number = $(page_id+" input[name=payment_info_number]");
var payment_info_name = $(page_id+" input[name=payment_info_name]");
var payment_info_id_card_number = $(page_id+" input[name=payment_info_id_card_number]");
var consignee = $(page_id+" input[name=consignee]");
var mobile = $(page_id+" input[name=mobile]");
var id_card_number = $(page_id+" input[name=id_card_number]");
var province = $(page_id+" select[name=province]");
var city = $(page_id+" select[name=city]");
var district = $(page_id+" select[name=district]");
var address = $(page_id+" input[name=address]");
var is_check = $(page_id+" input[name=is_check]");
//操作类型
var operation_type = $(page_id+" input[name=operation-type]");
var sales_order_id = $(page_id+" input[name=sales_order_id]")
var taskId;

//开始时间
var start_time = $(page_id+" #start_time");
var start_time_val = $(page_id+" #start_time_val");
//结束时间
var end_time = $(page_id+" #end_time");
var end_time_val = $(page_id+" #end_time_val");

//显示时间控件
$(page_id+" #start_time,#end_time").on("focus",function(){
	WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'{%y-60}-01-01',maxDate:'{%y}-12-31'})
});

//初始化分页数据
var filter = {
	page : 1,
	page_size : 10,
};
//初始化导入销售订单列表分页数据
var import_filter = {
	page : 1,
	page_size : 30,
};
//初始化导出销售订单列表分页数据
var export_filter = {
	page : 1,
	page_size : 30,
};
var states = {
	ALL : "SALES_ORDER_STATUS_ALL",//所有订单
	CREATE : "1",//缺货采购
	NOTIFY_FAIL : "2",//待通知发货
	NOTIFY : "3",//待收货
	CANCELLED:'SALES_ORDER_STATUS_CANCELLED'//已取消
};
var checkState = states.ALL;
var sellorderVal = $.getQueryString("sellorder");
//分页回调
var backCall = function(page,page_size){
	filter.page = parseInt(page);
	filter.page_size = parseInt(page_size);
	var offset = (filter.page-1);//*filter.page_size
	var limit = filter.page_size;
	getSalesOrderList(checkState,offset,limit);
};
//导入销售订单列表分页回调
var import_backCall = function(page,page_size){
	filter.page = parseInt(page);
	filter.page_size = parseInt(page_size);
	var offset = filter.page;//(filter.page-1);//*
	var limit = filter.page_size;
	getUploadSalesOrderList(taskId,offset,limit);
};

//导出销售订单列表分页回调
var export_backCall = function(page,page_size){
	filter.page = parseInt(page);
	filter.page_size = parseInt(page_size);
	var offset = filter.page-1;//(filter.page-1);//*
	var limit = filter.page_size;
	getSalesOrderList("4",offset,limit,start_time.val(),end_time.val());
};

if (userInfo.user_type == 3) {
	$("#btn-joinSalesOrder").show();
} else {
	$(".xinghao", shop_amount.closest(".singleorder")).remove();
	$(".xinghao", $("input[name='import_shop_amount']").closest(".singleorder")).remove();
}

//判断是否有订单号传入
if($.string.isNotEmpty(sellorderVal)){
	var keyword = $.Base64.decode(sellorderVal);
	$(page_id+" #keyword").val(keyword);
	getSalesOrder(keyword);
}else{
	getSalesOrderList(states.ALL);
}

//订单搜索
$(page_id+" .search-btn").on("click",function(){
	var keyword = $(page_id+" #keyword").val();
	if($.string.isEmpty(keyword)){
		layer.tips("订单号不能为空！",$(page_id+" #keyword"));
		return;
	}
	getSalesOrderList();
});
//物流导出-订单搜索
$(page_id+" #logistics_MakePoint").on("click",function(){
	var start_timeVal = start_time.val();
	var end_timeVal = end_time.val();
	start_time_val.val(start_timeVal);
	end_time_val.val(end_timeVal);
	getSalesOrderList("4",0,30);
});

$(page_id+" #keyword").on("keyup",function(e){
	if (e.keyCode==13){
	 	var keyword = $(page_id+" #keyword").val();
		if($.string.isEmpty(keyword)){
			layer.tips("订单号不能为空！",$(page_id+" #keyword"));
			return;
		}
		getSalesOrderList();
	}
});
//nav栏 移入移出效果
nav.mouseover(function(){
	var index = $(this).index();
    $(page_id+" .wrap-line span").css({"left":(index*115)+"px"});
}).mouseout(function(){
	var index =$(page_id+" #J_navbar .selected").index();
  	$(page_id+" .wrap-line span").css({"left":(index*115)+"px"});
});
//nav 切换
nav.on("click",function(){
	nav.removeClass("selected");
	$(this).addClass("selected");
	if($(this).attr("data-id")=="NOTIFY_FAIL"){
        $(page_id+" #J_BoughtTable").find(".notify_fail").show();
    }else{
        $(page_id+" #J_BoughtTable").find(".notify_fail").hide();
    }
	if($(this).attr("data-id")=="CREATE"){
		$(page_id+" #modal-btn").show();
        $(page_id+" #J_BoughtTable").find(".lack_out").show();
	}else{
		$(page_id+" #modal-btn").hide();
        $(page_id+" #J_BoughtTable").find(".lack_out").hide();
	}
	checkState = states[$(this).attr("data-id")];
	getSalesOrderList(checkState);
});
//一键采购
$(page_id).on("click","#modal-btn",function(){
	$.redirect("index/procurementList",{"is_include_purchase_no_pay":0},"_blank");

});
//全选OR反选
$(page_id+" .J_AllSelector").on("change",function(){
	var  type_check = "#"+$(this).attr("data-type"); 
	var check_list = $(type_check+" #J_BoughtTable input[name='order_ids[]']");
	if($(this).is(':checked')){
		check_list.prop("checked",true);
		$(type_check+" .J_AllSelector").prop("checked",true);
	}else{
		check_list.prop("checked",false);
		$(type_check+" .J_AllSelector").prop("checked",false);
	}
	
});

//订单详情 预绑定事件
J_BoughtTable.on("click",".detail-link",function(){
	var order_id = $(this).attr("order_id");
	var param = {"order_id":order_id,"type":"S"};
	$.redirect("index/OrderDetails",param,"_blank");
});



//取消订单 预绑定事件
J_BoughtTable.on("click",".J_cancle_sales",function(){
	var $this = $(this);
	var order_id = $this.attr("data-order-id");
	layer.confirm('是否确定取消订单？', {
	    btn: ['是','否'] //按钮
	}, function(){
	    cancelSellOrder(order_id,$this);
	}, function(){
	  
	});
	
});
//通知订单 预绑定事件
J_BoughtTable.on("click",".J_notice_sales",function(){
	var $this = $(this);
	var order_id = $this.attr("data-order-id");
	notifySalesOrder(order_id,$this);
});
//批量取消/通知订单 预绑定事件
J_BoughtTable.on("click",".J_AllCancle,.J_AllDelivery,.J_exporLackOutMulti",function(){
	//选中的复选框
	var check_list = $(page_id+" #J_BoughtTable input[name='order_ids[]']:checked");
	if(check_list.length==0){
		layer.alert("请先勾选复选框！",{icon:6});
		return;
	}
	var order_id = "";
	check_list.each(function(k,v){
		var id = $(this).val();
		if(k==0){
			order_id += id;
		}else{
			order_id = order_id+","+id;
		}
	});
	if($(this).hasClass("J_AllDelivery")){
		notifySalesOrder(order_id)
	}else if($(this).hasClass("J_AllCancle")){
        cancelSellOrder(order_id);
    }else if($(this).hasClass("J_exporLackOutMulti")){
        exporLackOutMulti(order_id);
    }
	
	
});
//全部通知发货
J_BoughtTable.on("click",".J_notifyALL",function(){
	var notifyALLCall = function(results){
		if(results.code=="0X0000"){
			getSalesOrderList(checkState);
			layer.msg("全部通知发货成功");
		}else{
			layer.alert(results.code,{icon:6});
		}
	};
	htService.notifyALL(notifyALLCall);
});

//确认收货
J_BoughtTable.on("click",".confirm-goods",function(){
	receiveSalesOrder($(this));
});

//编辑订单 预绑定事件
J_BoughtTable.on("click",".J_edit_sales",function(){
	var order_id = $(this).attr("data-order-id");
	// operation_type.val("edit");
	// getSalesOrder(order_id,"edit");
	$.redirect("index/operateOrder",{"operaType":"edit","orderid":order_id},"_blank");
});

//省
province.on("change",function(){
	var val = $(this).find("option:selected").val();
	city.html('<option value="-1">请选择</option>');
	district.html('<option value="-1">请选择</option>');
	$.getRegionList(city,val);
	
});
//市
city.on("change",function(){
	var val = $(this).find("option:selected").val();
	$.getRegionList(district,val);
});
//区
district.on("change",function(){
	var val = $(this).find("option:selected").val();
});

//新增客户订单
$(page_id+" #newSellOrder").on("click",function(){
	// J_BoughtTable.hide();
	// pager.hide();
	// $(page_id+" #not-date").hide();
	// operation_type.val("add");
	// $(page_id+" #add-goods-btn").trigger("click");
	// edit_div.show();
	// //1: 中国下什么的所有省份
	// $.getRegionList(province,1);
	// province.change();
	$.redirect("index/operateOrder",{"operaType":"add"},"_blank");
});
//物流导出
$(page_id+" #logisticsDerived").on("click",function(){
	main_content.hide();
	logistics_content.show();
	getSalesOrderList("4",0,30);
});
//客户订单nav 切换
tablecss.on("click",function(){
	var data_type = $(this).attr("data-type");
	switch(data_type){
		case "edit-sell":
			importother.hide();
			editsaleorder.show().addClass("active");
			break;
		case "import-sell":
			editsaleorder.hide();
			importother.show().addClass("active");
			importother.find("#form-import-other-orders").show();
			importother.find("#upexcel_other").html("");
			getTaskListId();
			break;
	}
});
//删除cookie中的任务ID
$("#import-other").on("click",".del_cookie_taskid",function(){
	var taskIdStr = $.getStorage(taskNameCookie);
	var delTaskId = $(this).attr("data-id");
	var taskIdArray = taskIdStr.split(",");
	var newTaskIdStr = "";
	if(taskIdStr.indexOf(delTaskId)!=-1){
		var newDelTaskId = ","+delTaskId;
		if(taskIdStr.indexOf(newDelTaskId)!=-1){
			taskIdStr = taskIdStr.replace(newDelTaskId,"");
		}else{
			taskIdStr = taskIdStr.replace(delTaskId,"");
		}
	}
	$(this).closest("span").remove();
	$.setLocalStorage(taskNameCookie,taskIdStr);
});
//点击选中上传文件
$(page_id+" #checkFile-btn").on("click",function(){
	$(page_id+" #sales_order_excel_other").trigger("click");
});
//选中上传文件
$(page_id+" #sales_order_excel_other").on("change",function(){
	$(page_id+" #upexcel_other").html($(this).val());
});
//立即导入
$(page_id+" .importfile-btn").on("click",function(){
	layer.msg("文件正在上传中，请稍后...", {icon: 16,shade: 0.01});
	$.ajaxFileUpload({
        url: $.homeU("Index/order_upload"),
        secureuri: false,
        data: {"rm":Math.random()},
        fileElementId: 'sales_order_excel_other',
        dataType: 'json',
        success: function (data) {
        	if(data.code=="0X0000"){
        		taskId = data.data;
        		//用户cookie中的 任务列表ID
        		var user_task_list = $.getStorage(taskNameCookie);
        		if($.string.isNotEmpty(user_task_list)){
        			user_task_list += ","+taskId;
        		}else{
        			user_task_list = taskId;
        		}
        		$.setLocalStorage(taskNameCookie,user_task_list);
        		layer.closeAll();
        		$(page_id+" #form-import-other-orders").hide();
        		getUploadSalesOrderList(taskId,import_filter.page,import_filter.page_size);
        	}else{
        		layer.alert(data.message,{icon:6});
        	}
        },
        error: function (data) {
        	layer.alert("文件上传异常！");
        }
    });
});
//确认导入
$(page_id).on("click","#btn-submit-import",function(){
	var importSalesOrderSubmitCall = function(results){
		var data = results.data;
		if(results.code=="0X0000"){
			var success_count = data.success_count;
			$(page_id+" #import-other-list .live-order").remove()
			$(page_id+" #btn-submit-Reimport").trigger("click");
			//删除未完成订单任务cookie中已导入成功的
			var taskListId = $.getStorage(taskNameCookie);
			taskListId = taskListId.split(",");
			var taskListIdStr = "";
			for(var i=0;i<taskListId.length;i++){
				if(taskListId[i]!=taskId){
					if(i==0){
						taskListIdStr = taskListId[i];
					}else{
						taskListIdStr += ","+taskListId[i];
					}
					
				}
			}
			$.setLocalStorage(taskNameCookie,taskListIdStr);
			layer.alert("导入成功:"+success_count+"条！",{icon:6,closeBtn: 0},function(){
				// location.reload();
			});
		}else if(results.code=="0X0010"){
			var fail_message = data.fail_message;
			var fail_count = data.fail_count;
			var strHtml = '';
			for(var i=0;i<fail_message.length;i++){
				var message = fail_message[i];
				strHtml += '<div style="text-align:center;">'+message+'</div>'
			}
			getUploadSalesOrderList(taskId,1,30);
			//页面层
			layer.open({
			  type: 1,
			  skin: 'layui-layer-rim', //加上边框
			  area: ['550px', '320px'], //宽高
			  content: strHtml
			});

		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.importSalesOrderSubmit(importSalesOrderSubmitCall,taskId);
});
//重新导入
$(page_id).on("click","#btn-submit-Reimport",function(){
	$("#edit-div .tab-pane").removeClass("active");
	$(page_id+" #import-other").addClass("active");
	$(page_id+" #upexcel_other").html("");
	$(page_id+" #form-import-other-orders").show();
	getTaskListId();
});
//添加商品
$(page_id+" #add-goods-btn").on("click",function(){
	//获取页面模板
	var template = $("#add-goods-template").html();
	add_goods_list.append(template);
	var tablespice = add_goods_list.find(".tablespice");
	if(tablespice.length>=2){
		tablespice.show();
	}else{
		tablespice.hide();
	}
});
//删除商品 预绑定事件
$(page_id+" #add-goods-list").on("click",".tablespice",function(){
	$(this).closest(".orderslists").remove();
	var tablespice = add_goods_list.find(".tablespice");
	if(tablespice.length>=2){
		tablespice.show();
	}else{
		tablespice.hide();
	}
});

//确定提交
$(page_id+" #editinfotop").on("click",function(){
	var type = operation_type.val();
	if(type=="add"){
		createSalesOrder();
	}else if(type=="edit"){
		editSalesOrder();
	}else{
		layer.alert("操作方式不正确,请重新操作！",{icon:6});
	}
	
});
//获取已上传的订单文件ID
function getTaskListId(){
	var taskListId = $.getStorage(taskNameCookie);
	if($.string.isEmpty(taskListId)){
		return "";
	}
	var  strHtml = "";
	taskListId = taskListId.split(",");
	for(var i=0;i<taskListId.length;i++){
		strHtml += '<span class="sell_order_del"><a href="javascript:void(0);" class="A_taskId" data-id="'+taskListId[i]+'"style="margin-right:10px;">'+taskListId[i]+'</a>\
		<a class="del_cookie_taskid" href="javascript:void(0);" title="删除" data-id="'+taskListId[i]+'" >X</a></span>';
	}
	$(page_id+" #task_list_id").html(strHtml);
	//点击已上传的文件ID
	$(page_id).on("click",".A_taskId",function(){
		taskId = $(this).attr("data-id");
		layer.closeAll();
		$(page_id+" #form-import-other-orders").hide();
		getUploadSalesOrderList(taskId,1,30);
	});
}
//销售订单导入列表查询
function getUploadSalesOrderList(taskId,page,page_size){
	var getUploadSalesOrderListCall = function(results){
		if(results.code=="0X0000"){
			var data = results.data;
			var list = data.list;
			import_filter = data.filter;
			updateUploadSalesOrderHtml(list);
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.getUploadSalesOrderList(getUploadSalesOrderListCall,taskId,page,page_size);
}
//销售订单导入列表查询HTML
function updateUploadSalesOrderHtml(list){
	var strHtml = "";
	for(var i=0;i<list.length;i++){
		var item = list[i];
		var error = item.error;
		var warning = item.warning;
		var error_info = "";
		if(error.length>0){
        	strHtml += '<li class="live-order error parentsnode">';
        	error_info = '<div class="col error-string" style="width: 25%;">'+error[0]+'</div>';
        }else if(warning.length>0){
        	strHtml += '<li class="live-order warning parentsnode">';
        	error_info = '<div class="col error-string" style="width: 25%;">'+warning[0]+'</div>';
        }else if(warning.length==0&&error.length==0){
        	strHtml += '<li class="live-order success parentsnode">';
        	error_info = '<div class="col error-string" style="width: 25%;">没有错误，无需处理</div>';
        }
		strHtml += '<div class="order-summary"><div class="col" style="width: 15%;">'+item.sales_order_sn+'</div>\
        <div class="col" style="width: 10%;">￥'+parseFloat(item.order_amount).toFixed(2)+'</div><div class="col" style="width: 48%;">\
        <strong>'+item.consignee+' </strong>'+item.province+' '+item.city+' '+item.district+' '+item.address+'</div>';
        strHtml += error_info;
        strHtml += '<div class="col" style="width: 2%;"><a class="link-delete-order" href="javascript:;">×</a>\
	    </div><div class="clear"></div></div><input type="hidden" name="import-order-data" value="'+$.Base64.encode(JSON.stringify(item))+'" /></li>';
	}
	$.page.htPage($(page_id+" #import-order-pager"),import_filter,import_backCall);
	$("#order_import_form .pagination_1").css("margin-left","240px");
	$(page_id+" #import-order-pager").show();
	$(page_id+" #import-other-list .live-order").remove()
	$(page_id+" #import-other-list #imported-orders-ul").append(strHtml);
	$(page_id+" #tablecss .tab-pane").removeClass("active");
	$(page_id+" #import-other-list").addClass("active");
	editImportOrderDetails();
}
//导入订单编辑 地区联动
function importAddress(item){
	//省
	item.find("select[name=import_province]").on("change",function(){
		var val = $(this).find("option:selected").val();
		$.getRegionList(item.find("select[name=import_city]"),val);
		$.getRegionList(item.find("select[name=import_district]"),val);
		// var c_val = item.find("select[name=import_city]").find("option:selected").val();
	});
	//市
	item.find("select[name=import_city]").on("change",function(){
		var val = $(this).find("option:selected").val();
		$.getRegionList(item.find("select[name=import_district]"),val);
	});
	//区
	item.find("select[name=import_district]").on("change",function(){
		var val = $(this).find("option:selected").val();
	});
	//1: 中国下什么的所有省份
	$.getRegionList(item.find("select[name=import_province]"),1);
}
function editImportOrderDetails(){
	//展开编辑详情预绑定事件
	$(page_id).on("click","#import-other-list .order-summary",function(){
		var li = $(this).closest(".live-order");
		var order_detail = li.find(".order-detail");
		var order_data = li.find("input[name=import-order-data]").val();
		try{
			//使用base64加密JSON字符串  反之则base64解密JSON字符串 然后转换JSON对象
			order_data = JSON.parse($.Base64.decode(order_data));
		}catch(e){
			layer.alert("数据异常！");
			return;
		}
		//订单详情不存在 则新增
		if(order_detail.length==0){
			var import_order_template = $("#import_order_template").html();
			var import_order_product_template = $("#import_order_product_template").html();
			li.append(import_order_template);
			importAddress(li);
			li.find("input[name=import_order_sn]").val(order_data.sales_order_sn);
			li.find("input[name=import_shop_amount]").val(order_data.shop_amount);
			li.find("input[name=import_consignee]").val(order_data.consignee);
			li.find("input[name=import_mobile]").val(order_data.mobile);
			// li.find("select[name=import_province] option:selected").html(order_data.province);
			// li.find("select[name=import_city] option:selected").html(order_data.city);
			// li.find("select[name=import_district] option:selected").html(order_data.district);
			var import_province = li.find("select[name=import_province]");
			var import_city = li.find("select[name=import_city]");
			var import_district = li.find("select[name=import_district]");
			if($.string.isNotEmpty(order_data.province_id)&&parseInt(order_data.province_id)!=0){
				import_province.find("option[value="+order_data.province_id+"]").prop("selected",true);
				import_province.change();
			}else{
				import_province.append('<option value="-1">'+order_data.province+'</option>');
				import_province.find("option[value=-1]").prop("selected",true);
			}
			if($.string.isNotEmpty(order_data.city_id)&&parseInt(order_data.city_id)!=0){
				import_city.find("option[value="+order_data.city_id+"]").prop("selected",true);
				import_city.change();
			}else{
				import_city.append('<option value="-1">'+order_data.city+'</option>');
				import_city.find("option[value=-1]").prop("selected",true);
			}
			if($.string.isNotEmpty(order_data.city_id)&&parseInt(order_data.city_id)!=0){
				import_district.find("option[value="+order_data.district_id+"]").prop("selected",true);
			}else{
				import_district.append('<option value="-1">'+order_data.district+'</option>');
				import_district.find("option[value=-1]").prop("selected",true);
			}
			li.find("input[name=import_address]").val(order_data.address);
			li.find("input[name=import_id_card_number]").val(order_data.id_card_number.replace(/\s/g, ""));
			var goodsList = order_data.goodsList;
			var imported_goods_list = li.find(".imported-goods-list");
			for(var i=0;i<goodsList.length;i++){
				var goods = goodsList[i];
				imported_goods_list.append(import_order_product_template);
				var imported_goods = imported_goods_list.find(".imported-goods").eq(i);
				imported_goods.find("input[name=import_goods_sn]").val(goods.sku);
				imported_goods.find("input[name=import_sku_name]").val(goods.ht_goods_name);
				imported_goods.find("input[name=quantity]").val($.string.isEmpty(goods.quantity)?goods.min_sale_num:goods.quantity);
				imported_goods.find("input[name=import_goods_name]").val(goods.goods_name);
				imported_goods.find("input[name=import_goods_prices]").val(parseFloat(goods.sales_price).toFixed(2));
				var quantity = imported_goods.find("input[name=quantity]");
				quantity.attr("is_modulo",goods.is_modulo);
				quantity.attr("min_sale_quantity",goods.min_sale_num);
				quantity.attr("max_sale_quantity",goods.max_sale_quantity);
				quantity.attr("is_trade_sku",goods.is_trade_sku);
			}
			if(goodsList.length>1){
				li.find(".del-import-product").show();
			}
		}
		order_detail = li.find(".order-detail");
		var order_detail_index = order_detail.eq(0);
		order_detail_index.show();
		
	});
	//输入SKU带出商品信息
	$(page_id).on("blur","input[name=import_goods_sn]",function(){

		var orderslists = $(this).closest('.orderslists');
		var getGoodsInfoCall = function(results){
			if(results.code=="0X0000"){
				var data = results.data;
				var goods_sn_input = orderslists.find("input[name=goods_sn]");
				var sku_name = orderslists.find("input[name=import_sku_name]");
				var quantity = orderslists.find("input[name=quantity]");
				var goods_prices = orderslists.find("input[name=import_goods_prices]");
				// goods_sn_input.val(sku);
				sku_name.val(data.goods_name);
				quantity.val(data.min_sale_quantity);
				quantity.attr("is_modulo",data.is_modulo);
				quantity.attr("min_sale_quantity",data.min_sale_quantity);
				quantity.attr("max_sale_quantity",data.max_sale_quantity);
				quantity.attr("is_trade_sku",data.is_trade_sku);
				goods_prices.val(data.price);
				orderslists.find(".sku-box").hide();
			}else if(results.code=="0X0010"){
				//商品不存在不做任何处理
			}else{
				layer.alert(results.message,{icon:6});
			}
		};
		htService.getGoodsInfo(getGoodsInfoCall,$(this).val());
	});

	//单个订单商品删除
	$(page_id).on("click",".del-import-product",function(){
		var li = $(this).closest(".live-order");
		var thisProduct = $(this).closest(".orderslists");
		//隐藏并标示 y 删除
		thisProduct.hide().attr("is_delete","y");
		var productList = li.find(".orderslists");
		var no_delete_num = 0;
		productList.each(function(k,v){
			if($(this).attr("is_delete")!="y"){
				no_delete_num++;
			}
		});
		if(no_delete_num==1){
			li.find(".del-import-product").hide();
		}
	});
	//单个订单取消
	$(page_id).on("click","#import-other-list .btn-cancel-import",function(){
		var li = $(this).closest(".live-order");
		li.find(".order-detail").remove();
	});
	
	//单个订单保存
	$(page_id).on("click","#import-other-list .btn-save-import",function(){
		var li = $(this).closest(".live-order");
		var order_data = li.find("input[name=import-order-data]").val();
		try{
			//使用base64加密JSON字符串  反之则base64解密JSON字符串 然后转换JSON对象
			order_data = JSON.parse($.Base64.decode(order_data));
		}catch(e){
			layer.alert("数据异常！");
			return;
		}
		var mr_select_str = "请选择";
		// var import_order_product_template = $("#import_order_product_template").html();
		order_data.sales_order_sn = li.find("input[name=import_order_sn]").val();
		order_data.shop_amount = li.find("input[name=import_shop_amount]").val();
		order_data.order_amount = order_data.shop_amount;
		order_data.consignee = li.find("input[name=import_consignee]").val();
		order_data.mobile = li.find("input[name=import_mobile]").val();
		order_data.province = li.find("select[name=import_province] option:selected").html();
		order_data.province = order_data.province==mr_select_str?"":order_data.province;
		order_data.city = li.find("select[name=import_city] option:selected").html();
		order_data.city = order_data.city==mr_select_str?"":order_data.city;
		order_data.district = li.find("select[name=import_district] option:selected").html();
		order_data.district = order_data.district==mr_select_str?"":order_data.district;
		order_data.address = li.find("input[name=import_address]").val();
		order_data.id_card_number = li.find("input[name=import_id_card_number]").val();
		var imported_goods_list = li.find(".imported-goods-list .imported-goods");
		var goods_index = 0;
		var goods_list = new Array();
		var is_trade_sku_flag_import = true; 
		for(var i=0;i<imported_goods_list.length;i++){
			var goods = order_data.goodsList[goods_index];
			// imported_goods_list.append(import_order_product_template);
			var imported_goods = imported_goods_list.eq(i);
			var is_delete = imported_goods.attr("is_delete");
			if(is_delete=="y"){
				continue;
			}
			goods.sku = imported_goods.find("input[name=import_goods_sn]").val();
			goods.ht_goods_name = imported_goods.find("input[name=import_sku_name]").val();
			goods.quantity = imported_goods.find("input[name=quantity]").val();
			goods.goods_name = imported_goods.find("input[name=import_goods_name]").val();
			goods.ht_price = imported_goods.find("input[name=import_goods_prices]").val();
			goods_list[goods_index] = goods;
			goods_index++;
			var is_trade = parseInt(imported_goods.find("input[name=quantity]").attr("is_trade_sku"));
			if(is_trade==0&&is_trade_sku_flag_import){
				is_trade_sku_flag_import = false;
			}
		}
		if(!is_trade_sku_flag_import){
			if($.string.isEmpty(order_data.id_card_number)){
				layer.tips("收货人身份证号不能为空！",li.find("input[name=import_id_card_number]"));
				return;
			}
			if(!$.string.isCardID(order_data.id_card_number)){
				layer.tips("身份证号码格式不正确或已失效！",li.find("input[name=import_id_card_number]"));
				return;
			}
		}
		order_data.goodsList = goods_list;
		li.find("input[name=import-order-data]").val($.Base64.encode(JSON.stringify(order_data)));
		var saveOneSalesOrderCall = function(results){
			if(results.code=="0X0000"){
				li.find(".order-detail").hide();
				li.find("input[name=import-order-data]").val($.Base64.encode(JSON.stringify(order_data)));
				layer.alert("保存修改成功！",{icon:6});
			}else{
				layer.alert(results.message,{icon:6});
			}
		};
		htService.saveOneSalesOrder(saveOneSalesOrderCall,taskId,order_data.index,JSON.stringify(order_data));
	});
	//单个订单删除
	$(page_id).on("click","#import-other-list .link-delete-order",function(){
		var li = $(this).closest(".live-order");
		var order_data = li.find("input[name=import-order-data]").val();
		try{
			//使用base64加密JSON字符串  反之则base64解密JSON字符串 然后转换JSON对象
			order_data = JSON.parse($.Base64.decode(order_data));
		}catch(e){
			layer.alert("数据异常！");
			return;
		}
		var deleteUploadSalesOrderCall = function(results){
			if(results.code=="0X0000"){
				li.remove();
				layer.alert("删除成功！",{icon:6});
			}else{
				layer.alert(results.message,{icon:6});
			}
		};
		htService.deleteUploadSalesOrder(deleteUploadSalesOrderCall,taskId,order_data.index);
	});
}
//获取B端 订单数据
function getSalesOrderList(state,offset,limit){
	if(!offset){
		offset = 0;
	}
	if(!limit){
		limit = 10;
	}
	var order_state = $.string.isEmpty(state)?checkState:state;
	var keyword = $(page_id+" #keyword").val();
	var add_time_start = start_time_val.val();
	var add_time_end = end_time_val.val();
	var getSalesOrderListCall = function(results){
		if(results.code=="0X0000"){
			var data = results.data;
			
			var list = data.list;
			updTableHtml(list,state);
			edit_div.hide();
			$("#add-goods-list .orderslists").remove();
			$("#editsaleorder input").val("");
			J_BoughtTable.show();
			if($.string.isNotEmpty(state)&&parseInt(state)==4){
				export_filter = data.filter;
				$.page.htPage($("#logistics_pager"),export_filter,export_backCall);
			}else{
				filter = data.filter;
				$.page.htPage($(page_id+" #pager"),filter,backCall);
				//获取不同类型订单的总数
				getSalesOrderCount();
			}
			if(list.length==0){
				$(page_id+" #pager").hide();
				$(page_id+" #not-date").show();
			}else{
				$(page_id+" #pager").show();
				$(page_id+" #not-date").hide();
			}
			
		}else{
			layer.alert(results.message,{icon:6});
		}
		
	};
	htService.getSalesOrderList(getSalesOrderListCall,"add_time","DESC",offset,limit,order_state,"1","0", keyword,add_time_start,add_time_end);
}
//获取符合条件的采购单总数
function getSalesOrderCount(){
	var keyword = $(page_id+" #keyword").val();
	var getSalesOrderCountCall = function(results){
		if(results.code=="0X0000"){
			var data = results.data;
			for(var key in data){
				var value = parseInt(data[key]);
				if(value>0){
					$(page_id+" #"+key).html(value);
				}else{
					$(page_id+" #"+key).html(0);
				}
			}
		}else{
			layer.alert(results.message,{icon:6});
		}
	}
	htService.getSalesOrderCount(getSalesOrderCountCall, null, keyword);//,checkState
}
//获取指定的采购单
function getSalesOrder(purchase_order_id,type){
	var getSalesOrderCall = function(results){
		if(results.code=="0X0000"){
			var list = [results.data];
			if(type=="edit"){
				if(list.length==0){
					layer.alert("订单数据不存在！",{icon:6});
					return;
				}
				bindEditHtml(list);
				J_BoughtTable.hide();
				edit_div.show();
			}else{
				updTableHtml(list);
			}
			$(page_id+" #pager").hide();
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.getSalesOrder(getSalesOrderCall,purchase_order_id,1,0);
}

//取消订单
function cancelSellOrder(order_id,$this){
	var cancelSalesOrderCall = function(results){
		if(results.code=="0X0000"){
			if($this){
				var $tbody = $this.closest("tbody");
				$tbody.find(".status").html("已取消");
				$tbody.find(".trade-operate").html("");
				getSalesOrderCount();
			}else{
				backCall(filter.page,filter.page_size);
			}
			layer.msg("取消成功!");
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.cancelSalesOrder(cancelSalesOrderCall,order_id);
}


//发货通知
function notifySalesOrder(order_id,$this){
	var notifySalesOrderCall = function(results){
		if(results.code=="0X0000"){
			if($this){
				var $tbody = $this.closest("tbody");
				$tbody.find(".status").html("通知发货处理中");
				$tbody.find(".trade-operate").html("");
				getSalesOrderCount();
			}else{
				backCall(filter.page,filter.page_size);
			}
			layer.alert("操作成功!");
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.notifySalesOrder(notifySalesOrderCall,order_id);
}

//缺货订单导出
function exporLackOutMulti(order_id){
    $.redirect("exportLackOutMulti", {
        sales_order_id: order_id
    }, "_blank");
}

//缺货订单导出
J_BoughtTable.on("click",".J_exporLackOutALL",function(){
    $.redirect("exportLackOutAll",'','_blank');
});

//确认收货
function receiveSalesOrder($this){
	var order_id = $this.attr("order_id");
	var receiveSalesOrderCall = function(results){
		if(results.code=="0X0000"){
			var $tbody = $this.closest("tbody");
			$tbody.find(".status").html("确认收货");
			$tbody.find(".trade-operate").html("");
			getSalesOrderCount();
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.receiveSalesOrder(receiveSalesOrderCall,order_id);
}

//编辑销售订单
function editSalesOrder(){
	var param = getSalesOrderData();
	if(!param){
		return;
	}
	var editSalesOrderCall = function(results){
		if(results.code=="0X0000"){
			clearSalesOrderData();
			//询问框
			layer.confirm('修改成功！是否跳转列表界面？', {
			  btn: ['确定','取消'] //按钮
			}, function(){
				//根据当前页数回调接口
			    backCall(filter.page,filter.page_size);
			}, function(){
			  
			});
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.editSalesOrder(editSalesOrderCall,param);
}

//创建订单
function createSalesOrder(){
	var param = getSalesOrderData();
	if(!param){
		return;
	}
	var createSalesOrderCall = function(results){
		if(results.code=="0X0000"){
			clearSalesOrderData();
			//询问框
			layer.confirm('新增成功！是否跳转列表界面？', {
			  btn: ['确定','取消'] //按钮
			}, function(){
				//根据当前页数回调接口
			    backCall(filter.page,filter.page_size);
			}, function(){
			  	
			});
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.createSalesOrder(createSalesOrderCall,param);
}
//获取表单数据
function getSalesOrderData(){
	var param = {};
	if(operation_type.val()=="edit"){
		param.sales_order_id = sales_order_id.val();
	}
	//平台类型
	// param.site_type = site_type.find(":selected").val();
	//平台店铺名称
	// param.site_name = site_name.find(":selected").val();
	//平台订单号
	param.sales_order_sn = sales_order_sn.val().replace(/\s/g, "");//去空格
	//店铺应收金额
	param.shop_amount = shop_amount.val();
	//订单总额
	// param.order_amount = $(page_id+" input[name=order_amount]").val();
	//实付款
	// param.shop_amount = $(page_id+" input[name=shop_amount]").val();
	//物流费用
	// param.shipping_fee = $(page_id+" input[name=shipping_fee]").val();
	//顾客购买时间	
	// param.pay_time = $(page_id+" input[name=pay_time]").val();
	//支付方式	
	param.payment_info_method = payment_info_method.find(":selected").val();
	//支付交易号
	param.payment_info_number = payment_info_number.val();
	//支付人姓名
	param.payment_info_name = payment_info_name.val();
	//支付人身份证
	param.payment_info_id_card_number = payment_info_id_card_number.val();
	//收货人姓名	
	param.consignee = consignee.val();
	//手机号码
	param.mobile = mobile.val();
	//收货人身份证号
	param.id_card_number = id_card_number.val();
	//收货人省份	
	param.province_id = province.find(":selected").val();
	//收货人城市
	param.city_id = city.find(":selected").val();
	//收货人地区	
	param.district_id = district.find(":selected").val();
	//收货人省份	
	param.province = province.find(":selected").html();
	//收货人城市
	param.city = city.find(":selected").html();
	//收货人地区	
	param.district = district.find(":selected").html();
	//收货人详情地址	
	param.address = address.val();
	//是否通知发货
	param.is_check = is_check.is(":checked")?"yes":"no";

	if($.string.isEmpty(param.sales_order_sn)){
		layer.tips("平台订单号不能为空！",sales_order_sn);
		return false;
	}

	if (userInfo.user_type == 3) {
		if($.string.isEmpty(param.shop_amount)){
			layer.tips("店铺应收金额不能为空！",shop_amount);
			return false;
		}
	}

	if(!$.string.isEmpty(param.shop_amount) && !$.string.isMoney(param.shop_amount)){
		layer.tips("金额格式不正确！",shop_amount);
		return false;
	}

	if($.string.isEmpty(param.consignee)){
		layer.tips("收货人姓名不能为空！",consignee);
		return false;
	}
	if($.string.isEmpty(param.province_id)||parseInt(param.province_id)==-1){
		layer.tips("请选择收货人省份！",province);
		return false;
	}
	if($.string.isEmpty(param.city_id)||parseInt(param.city_id)==-1){
		layer.tips("请选择收货人城市！",city);
		return false;
	}
	if($.string.isEmpty(param.district_id)||parseInt(param.district_id)==-1){
		layer.tips("请选择收货人地区！",district);
		return false;
	}
	if($.string.isEmpty(param.address)){
		layer.tips("收货人详情地址不能为空！",address);
		return false;
	}
	if($.string.isEmpty(param.mobile)){
		layer.tips("收货人手机号不能为空！",mobile);
		return false;
	}
	if(!$.string.isMobile(param.mobile)){
		layer.tips("收货人手机号格式不正确！",mobile);
		return false;
	}
	
	var orderslists = $(page_id+" .orderslists");
	var goods_list = new Array();
	var isErrorTips = true;
	var is_trade_sku_flag = true;
	orderslists.each(function(k,v){
		var goods = {};
		var quantity = $(this).find("input[name=quantity]");
		var sku = $(this).find("input[name=goods_sn]").val().replace(/\s/g, "");
		if($.string.isEmpty(sku)){
			layer.tips("商品编号不能为空！",$(this).find("input[name=goods_sn]"));
			isErrorTips = false;
			return;
		}
		var quantity = $(this).find("input[name=quantity]").val();
		if($.string.isEmpty(quantity)){
			layer.tips("商品数量不能为空！",$(this).find("input[name=quantity]"));
			isErrorTips = false;
			return;
		}
		var goods_prices = $(this).find("input[name=goods_prices]").val();
		if($.string.isEmpty(goods_prices)){
			layer.tips("商品价格不能为空！",$(this).find("input[name=goods_prices]"));
			isErrorTips = false;
			return;
		}

		//验证是否全部是一般贸易产品
		var is_trade = parseInt($(this).find("input[name=quantity]").attr("is_trade_sku"));
		if(is_trade==0&&is_trade_sku_flag){
			is_trade_sku_flag = false;
		}
		goods.sku = sku;
		goods.quantity = quantity;
		goods.sales_price = goods_prices;
		goods_list[k] = goods;
		//C端用户和普通B端用户 需要验证数量是否小于最小起批量  高级B端用户不用验证
		var min_sale_quantity = $(this).find("input[name=quantity]").attr("min_sale_quantity");
		if($.isSaleNumber() && parseInt(quantity)<parseInt(min_sale_quantity)){
			layer.tips("不能小于最小起够量:"+min_sale_quantity,$(this).find("input[name=quantity]"));
			isErrorTips = false;
			return;
		}
	});
	if(!isErrorTips){
		return false;
	}
	if(!is_trade_sku_flag){
		if($.string.isEmpty(param.id_card_number)){
			layer.tips("收货人身份证号不能为空！",id_card_number);
			return false;
		}
		if(!$.string.isCardID(param.id_card_number)){
			layer.tips("身份证号码格式不正确或已失效！",id_card_number);
			return false;
		}
	}
	param.goodsList = JSON.stringify(goods_list);
	return param;
}
//更新编辑HTML
function bindEditHtml(list){
	var sales_order = list[0];
	var goods_list = sales_order.goods;
	sales_order_id.val(sales_order.sales_order_id);
	sales_order_sn.val(sales_order.sales_order_sn);
	shop_amount.val(sales_order.shop_amount);
	payment_info_number.val(sales_order.payment_info_number);
	payment_info_name.val(sales_order.payment_info_name);
	payment_info_id_card_number.val(sales_order.payment_info_id_card_number);
	consignee.val(sales_order.consignee);
	mobile.val(sales_order.mobile);
	id_card_number.val(sales_order.id_card_number.replace(/\s/g, ""));
	address.val(sales_order.address);
	if(sales_order.is_check=="yes"){
		is_check.prop("checked",true);
	}else{
		is_check.prop("checked",false);
	}
	// site_type.find("option[value="+sales_order.site_type+"]").prop("checked",true);
	// site_name.find("option[value="+sales_order.site_name+"]").prop("checked",true);
	payment_info_method.find("option[value="+sales_order.payment_info_method+"]").prop("checked",true);
	if($.string.isNotEmpty(sales_order.province_id)&&parseInt(sales_order.province_id)!=0){
		province.find("option[value="+sales_order.province_id+"]").prop("selected",true);
		province.change();
	}else{
		province.append('<option value="-1">'+sales_order.province+'</option>');
		province.find("option[value=-1]").prop("selected",true);
	}
	if($.string.isNotEmpty(sales_order.city_id)&&parseInt(sales_order.city_id)!=0){
		city.find("option[value="+sales_order.city_id+"]").prop("selected",true);
		city.change();
	}else{
		city.append('<option value="-1">'+sales_order.city+'</option>');
		city.find("option[value=-1]").prop("selected",true);
	}
	if($.string.isNotEmpty(sales_order.city_id)&&parseInt(sales_order.city_id)!=0){
		district.find("option[value="+sales_order.district_id+"]").prop("selected",true);
	}else{
		district.append('<option value="-1">'+sales_order.district+'</option>');
		district.find("option[value=-1]").prop("selected",true);
	}
	
	for(var i=0;i<goods_list.length;i++){
		var goods = goods_list[i];
		$(page_id+" #add-goods-btn").trigger("click");
		var orders = add_goods_list.find(".orderslists").eq(i);
		orders.find("input[name=goods_sn]").val(goods.sku);
		orders.find("input[name=quantity]").val(goods.quantity);
		orders.find("input[name=quantity]").attr("max_sale_quantity",goods.max_sale_quantity);
		orders.find("input[name=quantity]").attr("min_sale_quantity",goods.min_sale_quantity);
		orders.find("input[name=goods_prices]").val(parseFloat(goods.sales_price).toFixed(2));
		orders.find("input[name=sku_name]").val(goods.goods_name);
		orders.find("input[name=goods_name]").val(goods.goods_name);
	}

	// 直营平台账号限制
	if (userInfo.user_type == 3 || sales_order.from_api == 1) {
		sales_order_sn.prop("readonly", true);
	} else {
		sales_order_sn.prop("readonly", false);
	}

	// 公共 API 推过来的订单 限制
	if (sales_order.from_api==1) {
		shop_amount.prop("readonly", true);
	} else {
		shop_amount.prop("readonly", false);
	}
}


//清空表单数据
function clearSalesOrderData(){
	sales_order_sn.val("");
	payment_info_number.val("");
	payment_info_name.val("");
	payment_info_id_card_number.val("");
	consignee.val("");
	mobile.val("");
	id_card_number.val("");
	address.val("");
	is_check.prop("checked",false);
	var orderslists = $(page_id+" .orderslists");
	orderslists.each(function(k,v){
		if(k=0){
			$(this).find("input[name=goods_sn]").val("");
			$(this).find("input[name=quantity]").val(1);
			$(this).find("input[name=goods_prices]").val("0.00");
		}else{
			$(this).remove();
		}
	});
}


//更新列表HTML
function updTableHtml(list,state){
	if(list.length==0){
		J_BoughtTable.find("thead,tfoot").hide();
	}
	
	var productHtml = "";
	for(var n=0;n<list.length;n++){
		var product = list[n];
		var goods = product.goods;
		var goodsHtml = "";	
		var cancel_able = parseInt(product.cancel_able)==1 ? true:false;
		var edit_able = parseInt(product.edit_able)==1 ? true:false;
		var notify_able = parseInt(product.notify_able)==1 ? true:false;
		var split_able = parseInt(product.split_able)==1 ? true:false;
		var isCardID = true;
		var isCardInfo = "";
		var id_card_number = product.id_card_number;
		var order_status_str = product.order_status_str;
		//if(!$.string.isCardID(id_card_number)){
		//	isCardInfo = "身份证有误";
		//	isCardID = false;
		//}
		var order_status = product.order_status;
    	var orderStatus = $.valida.sellOrderStatus(order_status);
    	//通知发货失败  错误信息
		if(order_status_str == 'SALES_ORDER_STATUS_NOTIFY_FAIL'){
			orderStatus = '通知发货失败';
		}
		productHtml += '<tbody class="combo-order close-order xcard">'+
            '<tr class="sep-row"><td colspan="7"></td></tr>'+
            '<tr class="order-hd"><td class="first"><div class="summary">'+
            '<span><input name="order_ids[]" type="checkbox" value="'+product.sales_order_id+'" '+
            'class="J_Selector selector" data-order-id="'+product.sales_order_id+'"></span>'+
            '<span class="number">发货单号：<em>'+product.sales_order_id+'</em></span>'+
            '<span class="number last-item">平台订单号：'+
            '<em>'+product.sales_order_sn+'</em></span></div></td>'+
            '<td class="column" colspan="2"><span class="number last-item" style="margin-left:5px;">'+
            '收货人：<em>'+product.consignee+'</em></span></td>'+
            '<td class="column" colspan="3"><span>下单时间：'+
            '<em>'+product.add_time+'</em></span>'+
            '</td>'+
            '<td class="last" colspan="1"><a class="qq-contact" target="_blank" style="margin-left:0px;"'+
            'href="http://wpa.qq.com/msgrd?v=3&amp;uin=2210557946&amp;site=qq&amp;menu=yes">'+
            '联系客服</a></td></tr>'+
            '<tr class="col-name"><td class="baobei">商品</td>'+
            '<td class="item-operate">海豚商品编号</td><td class="price">数量</td>'+
            // '<td class="quantity" >我的总库存</td>'+
            '<td class="available">可用库存</td><td class="amount">网站库存</td>'+
            '<td class="trade-status">订单状态</td><td class="trade-operate">订单操作</td></tr>';
        for(var i=0;i<goods.length;i++){
        	var item = goods[i];
        	var quantity = parseInt(item.quantity);
			goodsHtml += '<tr class="order-bd"><td class="baobei">'+
                '<a class="pic goodsdetails" data-sku="'+item.sku+'" href="javascript:void(0);" style="position: relative;">'+
				'<img class="img-responsive lazy" src="'+item.img_thumb+'" '+
				'data-original="'+item.img_original+'" '+
				'alt="查看宝贝详情" style="display: block;"></a>'+
                '</a><div class="desc"><p class="baobei-name">'+
                '<a href="javascript:void(0);" goods-id="'+item.goods_id+'" class="J_MakePoint goodsdetails" data-sku="'+item.sku+'">'+item.goods_name+'</a></p>'+
                '<div class="spec" title="'+item.sales_goods_name+'"><span>'+item.sales_goods_name+'</span></div></div></td>'+
                '<td class="item-operate"><div>'+item.sku+'</div>';
                '<div>';
            goodsHtml += '<a style="display:inline-block;" href="javascript:void(0);" goods-id="'+item.goods_id+'" data-sku="'+item.sku+'" target="_blank" class="goodsdetails">';
			if(order_status == states.CREATE&&parseInt(quantity)>parseInt(item.mw_available_stock)){
				goodsHtml+='<font color="red">去采购</font></a>'
			}
			goodsHtml+='</div></td>'+
                '<td class="price"><em class="special-num">'+item.quantity+'</em></td>'+
                // '<td class="quantity"><em class="special-num c-brand">'+item.mw_stock+'</em></td>'+
                '<td class="quantity"><em class="special-num c-brand">'+item.mw_available_stock+'</em></td>'+
                '<td class="amount td-last"><em class="special-num">'+item.stock+'</em></td>';
            if(i==0){

				
                goodsHtml += '<td class="trade-status td-last" rowspan="'+goods.length+'"><div>'+
	                '<a href="javascript:void(0);" order_id="'+product.sales_order_id+'" '+
	                'class="J_MakePoint status">'+orderStatus+'</a></div><div>'+
	                '<a href="javascript:void(0);" order_id="'+product.sales_order_id+'" '+
	                'data-id="'+product.sales_order_sn+'" class="detail-link J_MakePoint ">'+
	            	'订单详情</a></div>';
	            if((order_status == states.CREATE||order_status == states.NOTIFY_FAIL)&&!isCardID){
					goodsHtml+='<font color="red">'+isCardInfo+'</font>';
				}
				//通知发货失败  错误信息
				if(order_status_str == 'SALES_ORDER_STATUS_NOTIFY_FAIL'){
					goodsHtml+='<font color="red">'+product.order_status_message+'</font>'
				}
	            goodsHtml += '</td><td class="trade-operate td-last" rowspan="'+goods.length+'">';
	            if(order_status == states.NOTIFY){
	            	goodsHtml += '<div><input class="btn btn-primary confirm-goods" order_id="'+product.sales_order_id+'" type="button" value="确认收货" ></div>';
	            }
	            //是否通知发货
	            if(notify_able&&isCardID){
	            	goodsHtml += '<div><a href="javascript:void(0);" class="J_notice_sales" data-order-id="'+product.sales_order_id+'">通知发货</a></div>';
	            }
	            //是否取消订单
	        	if(cancel_able){
	                goodsHtml += '<div><a href="javascript:void(0)" class="J_cancle_sales" data-order-id="'+product.sales_order_id+'">取消订单</a></div>';
	            }
	            //是否修改订单
	            if(edit_able){
	            	goodsHtml += '<div><a href="javascript:void(0);" class="J_edit_sales" data-order-id="'+product.sales_order_id+'">修改订单</a></div>';
	            }
				//拆单
				if(split_able){
					goodsHtml += '<div><a href="'+$.homeU("Index/splitSalesOrder", {'sales_order_id':product.sales_order_id})+'" class="J_split_sales" data-order-id="'+product.sales_order_id+'" target="_blank">拆单</a></div>';
				}
	            goodsHtml+='</td>';
            }
            goodsHtml += '</tr>';
        }
        productHtml += goodsHtml;
		productHtml += '</tbody>';
	}
	J_BoughtTable.find("tbody").remove();
	if($.string.isNotEmpty(state)&&parseInt(state)==4){
		logistics_content.find("#J_BoughtTable").append(productHtml);
	}else{
		J_BoughtTable.append(productHtml);
	}
}


 /*问号提示*/

popover('.tzfh i.tellorder', '当您的微仓库存充足时，可以勾选此项一键实现提交订单并通知发货。' +
    '当您只是想录入销售订单但还不准备发货，勿勾选此项。');
popover('.neworders .singleorder i.ordernum', '代发商的销售订单编号。');
popover('.neworders .singleorder i.cardnum', '请检查姓名与身份证请保持一致，否则海关拦截不允许发货。');
popover('.neworders .singleorder i.cardz', '可以选择性上传身份证件正反面照片，以方便快速清关入境。');
popover('.neworders .singleorder i.paytotal', '包裹对应的实际支付金额。');
popover('.neworders .singleorder i.spbianhao', '本网站商品的编号，在产品详情页面和微仓库存页面都有显示。' +
    '每种商品对应唯一的编号，请准确输入。');
popover('.neworders .singleorder i.shoptype', '为了您的客户搞清楚此订单包裹是哪个店铺拍的，以便于及时确认收货，快速回款，' +
    '请务必准确填写，此名称会打印在物流面单上，和包裹内的清单上面。');
popover('.neworders .singleorder i.ordername', '您店铺对应的商品名称，只需输入一次，系统会自动匹配到海豚供应链对应的商品。');
popover('.neworders .singleorder i.method', '您需要选择您的支付方式，以方便快速清关入境。');
popover('.neworders .singleorder i.numerical', '您需要输入您的支付交易号，以方便快速清关入境。');
$('body').on('mouseenter', '.neworders .singleorder i.ordername', function () {
    popover('.neworders .singleorder i.ordername', '您店铺对应的商品名称，只需输入一次，' +
        '系统会自动匹配到海豚供应链对应的商品。');
})
$('body').on('mouseenter', '.neworders .singleorder i.spbianhao', function () {
    popover('.neworders .singleorder i.spbianhao', '本网站商品的编号，在产品详情页面和微仓库存页面都有显示。' +
        '每种商品对应唯一的编号，请准确输入。');
})
function popover(el, txt) {
    $(el).popover({
        'placement': 'right',
        'container': 'body',
        'content': txt,
        html: true,
        trigger: 'hover'
    })
}

/*问号提示*/
//海豚商品编号 文本框 编辑 预绑定事件
$(page_id).on("keyup","input[name=goods_sn]",function(){
	getStockList($(this));
});
$(page_id).on("focus","input[name=goods_sn]",function(){
	getStockList($(this));
});
$(page_id).on("blur","input[name=goods_sn]",function(){

	var orderslists = $(this).closest('.orderslists');
	var getGoodsInfoCall = function(results){
		if(results.code=="0X0000"){
			var data = results.data;
			var goods_sn_input = orderslists.find("input[name=goods_sn]");
			var sku_name = orderslists.find("input[name=sku_name]");
			var quantity = orderslists.find("input[name=quantity]");
			var goods_prices = orderslists.find("input[name=goods_prices]");
			// goods_sn_input.val(sku);
			sku_name.val(data.goods_name);

			quantity.attr("is_modulo",data.is_modulo);
			quantity.attr("min_sale_quantity",data.min_sale_quantity);
			quantity.attr("max_sale_quantity",data.max_sale_quantity);
			quantity.attr("is_trade_sku",data.is_trade_sku);
			goods_prices.val(data.price);
			orderslists.find(".sku-box").hide();
			//C端用户和普通B端用户 需要验证数量是否小于最小起批量  高级B端用户不用验证
			var quantityVal = quantity.val();
			if(parseInt(quantityVal)==0){
				quantity.val(data.min_sale_quantity);
				return;
			}
			if($.isSaleNumber() && parseInt(quantityVal)<parseInt(data.min_sale_quantity)){
				layer.tips("不能小于最小起够量:"+data.min_sale_quantity,quantity);
			}
		}else if(results.code=="0X0010"){
			//商品不存在不做任何处理
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.getGoodsInfo(getGoodsInfoCall,$(this).val());
});

//选中查询出来的微仓库存商品  预绑定事件
$(page_id).on("click",".sku-list-sku",function(){
	var sku = $(this).find(".sku-text").html();
	var goods_name = $(this).find(".sku-list-name").html();
	var is_modulo = $(this).find("input[name=is_modulo]").val();
	var min_sale_quantity = $(this).find("input[name=min_sale_quantity]").val();
	var max_sale_quantity = $(this).find("input[name=max_sale_quantity]").val();
	var is_trade_sku = $(this).find("input[name=is_trade_sku]").val();
	var price = $(this).find("input[name=price]").val();
	var orderslists = $(this).closest('.orderslists');
	var goods_sn_input = orderslists.find("input[name=goods_sn]");
	var sku_name = orderslists.find("input[name=sku_name]");
	var quantity = orderslists.find("input[name=quantity]");
	var goods_prices = orderslists.find("input[name=goods_prices]");
	
	goods_sn_input.val(sku);
	sku_name.val(goods_name);

	quantity.attr("is_modulo",is_modulo);
	quantity.attr("min_sale_quantity",min_sale_quantity);
	quantity.attr("max_sale_quantity",max_sale_quantity);
	quantity.attr("is_trade_sku",is_trade_sku);
	goods_prices.val(price);
	$(".sku-box").hide();
	//C端用户和普通B端用户 需要验证数量是否小于最小起批量  高级B端用户不用验证
	var quantityVal = quantity.val();
	if(parseInt(quantityVal)==0){
		quantity.val(min_sale_quantity);
		return;
	}
	if($.isSaleNumber() && parseInt(quantityVal)<parseInt(min_sale_quantity)){
		layer.tips("不能小于最小起够量:"+min_sale_quantity,quantity);
	}
});
 
//数量-1 +1 预绑定事件
$(page_id).on("click",".spice,.plus",function(){
	var orderslists = $(this).closest('.orderslists');
	var quantity = orderslists.find("input[name=quantity]");
	var is_modulo = parseInt(quantity.attr("is_modulo")|0);
	var min_sale_quantity = parseInt(quantity.attr("min_sale_quantity"));
	var max_sale_quantity = parseInt(quantity.attr("max_sale_quantity"));
	var num = parseInt(quantity.val());
	if(is_modulo==1){
		if($(this).hasClass("spice")){
			if($.isSaleNumber()&&num<=min_sale_quantity){
				num = min_sale_quantity;
				layer.tips("不能小于最小起购量："+min_sale_quantity,quantity);
				return;
			}
			num -= min_sale_quantity;
			if(num<=0){
				num = 1;//min_sale_quantity;
			}
		}else{
			if(num>max_sale_quantity&&max_sale_quantity!=0){
				num = max_sale_quantity;
				layer.tips("不能大于最大发货量："+max_sale_quantity,quantity);
				return;
			}
			num += min_sale_quantity;
		}
	}else{
		if($(this).hasClass("spice")){
			if($.isSaleNumber()&&num<=min_sale_quantity){
				num = min_sale_quantity;
				layer.tips("不能小于最小起购量："+min_sale_quantity,quantity);
				return;
			}
			--num;
			if(num<=0){
				num = 1;//min_sale_quantity;
			}
		}else{
			if(num>max_sale_quantity&&max_sale_quantity!=0){
				num = max_sale_quantity;
				layer.tips("不能大于最大发货量："+max_sale_quantity,quantity);
				return;
			}
			++num;
		}
	}
	quantity.val(num);
});
//数量  预绑定事件
$(page_id).on("blur","input[name=quantity]",function(){
	var orderslists = $(this).closest('.orderslists');
	var quantity = orderslists.find("input[name=quantity]");
	var is_modulo = parseInt(quantity.attr("is_modulo")|0);
	var min_sale_quantity = parseInt(quantity.attr("min_sale_quantity")|0);
	var max_sale_quantity = parseInt(quantity.attr("max_sale_quantity")|0);
	var num = parseInt(quantity.val()|0);
	if($.isSaleNumber()&&num<=min_sale_quantity){
		num = min_sale_quantity;
		layer.tips("不能小于最小起购量："+min_sale_quantity,quantity);
		quantity.val(num);
		return;
	}
	if(num==0&&$.isSaleNumber()){
		num = min_sale_quantity;
	}else if(num==0&&!$.isSaleNumber()){
		num = 1;
	}
	if(num>max_sale_quantity&&max_sale_quantity!=0){
		num = max_sale_quantity;
		layer.tips("不能大于最大发货量："+max_sale_quantity,quantity);
		quantity.val(num);
		return;
	}
	if(is_modulo==1&&num%min_sale_quantity!=0){
		//成倍模式下 向下取整
		num = Math.floor(num/min_sale_quantity)*min_sale_quantity;
	}
	quantity.val(num);
});
//获取微仓库存
function getStockList(item){
	$this = item;
	var getStockListCall = function(results){
		if(results.code=="0X0000"){
			var data = results.data;
			if(data.length==0){
				$this.parent().find(".sku-box").html("").hide();
				return;
			}
			var list = data.list;
			updStockHtml(list,$this);
		}else{
			layer.alert(results.message,{icon:6});
		}
	};
	htService.getStockListNew(getStockListCall,$this.val(),"","",1,1000,'gt');
}
//更新微仓库存HTML
function updStockHtml(list,$this){

	if(list.length == 0){
		$this.parent().find(".sku-box").hide();
		return ;
	}
	var stockHtml = '<ul>';
	for(var i=0;i<list.length;i++){
		var item = list[i];
		stockHtml += '<li class="sku-list-sku"><div>'+
		    '<span class="sku-text">'+item.sku+'</span>'+
		    '<span class="sku-list-counts ">可用库存：'+
		    '<span class="c-brand">'+item.available+'</span></span></div>'+
		    '<div><span class="sku-list-name">'+item.goods_name+'</span>'+
		    '<input type="hidden" name="is_modulo" value="'+item.is_modulo+'" />'+
		    '<input type="hidden" name="min_sale_quantity" value="'+item.min_sale_quantity+'" />'+
		    '<input type="hidden" name="max_sale_quantity" value="'+item.max_sale_quantity+'" />'+
		    '<input type="hidden" name="price" value="'+item.price+'" />'+
		    '<input type="hidden" name="is_trade_sku" value="'+item.is_trade_sku+'" />'+
		    '</div></li>'
	}
	stockHtml += '</ul>';
	$this.parent().find(".sku-box").html(stockHtml).show();
}
//1: 中国下什么的所有省份
$.getRegionList(province,1);

