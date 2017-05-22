//放大镜
$(function(){
	if($().imagezoom){
		$(".jqzoom").imagezoom({
			yzoom:400,
			xzoom:400
			});
		$("#thumblist li a").mouseover(function(){
			//增加点击的li的class:tb-selected，去掉其他的tb-selecte
			$(this).parents("li").addClass("tb-selected").siblings().removeClass("tb-selected");
			//赋值属性
			$(".jqzoom").attr('src',$(this).find("img").attr("mid"));
			$(".jqzoom").attr('rel',$(this).find("img").attr("big"));
		});
		}



	});
var goods_timer=null;

function chang_quantity(val,obj,type/*-1为减，0为加*/){
	var id = 'number';
	val && val != 0 && (id += val) ;
	var $id = $('#'+id);
	var new_num = $id.val();
	var min_num = parseInt($id.data('min'));
	    min_num =  min_num || 1;
	var max_num = parseInt($id.data('max'));
	var sale_policy = $id.data('salepolicy');
	var add_num = sale_policy == 'modulo' ? min_num : 1;

	if(isNaN(new_num)){alert('请输入数字');return false};

	new_num = parseInt(new_num);
	if(type == -1){
		if(new_num > min_num) new_num -= add_num;
		else return false;
		}
	else if(type == 0){
		if(max_num && new_num >= max_num) {
			return false;
			}
		else{
			new_num += add_num;
			}
		}
	$id.val(new_num);
	clearTimeout(goods_timer);
	goods_timer=setTimeout(function(){
	  get_price(obj,new_num);
	 },500);
	};


/*function goods_cut(val,obj){
	var id='number';
	if(val){
		id='number'+ val;
		}
	var num_val=document.getElementById(id);
	var new_num=num_val.value;

	if(isNaN(new_num)){alert('请输入数字');return false}
	var Num = parseInt(new_num);

	if(Num>1)Num=Num-1;

	num_val.value=Num;
	clearTimeout(goods_timer);
	goods_timer=setTimeout(function(){
	  get_price(obj,Num);
	 },500);

}
function goods_add(val,obj){
	var id='number';
	if(val){
		id='number'+ val;
		}
	var num_val=document.getElementById(id);
	var new_num=num_val.value;
	if(isNaN(new_num)){alert('请输入数字');return false};
	var Num = parseInt(new_num);
	Num=Num+1;
	num_val.value=Num;
	clearTimeout(goods_timer);
	goods_timer=setTimeout(function(){
	  get_price(obj,Num);
	 },500);
}*/

function get_price(el,num){
	var $el=$(el);
	var val='';
	var goods_id=$el.parents('[data-goods-id]').data('goods-id');
	var goods_num = num;
	var $active= $('#buy-box [data-spec-id].active');
	var goods_spec='[';
	var len=$active.length;
	if(len){
		$active.each(function(i){
		    var $this=$(this);
			var attr_id=$this.data('spec-id');
			var product_id=$this.data('product-id');
			if(i<len-1){
				goods_spec+='{"goods_attr_id":'+attr_id+'},';
				}
			else{
				goods_spec+='{"goods_attr_id":'+attr_id+'}]';
				}

		});
		val= '&goods_id='+goods_id+'&goods_num='+goods_num+'&spec='+goods_spec;
		}
	else{
		val= '&goods_id='+goods_id+'&goods_num='+goods_num;
		}
	//简单判断是否需要变动价格
	if($('#send_ajax').val()=='send_ajax'){
		$.ajax({
		type:'get',
		url:"goods.php?act=ajax_get_goods_price"+val,
		success:function(json){
			var data=$.parseJSON(json);
	        $('.goods-price .shop-price').text(data[0]);
			$('#c-profit').text(data[1]);
			}
		});
		}

	}
$(function(){

	/*$('.goods_cut').click(function(){
		var val=$(this).parent().find('.number').val();
		//goods_cut(val);
		});
	$('.goods_add').click(function(){
		var val=$(this).parent().find('.number').val();
		//goods_add(val);
		});*/

  var slickObj = $('.multiple-slider').slick({
        dots: false,
		lazyLoad:'progressive',
		onAfterChange:function(){
			var cur=parseInt(slickObj.slickCurrentSlide());
			$('.multiple-slider-box .cur').html(cur+1);
			//解决lazyload 进入第二屏不显示问题；
			var top=$(window).scrollTop()+1;
			$(window).scrollTop(top);
			$(window).scrollTop(top-1);
            $('.slick-cloned .lazy').each(function(){
				var $this=$(this);
				var original = $this.data('original');
				var src = $this.attr('src');
				if(original != src){
					$this.attr('src',original)
					}
				else{
					return false;
					}
				});

			},

		onInit:function(){
			var total=$('.multiple-slider-box .item').length;
			if(total>1){
				$('.multiple-slider-box .slider-index').show();
				$('.multiple-slider-box .total').html(total-2);
				}
			  else{
				  $('.multiple-slider-box .slider-index').hide();
				  }


			}

    });

	//数量变化
	$('#buy-box .dl-num .number').change(function(){
		 var selected=isSelect();
		 var $this=$(this);
		 var num = parseInt($this.val());
		 var sale_policy = $this.data('salepolicy');
		 var min_num =parseInt($this.data('min'));
		 min_num = min_num || 1;
		 if(sale_policy == 'modulo'){
			 var mod =num % min_num ;
				if(mod != 0 && mod != num){
					num -= mod;
					}
			 }
		 if (num <= min_num) {
            num = min_num;

          }
		  $this.val(num);
		 clearTimeout(goods_timer);
		  goods_timer=setTimeout(function(){
		   get_price($this,num);
		 },500);
		 if(selected){
			$('#buy-box.active .buy-btn').show().find('.btn').hide();
			$('#buy-box.active .buy-btn').find('.btn.beclick').show();
			}
		  else{
			  $('#buy-box.active .buy-btn').hide();
			  }
		});

	//尺码选择
    $('.sale-select li>a').click(function(){
		var $this=$(this);
		var selected=false;
		var $parent=$this.parents('.sale-select');
		var $all=$parent.find('li>a').not($this);
		var spec_id=$this.data('spec-id');
		var num = $this.data('num');
		var total = $this.data('total');
		$all.removeClass('active');
		$this.toggleClass('active');

		if($this.hasClass('active')){
			$parent.find("[id^='spec_value_']").prop('checked',false);
			$('#spec_value_'+spec_id).prop('checked',true);
			if(!$('.buy-btn .btn-quehuo').length){
				if(num > 0){
				$('#stock').html('库存 '+num+' 件');
				}
				else{
					$('#stock').html('缺货');
					}
				}


			}
		  else{
			  $('#spec_value_'+spec_id).prop('checked',false);
			  if(total > 0){
				$('#stock').html(' 库存 '+total+' 件 ');
				}
			  else{
				$('#stock').html('缺货');
				}
			  }
        clearTimeout(goods_timer);
			goods_timer=setTimeout(function(){
			  get_price($this,$('#number').val());
			 },50);
		selected=isSelect();
		if(selected){
			$('#buy-box.active .buy-btn').show().find('.btn').hide();
			$('#buy-box.active .buy-btn').find('.btn.beclick').show();
			}
		  else{
			  $('#buy-box.active .buy-btn').hide();
			  }
		});


	//立即购买
    var begTime = 20160301;
    var endTime = 20160331;
	$('#buy-box .buy-btn .btn').click(function(){

        // if( $.inArray($('.dl-horizontal:eq(0) dd').html(), ['DEAP006','AUDE001']) > -1 ) {
        //     if( $('#number').val() > 20 ) {
        //         alert('本品限购最多20件');
        //         return false;
        //     }
        // }

		 var $this=$(this);
		 var selected=isSelect();
		 var status=$this.data('status');
		 var id=$this.data('goods-id');
		 var buy_now=$this.data('buy-now');
		 $('#buy-box .buy-btn .btn').removeClass('beclick');
		 $this.addClass('beclick');
		 //全选后
		 if(selected){
			 if(status=='tocart'){
				 addToCart(id,0,0,status);
				 }
			 else if(status=='quehuo'){

				 location.href = 'user.php?act=add_booking&id=' + id+ '&spec=' + $('#buy-box a.active').data('spec-id') + '&diff_goods_num=' + $('#number').val();
				 }
			 else
			     addToCart(id,0,buy_now);
			 }
		//非全选
		else{
			if(status=='tocart'){
				layer.msg('请选择商品属性',1,{shade:false,type:13})
				}
			else{
				$('#buy-box').addClass('active');
			    $('#buy-box .buy-btn').hide();
				}

			}
		});



	$('#buy-box .close').click(function(){
		$('#buy-box').removeClass('active');
		$('#buy-box .buy-btn').show().find('.btn').removeClass('beclick').show();
		});



	//判断属性是否全选

	function isSelect(){
		var selected=false;
		var num=parseInt($('#buy-box .dl-num .number').val());
			if($('#buy-box .dl-sale').length==0)
			return true;
			$('#buy-box .dl-sale').each(function(){
			var len=$(this).find('.sale-select a.active').length;
			 if(len)
			 selected=true;
			 else{
				 selected=false;
				 return false;
				 }

			});
		 return selected;
		}
//打开评论页
$('#goods-info .goods-price .count-list').eq(0).click(function(){
	 $('.border-tabs .nav-tabs li').removeClass('active');
	  $('#li-comment').addClass('active');
	  $('.border-tabs .tab-pane').removeClass('active');
	  $('#comment').addClass('active');
	});
$('#goods-info .goods-price .count-list').eq(1).click(function(){
	  $('.border-tabs .nav-tabs li').removeClass('active');
	  $('#li-record').addClass('active');
	  $('.border-tabs .tab-pane').removeClass('active');
	  $('#record').addClass('active');
	});
});
/**
 * 描述 : 检测是否在促销时间内
 * 参数 : timeLimit
 *          {
 *              beginTime : 开始时间
 *              endTime   : 结束时间
 *          }
 *          示例 : "20150101"
 *                 "20150102"
 * 返回 :
 *      true  : 在范围内
 *      false : 不在范围内
 * 作者 : name.T
 */
/*
function checkTime(begTime,endTime) {
    var myDate = new Date();
    var cur_y = myDate.getFullYear();
    if((myDate.getMonth()+1) < 10 ) var cur_m = '0' + (myDate.getMonth()+1);
    if(myDate.getDate() < 10 )var cur_d = myDate.getDate();
    var cur_t = cur_y + cur_m + cur_d;
    if(cur_t >= begTime && cur_t <= endTime){
        return true;
    }else{
        return false;
    }
}*/


var data = decrypt(decode(_encrypt.data), decode(_encrypt.password));
eval('var goods = '+data+';');
for(var x in goods) {
	$(".encrypt-"+x).html(goods[x]);
}
