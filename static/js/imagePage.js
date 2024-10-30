$(document).ready(function () {

    var img_width = 0;
    var img_height = 0;
    var img_upload = new Image();


    $('#formFile').on('change', function () {

        // 获取选中的文件
        var file = this.files[0];
        console.log('Selected file:', file);
        // 如果文件存在
        if (file) {
            // 创建对象
            var reader = new FileReader();
            // 设置预览图片加载完成事件
            reader.onload = (e) => {
                img_upload.onload = function () {
                    img_width = img_upload.width;
                    img_height = img_upload.height;
                };

                // 将预览图片的src属性设置为读取到的数据
                $('#preview')[0].src = e.target.result;
                img_upload.src = e.target.result;
            };
            // 读取文件并触发预览事件
            reader.readAsDataURL(file);
        }
    });

    saveImage = () => {
        var fileInput = $('#formFile')[0];
        var file = fileInput.files[0];
        console.log(file)
        if (file) {
            var reader = new FileReader();
            reader.onload = (e) => {
                var formData = new FormData();
                formData.append('image_data', file);
                sendImageToServer(formData);
            };
            reader.readAsDataURL(file);
        } else {
            alert('请选择图片');
        }
    }


    function sendImageToServer(formData) {
        $.ajax({
            url: '/pypw_imgs/upload_image',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: (response) => {
                if (response.processed_image) {
                    alert("上传成功");
                    // $('#imageContainer').html('<img src="data:image/png;base64,' + response.processed_image + '" alt="Processed Image">');
                } else {
                    alert('上传失败: ' + response.error);
                }
            },
            error: (error) => {
                console.log(error);
                alert('上传失败');
            }
        });
    }

    poseDet = () => {
        var fileInput = $('#formFile')[0];
        var file = fileInput.files[0];
        var formData = new FormData();
        formData.append('image_data', file);

        console.log("开始执行姿态估计");
        // 清除旧的图表
        d3.select("#container1").selectAll("svg").remove();
        $.ajax({
            url: '/pypw_imgs/show_results',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: (data) => {
                ctx.clearRect(0, 0, canvas_img.width, canvas_img.height); // 清空
                drawPose(data);
            },
            error: (error) => {
                console.error('从后端获取数据失败:', error);
            }
        });
    }


    skeleton = [[16, 14], [14, 12], [17, 15], [15, 13], [12, 13], [6, 12], [7, 13], [6, 7], [6, 8], [7, 9],
    [8, 10], [9, 11], [2, 3], [1, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7]]

    // 创建画布
    const canvas_img = document.getElementById("canvas_pose");
    const ctx = canvas_img.getContext('2d');

    function drawPose(data) {
        canvas_img.width = img_width
        canvas_img.height = img_height
        ctx.drawImage(img_upload, 0, 0, img_width, img_height, 0, 0, canvas_img.width, canvas_img.height);

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

        // 添加鼠标悬停效果
        d3.select(svg)
            .selectAll("rect")
            .on("mouseover", function (event, d, i) {
                // 鼠标悬停时的操作，例如修改颜色
                d3.select(this).attr("fill", "green");

                // 添加提示框
                d3.select("#container1")
                    .append("div")
                    .style("position", "absolute")
                    .style("background", "#fff")
                    .style("padding", "5px")
                    .style("border", "1px solid #ccc")
                    .style("border-radius", "5px")
                    .html(`<strong>相似度:</strong> ${(d * 100).toFixed(2)}%`)
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY + "px");
            })
            .on("mouseout", function () {
                // 鼠标离开时的操作，例如恢复颜色
                d3.select(this).attr("fill", "steelblue");

                // 移除提示框
                d3.select("#container1").select("div").remove();
            });
    }
});
