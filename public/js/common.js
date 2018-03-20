var  host = 'http://localhost:3000';
var  vServer = 'rtmp://58.117.151.231/live&autoPlay=true';
var  vIosurl = 'http://58.117.151.231/live/myStream/playlist.m3u8';
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