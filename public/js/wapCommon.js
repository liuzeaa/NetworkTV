﻿$(function(){
    var nickName = Cookies.get('nickName')
    if(nickName!=null){
        $('#nicheng').html(nickName);
    }
    checkLogin();
})
function checkLogin(){
    $.ajax({
        url:'/user/checkLogin',
        type:'POST',
        dataType:'json',
        xhrFields: {
            withCredentials: true
        },
        data:{},
        success:function(result){
            if(result.status=='2'){
                if(location.href==location.protocol+'//'+location.hostname+'/'){
                    return;
                }
                location.href='/'
            }else{
                if(result.result.isAdmin=='true'){
                    alert('管理员请使用pc端进行添加用户！');
                    return;
                }else{
                    if(location.href==location.protocol+'//'+location.hostname+'/video'){
                        return;
                    }
                    location.href='/video'
                }
            }
        }
    })
}