;var H_URL_REP_LONG = window.HOME_LOGN_URL;var H_URL_REP_SHORT = window.HOME_SHORT_URL;var H_U_MODULE_NAME = 'ucontrollernamekey';var H_U_CONTROLLER_NAME = 'uactionnamekey';

/**
 * 兼容thinkPHP的U方法
 */
function home_u(modAct, arg, longUrlFlag){
    longUrlFlag = longUrlFlag === true ? true : false;
    modAct = modAct || '';
    var tmpArr = modAct.split('/');
    var url = H_URL_REP_SHORT;
    if(longUrlFlag == true) url = H_URL_REP_LONG;
    if($.trim(modAct) == ''){
        if(longUrlFlag == true) url = home_u('Index/index', '', longUrlFlag);
        else url = home_u('Index/index');
    }else if(tmpArr.length == 1){
        url = url.replace(H_U_MODULE_NAME, 'Index').replace(H_U_CONTROLLER_NAME, tmpArr[0]);
    }else{
        url = url.replace(H_U_MODULE_NAME, tmpArr[0]).replace(H_U_CONTROLLER_NAME, tmpArr[1]);
    }
    delete tmpArr;
    delete modAct;
    return $.string.urlArgs(url, arg);
}
$.extend({"homeU":home_u});