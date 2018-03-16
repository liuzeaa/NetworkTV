var host = 'http://localhost:3000';
var socket = io.connect();
socket.on('login',function(data){
    console.log(data)
})
$(function(){
    var nickName = $.cookie('nickName')
    if(nickName!=null){
        $('#nicheng').html(nickName);
    }
    checkLogin();
    $('#logout').click(function(){
        socket.on('login',function(data){
            console.log(data)
        })
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
                    if(location.href==host+'/user'){
                        return;
                    }
                    location.href='/user'
                }else{
                    if(location.href==host+'/index'){
                        return;
                    }
                    location.href='/index'
                }
            }
        }
    })
}