// 每次调用get 或post 或ajax会先调用ajaxPrefilter这个函数  在这个函数中可以拿到我们给AJAX提供的配置对象
$.ajaxPrefilter(function(options) {
    console.log(options.url)
    // 发起真正的ajax请求之前统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
})