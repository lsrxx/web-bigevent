$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义过滤器美化时间
    template.defaults.imports.fd = function (data) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    var d = {
        pagenum: 1, //页码值
        pagesize: 2,  //每页显示多少条数据
        cate_id: "",  //文章分类的 Id
        state: ""  //文章的发布状态
    };

    initlist();
    // 渲染文章列表
    function initlist() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: d,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) return layer.msg("获取文章列表失败！" + res.message);
                var htmlstr = template("tql-tab", res);
                $("tbody").html(htmlstr);
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        });
    }

    initCate();
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构,由于这个与模板引擎是异步的操作，所以不能及时渲染，得重新渲染
                form.render();
            }
        });
    }

    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格的数据
        initlist();
    });

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);

        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: d.pagesize, // 每页显示几条数据
            curr: d.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 改变数组中的顺序就会改变页面
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调  因为这个回调，所以会发生死循环在initable和laypage.render之间
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                console.log(first);
                console.log(obj.curr);
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                d.pagenum = obj.curr;
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                // initTable()
                if (!first) {
                    initlist();
                }
            }
        });
    }

    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length;
        // 获取到文章的 id
        var id = $(this).attr('data-id');
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！');
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    // 4
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            });

            layer.close(index);
        });
    });

});