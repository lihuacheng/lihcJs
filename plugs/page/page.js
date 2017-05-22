/**
  * name:分页插件
  * author:lhc
  */
var jQuery = $;

/**
 * 定义$.page
 */
$.extend({page:{}});
/**
 * 定义$.page命名空间里面的方法
 */
$.extend($.page,{
  /**
    * 功能：分页
    * 参数：item：显示位置的DIV对象
    *       filter：{"page":1,"page_size":10,"record_count":2,"page_count":1}
    *       backCall：操作后 回调函数进行加载数据
    */
  htPage : function(item,filter,backCall){
    var page = parseInt(filter.page);//当前页数
    var page_count = parseInt(filter.page_count);//总页数
    var page_size = parseInt(filter.page_size);//每页几条
    var record_count = parseInt(filter.record_count);//读取多少条
    var strHtml = '<div><nav><ul class="pagination pagination_1 pull-left">';
    if(page!=1&&page_count>0){
        strHtml += '<li ><a href="javascript:void(0);" id="page-prev" class="pagination_11">上一页</a></li>';
    }
    if(page>3&&page_count>5){
      strHtml += '<li><a href="javascript:void(0);" class="pagination_13">....</a></li>';
    }
    var i=0;
    var j=page_count;
    if(page>3&&page_count>=(page+2)&&page_count>5){
      i = page-3;
      j = page+2;
    }else if(page<=3&&page_count>5){
      j = 5;
    }else if((page_count-3)<=page&&page_count>5){
      i = page_count-5;
    }
    for(;i<j;i++){
      if(i==(page-1)){
        strHtml += '<li><a href="javascript:void(0);" class="page-li pageCheck">'+(i+1)+'</a></li>';
      }else{
        strHtml += '<li><a href="javascript:void(0);" class="page-li">'+(i+1)+'</a></li>';
      }
    }
    if(page_count>5&&page_count>(page+2)){
      strHtml += '<li id="clear-hover"><a href="#" class="pagination_13">....</a></li>';
    }
    if(page_count!=page&&page_count>0){
      strHtml += '<li><a href="javascript:void(0);" id="page-next" class="pagination_12">下一页</a></li>';
    }
    strHtml += '</ul><div class="pagination_2  pull-left" >共<span>'+page_count+'</span>页，到第'+
              '<input id="page_num" class="pagination_21 page_num" type="text"/>页'+
              '<span id="checkPage" class="pagination_22">确定</span>'+
              '</div></nav></div>';
    item.html(strHtml);
    //上一页
    item.find("#page-prev").on("click",function(){
      filter.page = page-1;
      
      if(backCall){
        backCall(filter.page,filter.page_size);
      }
      // $.page.htPage(item,filter);
    });
    //下一页
    item.find("#page-next").on("click",function(){
      filter.page = page+1;
      
      if(backCall){
        backCall(filter.page,filter.page_size);
      }
      // $.page.htPage(item,filter);
    });
    //选中页数
    item.find(".page-li").on("click",function(){
      var check_li = $(this).html();
      filter.page = parseInt(check_li);
      if(backCall){
        backCall(filter.page,filter.page_size);
      }
    });
    //页数文本框
    item.find("#page_num").keyup(function(e){  
        var num = $(this).val();
        $(this).val(num.replace(/[^0-9]/g,''));  
        if(num<0){
          $(this).val(1);
        }else if(num>page_count){
          $(this).val(page_count);
        }
        if(e.keyCode==13){ 
          $("#checkPage").trigger("click");
        }
    }).bind("paste",function(){ //CTR+V事件处理  $(this).val($(this).val().replace(/[^0-9.]/g,''));   
    }).css("ime-mode", "disabled"); //CSS设置输入法不可用 
    //页数选择
    item.find("#checkPage").on("click",function(){
        var page_num = $("#page_num").val();
        if(typeof page_num!="undefined"&&page_num!=""&&page_num!=null){
          if(page_num>0&&page_num<=page_count){
            filter.page = page_num;
            
            if(backCall){
              backCall(filter.page,filter.page_size);
            }
            // $.page.htPage(item,filter);
          }
        }
    });
  }
});
