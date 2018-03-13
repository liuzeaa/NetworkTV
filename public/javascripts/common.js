var host = 'http://localhost:3000';

$(function(){
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
                $('#nicheng').html(result.result.nickName)

                if(!result.result.isAdmin){
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