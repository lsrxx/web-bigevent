// 在每次调用 post get ajax之前，都会提前调用ajaxPrefilter函数来拼接url地址
// options.url 是post get ajax 里面的url
$.ajaxPrefilter(function (options) {
    options.url = "http://www.liulongbin.top:3007" + options.url;
    console.log(options.url);

    // 为所有的权限接口配置统一的请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token')
        };
    }

    // 全局统一挂载 complete 回调函数
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1. 清空token数据
            // 2. 跳转到登入页面
            localStorage.removeItem('token');
            location.href = '/login.html';
        }
    };
});