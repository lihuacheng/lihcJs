
/**
 * 生成标准连接
 * @param string url 地址
 * @param string | object arg 参数
 * @returns
 */
function urlArgs(url,arg){
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
}
