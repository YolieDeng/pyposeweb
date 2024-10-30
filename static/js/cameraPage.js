document.addEventListener('DOMContentLoaded', (event) => {

    const video = document.getElementById('video');
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');

    const canvas_video = document.getElementById("canvas_pose_camera");
    canvas_video.style.maxWidth = "100%";
    canvas_video.style.maxHeight = "100%";
    ctx = canvas_video.getContext('2d');

    const container = d3.select("#container1");

    // 控制视频流的标志
    let flag = true;

    // 启动摄像头的函数
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            // 设置视频流标志为true
            flag = true;
            // 开始监控视频帧
            detectFrame(video);
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    // 停止摄像头的函数
    const stopCamera = () => {
        const stream = video.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach(track => track.stop());
        video.srcObject = null;
        // 设置视频流标志为false，停止视频流的监控
        flag = false;
    };

    // 点击“Start Camera”按钮启动摄像头
    startButton.addEventListener('click', startCamera);

    // 点击“Stop Camera”按钮停止摄像头
    stopButton.addEventListener('click', stopCamera);

    // 发送视频帧到服务器进行图像分类
    function sendImageToServer(file) {
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

    function detectFrame(preview) {
        if (flag) {
            // 设置画布尺寸与视频流的尺寸相同
            canvas_video.width = preview.offsetWidth;
            canvas_video.height = preview.offsetHeight;
            // 获取画布上下文
            const ctx = canvas_video.getContext('2d');
            // 在画布上绘制视频帧
            ctx.drawImage(preview, 0, 0, preview.videoWidth, preview.videoHeight, 0, 0, canvas_video.width, canvas_video.height);

            // 将画布内容转换为base64格式的图像数据
            const img_base64 = canvas_video.toDataURL("image/png", 1.0);
            // 发送图像数据到服务器进行处理
            sendImageToServer(img_base64);

            // 递归调用，实现持续监测视频帧
            requestAnimationFrame(() => {
                detectFrame(preview);
            });

        } else {
            return false;
        }
    }
});