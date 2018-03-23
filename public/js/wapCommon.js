﻿
var  host = 'http://localhost'

var socket = io.connect();
$(function(){
    var nickName = Cookies.get('nickName')
    if(nickName!=null){
        $('#nicheng').html(nickName);
    }
    checkLogin();
    $('#logout').click(function(){
        $.ajax({
            url:host+'/user/logout',
            type:'POST',
            dataType:'json',
            xhrFields: {
                withCredentials: true
            },
            data:{},
            success:function(result) {
                if (result.status == 0){
                    socket.disconnect();
                    location.href = '/'
                }
            }
        })
    })
})
function checkLogin(){
    $.ajax({
        url:host+'/user/checkLogin',
        type:'POST',
        dataType:'json',
        xhrFields: {
            withCredentials: true
        },
        data:{},
        success:function(result){
            if(result.status=='2'){
                if(location.href==host+'/'){
                    return;
                }
                location.href='/'
            }else{
                if(result.result.isAdmin=='true'){
                    alert('管理员请使用pc端进行添加用户！');
                    return;
                }else{
                    if(location.href==host+'/video'){
                        return;
                    }
                    location.href='/video'
                }
            }
        }
    })
}