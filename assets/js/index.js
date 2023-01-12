$(function () {
    // getUserInfo 调用用户信息
    getUserInfo();

    // 实现退出功能
    $(".btnlogout").on("click", function () {
        // 退出时有询问提示框
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 清除本地存储的token
            localStorage.removeItem('token');
            // 跳转到登入页面
            location.href = '/login.html';
            // 关闭询问框
            layer.close(index);
        });
    });
});
// 获取用户信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: '/my/userinfo',
        // headers 就是请求头的配置
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) return layui.layer.msg("获取信息失败");
            // console.log(res.data);
            rederAvantar(res.data);
        },
        // 控制用户的访问权限
        // complete 不论成功还是失败都会调用这个回调函数
        // complete: function (res) {
        //     // console.log(res);
        //     // 可以使用responseJSON拿到服务器响应的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1. 清空token数据
        //         // 2. 跳转到登入页面
        //         localStorage.removeItem('token');
        //         location.href = '/login.html';
        //     }
        // }
    });
}
// 渲染头像
function rederAvantar(data) {
    // 获取用户名
    var name = data.nickname || data.username;
    $("#welcome").html('欢迎' + '\t\t' + name);
    // 获取头像
    if (data.user_pic) {
        $(".layui-nav-img").attr('src', data.user_pic).show();
        $(".text-avatar").hide();
    } else {
        // 获取名字的第一个字，是字母就大写
        var textAvatar = name[0].toUpperCase();
        $(".layui-nav-img").hide();
        $(".text-avatar").html(textAvatar).show();
    }
}