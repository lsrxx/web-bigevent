$(function () {
    // 点击切换注册登入
    $("#regacount").on("click", function () {
        $(".login-box").hide();
        $(".res-box").show();
    });
    $("#logacount").on("click", function () {
        $(".res-box").hide();
        $(".login-box").show();
    });

    // 表单验证
    // 从layui获取form对象
    var form = layui.form;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！';
            }
        }
    });

    // 监听注册提交事件
    $("#formreg").on("submit", function (e) {
        e.preventDefault();
        // 获取表单用户名和密码
        var data = $("#formreg").serialize();
        // username=%E5%B8%85%E5%93%A51111&password=123456&repassword=123456
        console.log(data);
        // var data = {
        //     username: $('#form1 [name=username]').val(),
        //     password: $('#form1 [name=password]').val()
        // };
        $.post("/api/reguser", data, function (res) {
            if (res.status !== 0) return layer.msg(res.message);
            layer.msg("注册成功,请登入");
            // 模拟点击事件
            $("#logacount").click();
        });
    });

    // 监听登入事件
    $("#formlogin").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            url: "/api/login",
            method: "POST",
            data: $("#formlogin").serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg("登入失败");
                layer.msg("登入成功");
                // 将登入成功的token值保存到本地存储中，后续的请求都要身份验证及token值
                localStorage.setItem("token", res.token);
                // 登入成功后跳转到主页
                location.href = "/index.html";
            }
        });
    });

});