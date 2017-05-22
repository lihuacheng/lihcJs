var htService = $.htService;
getBulletinDetails();
function getBulletinDetails(){
    var bulletin_id = $.getQueryString("bulletin_id");
    if($.string.isEmpty(bulletin_id)){
        layer.alert("公告不存在！",{icon:6});
        return;
    }

    var getBulletinCall = function(results){
        if(results.code=="0X0000"){
            var data = results.data;
            $(".announcementXQ1").html(data.title);
            $(".announcementXQ2").html(data.add_time);
            $(".announcementXQ3").html(data.content);
        }else{
            layer.alert(results.message,{icon:6});
        }
    };
    htService.getBulletin(getBulletinCall,bulletin_id);
}