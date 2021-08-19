$(function() {
    var layer = layui.layer
    var form = layui.form
    initCate()
    // 初始化富文本编辑器
   initEditor()
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('初始化文章失败！')
                }
                // 调用模板引擎，初始化下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 调用form.rensder()方法
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')
     
    // 2. 裁剪选项
    var options = {
      aspectRatio: 400 / 280,
      preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面按钮绑定事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverfile').click()
    })
    // 监听coverfile的change事件,获取用户选择的文件列表
    $('#coverfile').on('change', function(e) {
        var files = e.target.files
        // 判断用户是否选择文件
        if(files.length === 0) {
            return 
        }
        // 根据文件，创建对应的URL地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
    })
    // 定义文章的发布状态
    var art_state = '已发布'
    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave').on('click', function() {
        art_state = "草稿"
    })
    // 监听表单submit事件

    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
        // 1.基于form表单快速创建Formdata对象
        var fd = new FormData($(this)[0])
        // 2.将文章的发布状态存到fd中
        fd.append('state', art_state)
        // 3.将封面裁剪过后的图片输出为文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {       
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 4.将文件对象存储到fd中
                fd.append('cover_img', blob)
                // 5.发起Ajax数据请求
                publishArticle(fd)
            })
    })
    // 定义发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意如果向服务器提交的是formdate格式的数据，必须添加 以下两个配置
            contentType: false,
            processData: false,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布成功之后跳转到文章列表 页面
                location.href = '/article/art_list.html'
            }
        })
    }
})