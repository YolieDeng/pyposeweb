$(document).ready(function () {

    // 获取文件输入框和预览图像元素
    var fileInput = document.getElementById('formFile');
    var preview = document.getElementById('preview');

    // canvas
    const canvas_video = document.getElementById("canvas_pose_video");
    canvas_video.style.maxWidth = "100%";
    canvas_video.style.maxHeight = "100%";
    ctx = canvas_video.getContext('2d');

    // JavaScript代码用于预览视频和处理视频上传
    document.getElementById('formFile').addEventListener('change', function () {
        var video_file = fileInput.files[0];
        preview.src = URL.createObjectURL(video_file);
    });

    let flag = false;

    preview.addEventListener('play', function () { //播放开始执行的函数
        flag = true;
        detectFrame(preview);
    });


    preview.addEventListener('ended', function () {
        alert("播放结束！");
        flag = false;
    }, false);


    detectFrame = (preview) => {
        if (flag == true) {
            canvas_video.width = preview.offsetWidth;
            canvas_video.height = preview.offsetHeight;
            // 绘制画面
            ctx.drawImage(preview, 0, 0, preview.videoWidth, preview.videoHeight, 0, 0, canvas_video.width, canvas_video.height);

            img_base64 = canvas_video.toDataURL("image/png", 1.0);
            sendImageToServer(img_base64);

            requestAnimationFrame(() => {
                detectFrame(preview);
            });
        } else {
            return false;
        }
    };


    function sendImageToServer(file) {
        // 清除旧的图表
        // d3.select("#container1").selectAll("svg").remove();
        $.ajax({
            url: '/pypw_vids/upload_video',
            async: false,
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "frame": file
            }),
            success: (data) => {
                // ctx.clearRect(0, 0, canvas_video.width, canvas_video.height); // 清空
                // console.log(data);
                drawPose(data);
            },
            error: (error) => {
                console.error('从后端获取数据失败:', error);
            }
        });
    }

    skeleton = [[16, 14], [14, 12], [17, 15], [15, 13], [12, 13], [6, 12], [7, 13], [6, 7], [6, 8], [7, 9],
    [8, 10], [9, 11], [2, 3], [1, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7]]


    function drawPose(data) {
        let coord_lists = data.coordinates;
        let img_shape = data.img_shape;

        for (var i = 0; i < coord_lists.length; i++) {
            drawPointsAndLines(coord_lists[i], img_shape)
        }
    }


    function drawPointsAndLines(coord_list, img_shape) {

        for (var i = 0; i < coord_list.length; i++) {
            x = coord_list[i][0];
            y = coord_list[i][1];

            if (x % img_shape[1] != 0 && y % img_shape[0] != 0) {
                ctx.beginPath();
                // 画点
                ctx.arc(x, y, 2, 0, 360, false);
                ctx.fillStyle = "red";//填充颜色,默认是黑色
                ctx.fill();//画实心圆
                ctx.closePath();
            }
        }

        for (var i = 0; i < skeleton.length; i++) {
            // 起点坐标
            var x1 = parseInt(coord_list[skeleton[i][0] - 1][0])
            var y1 = parseInt(coord_list[skeleton[i][0] - 1][1])

            // 终点坐标
            var x2 = parseInt(coord_list[skeleton[i][1] - 1][0])
            var y2 = parseInt(coord_list[skeleton[i][1] - 1][1])

            // 筛选
            if (x1 % img_shape[1] == 0 || y1 % img_shape[0] == 0 || x1 < 0 || y1 < 0)
                continue
            if (x2 % img_shape[1] == 0 || y2 % img_shape[0] == 0 || x2 < 0 || y2 < 0)
                continue

            ctx.beginPath();
            ctx.strokeStyle = "green";
            ctx.moveTo(x1, y1);//起始位置  
            ctx.lineTo(x2, y2);//停止位置  
            ctx.closePath();
            ctx.stroke();
        }
    }

    // 绘制 D3 柱状图
    function drawChart(data) {
        // 定义图表的尺寸和边距。
        const width = 640;
        const height = 400;
        const marginTop = 20;
        const marginRight = 200;
        const marginBottom = 30;
        const marginLeft = 70;

        const clasIndexList = data.clas_index_list;
        const clasRatioList = data.clas_ratio_list;

        // 定义 y 轴（垂直位置）的比例尺。
        const y = d3.scaleBand()
            .domain(clasIndexList)
            // 使用 clasIndexList 作为 y 值
            .range([marginTop, height - marginBottom])
            .padding(0.1);

        // 定义 x 轴（水平位置）的比例尺。
        const x = d3.scaleLinear()
            .domain([0, d3.max(clasRatioList)])
            .range([marginLeft, width - marginRight]);

        // 创建 SVG 容器。
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);

        // 添加横向柱状图的条形。
        d3.select(svg)
            .selectAll("rect")
            .data(clasRatioList)
            .enter().append("rect")
            .attr("y", (d, i) => y(clasIndexList[i]))
            .attr("x", x(0))
            .attr("width", d => x(d) - x(0))
            .attr("height", y.bandwidth())
            .attr("fill", "steelblue");

        // 添加 X 值的文本显示。
        d3.select(svg)
            .selectAll("text")
            .data(clasRatioList)
            .enter().append("text")
            .attr("x", d => x(d) + 5)
            .attr("y", (d, i) => y(clasIndexList[i]) + y.bandwidth() / 2)
            .attr("alignment-baseline", "middle")
            .text(d => `${(d * 100).toFixed(2)}%`);

        // 添加 y 轴标签。
        d3.select(svg)
            .append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y));

        // 添加 x 轴标签。
        d3.select(svg)
            .append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x));

        // 将 SVG 元素附加到容器中。
        const container = d3.select("#container1");
        container.node().appendChild(svg);
    }
});