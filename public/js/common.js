const host = 'http://localhost:3000';
var socket = io.connect();
$(function(){
    var nickName = $.cookie('nickName');
    if(nickName!=null){
        $('#nicheng').html(nickName);
    }
    var qrcode = new QRCode(document.getElementById("code"), {
        width: 120,
        height: 120
    });
    qrcode.makeCode(host+'/m/login');
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
                    socket.on('login',function(data){
                        console.log(data)
                    })
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
                    if(location.href==host+'/video'){
                        return;
                    }
                    location.href='/video'
                }
            }
        }
    })
}