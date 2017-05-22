//页面级ID
var page_id = "#messageCenter"

var htService = $.htService;

var messageType = 0;//消息类型，默认为0  0=全部，1=发货提醒；2=缺货通知；3=库存提醒；4=公

var is_read = 0;//是否已读，默认为2  0,=未读，1=已读，2=全部

var filter = {
	page : 1,
	page_size : 10
};
getMessageList(filter.page,filter.page_size);

//消息类型
$(page_id+" #messageType").on("change",function(){
	getMessageList(0,10);
});

//全选OR反选
$(page_id+" #all-check").on("change",function(){
	var check_list = $(page_id+" #message-list input[name='messageId']");
	if($(this).is(':checked')){
		check_list.prop("checked",true);
	}else{
		check_list.prop("checked",false);
	}
	
});

//标记已读
$(page_id+" .mark-read,all-delete").on("click",function(){
	//选中的复选框
	var check_list = $(page_id+" #message-list input[name='messageId']:checked");
	if(check_list.length==0){
		layer.alert("请先勾选复选框！",{icon:6});
		return;
	}
	var messageIds = "";
	check_list.each(function(k,v){
		var id = $(this).val();
		if(k==0){
			messageIds += id;
		}else{
			messageIds = messageIds+","+id;
		}
	});
	readOrDel($(this).attr("class"),messageIds)
	
});

// //删除
// $(page_id+" .mark-read").on("click",function(){

// });

//获取消息列表
function getMessageList(page,page_size){
	messageType = $(page_id+" #messageType").val();
	var getMessageListCall = function(results){
		if(results.code=="0X0000"){
			var data = results.data;
			var list = data.list;
			filter = data.filter;
			$(page_id+" #record_count").html(filter.record_count);
			updTableHtml(list);
		}else{
			layer.alert(results.message,{icon:6});
		}
	}
	htService.getMessageList(getMessageListCall,filter.page,filter.page_size,messageType,is_read);
}

//分页回调
var backCall = function(page,page_size){
	getMessageList(page,page_size)
};

//更新消息列表html
function updTableHtml(list){
	var strHtml = "";
	if(list.length==0){
		$(page_id+" #pager").hide();
		$(page_id+" #message-list").hide();
		$(page_id+" #not-date").show();
	}else{
		$(page_id+" #pager").show();
		$(page_id+" #message-list").show();
		$(page_id+" #not-date").hide();
	}
	for(var i=0;i<list.length;i++){
		var item = list[i];
		strHtml += '<dl><dt><span><input type="checkbox" name="messageId" value="'+item.message_id+'" />'+
            '<em class="timer">'+item.add_time+'</em>，'+item.message_title+'</span>'+
            '<a href="" message-id="'+item.message_id+'" class="text-link">【查看详情】</a></dt>'+
            '<dd>'+item.message+'</dd></dl>';
	}
	$(page_id+" #message-list").html(strHtml);
	$.page.htPage($(page_id+" #pager"),filter,backCall);
}
//标记已读或删除 服务请求
function readOrDel(className,messageIds){
	if(className=="mark-read"){
		var setSelfReadIncCall = function(results){
			if(results.code=="0X0000"){
				getMessageList(filter.page,filter.page_size);
			}else{
				layer.alert(results.message,{icon:6});
			}
		};
		htService.setSelfReadInc(setSelfReadIncCall,messageIds);
	}else{
		var delSelfMsgCall = function(results){
			if(results.code=="0X0000"){
				getMessageList(filter.page,filter.page_size);
				layer.alert("消息删除成功！",{icon:6});
			}else{
				layer.alert(results.message,{icon:6});
			}
		};
		htService.delSelfMsg(delSelfMsgCall,messageIds);
	}
}