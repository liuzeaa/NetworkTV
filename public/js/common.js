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
                if(location.href=='http://'+location.hostname+'/'){
                    return;
                }
                location.href='/'
            }else{
                if(result.result.isAdmin==1){
                    if(location.href=='http://'+location.hostname+'/user'){
                        return;
                    }
                    location.href='/user'
                }else{
                    if(location.href=='http://'+location.hostname+'/video'){
                        return;
                    }
                    location.href='/video'
                }
            }
        }
    })
}