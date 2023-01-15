$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initarticle();
    // 渲染 获取文章分类
    function initarticle() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) return layer.msg("获取文章分类列表失败");
                var htmlstr = template('article', res);
                $("tbody").html(htmlstr);
            }
        });
    }

    var index = null;
    $("#addcate").on("click", function () {
        index = layer.open({
            type: 1,
            area: ["440px", "250px"],
            title: '添加文章类别',
            content: $("#addinfo").html()
        });
    });

    // 事件委托给body 因为弹出层是新添加的元素
    $("body").on("submit", "#addform", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $("#addform").serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) return layer.msg(res.message);
                layer.close(index);
                initarticle();
            }
        });
    });

    var editindex = null;

    // 编辑 点击事件 委托到父亲tbody
    $("tbody").on("click", ".editbtn", function () {
        var id = $(".editbtn").attr("data-id");
        editindex = layer.open({
            type: 1,
            area: ["440px", "250px"],
            title: '修改文章类别',
            content: $("#editinfo").html()
        });
        // 渲染编辑页面
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg("获取文章分类数据失败:" + res.message);
                form.val("editform", res.data);
            }
        });

    });

    // 修改编辑页面
    $("body").on("submit", "#editform", function (e) {
        e.preventDefault();

        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $("#editform").serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg("更新数据失败:" + res.message);
                layer.msg("更新数据成功");
                layer.close(editindex);
                initarticle();
            }
        });
    });

    // 删除事件
    $("tbody").on("click", ".delbtn", function () {
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            var id = $(".delbtn").attr("data-id");
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) return layer.msg("删除数据失败:" + res.message);
                    layer.msg("删除数据成功");
                    initarticle();
                }
            });
            layer.close(index);
        });
    });
});