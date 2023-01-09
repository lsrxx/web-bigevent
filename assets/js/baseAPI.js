// 在每次调用 post get ajax之前，都会提前调用ajaxPrefilter函数来拼接url地址
// options.url 是post get ajax 里面的url
$.ajaxPrefilter(function(options){
    options.url = "http://www.liulongbin.top:3007" + options.url;
    console.log(options.url);
})