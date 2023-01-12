$(function () {
    var layer = layui.layer;
    var form = layui.form;

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！';
            }
        }
    });

    // 渲染基本信息
    getMessage();
    function getMessage() {
        // 获取用户的基本信息并渲染
        $.ajax({
            method: "GET",
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) return layer.msg("获取用户信息失败");
                // console.log(res);
                // layui的表单取值方法
                form.val('formUserInfo', res.data);
            }
        });
    }

    // 重置模块
    $("#resetbtn").on('click', function (e) {
        e.preventDefault();
        // 重置后重新获取基本信息
        getMessage();
    });

    // 提交模块
    $("#userform").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $("#userform").serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg("修改用户信息失败");
                layer.msg("修改用户信息成功");
                // 当前页面的父亲就是index 子页面是ifram的一部分
                window.parent.getUserInfo();
            }
        });
    });
});

