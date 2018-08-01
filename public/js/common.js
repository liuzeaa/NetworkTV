$(function(){
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
                if(location.href==location.protocol+'//'+location.host+'/'){
                    return;
                }
                location.href='/'
            }else{
                if(result.result.isAdmin=='true'){
                    if(location.href==location.protocol+'//'+location.host+'/user'){
                        return;
                    }
                    location.href='/user'
                }else{
                    if(location.href==location.protocol+'//'+location.host+'/video'){
                        return;
                    }
                    location.href='/video'
                }
            }
        }
    })
}