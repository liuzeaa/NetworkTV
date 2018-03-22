var  host = 'http://58.117.151.230';
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
                    location.href = '/m/login'
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
                if(location.href==host+'/m/login'){
                    return;
                }
                location.href='/m/login'
            }else{
                if(result.result.isAdmin=='true'){
                    alert('管理员请使用pc端进行添加用户！');
                    return;
                }else{
                    if(location.href==host+'/m/video'){
                        return;
                    }
                    location.href='/m/video'
                }
            }
        }
    })
}