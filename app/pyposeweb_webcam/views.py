# Webcam检测模块
# 创建人：曾逸夫 邓乙华
# 创建时间：2024-01-26

import base64
import csv
import os
import platform
import sys
from io import BytesIO
from pathlib import Path

import yaml
from flask import jsonify, render_template, request, session
from PIL import Image
from ultralytics import YOLO

from . import pypw_wec

SUFFIX_LIST = [".csv", ".yaml"]
SYS_NAME = platform.uname()[0]
MODEL_NAME = "yolov8s-pose.pt"


# 姿态估计模型加载并进行姿态估计
def model_pose_loading(img_path, yolo_model="yolov8s-pose.pt"):
    model = YOLO(yolo_model)

    # results = model(source=img_path, device=0)  # GPU
    if SYS_NAME == "Darwin":
        print("正在 Mac OS 系统上运行")
        results = model(source=img_path, device="mps")
    else:
        results = model(source=img_path, device="cpu")

    # 获取姿态估计结果中的关键点坐标列表
    results = list(results)[0].keypoints

    return results


# yaml文件解析并返回内容
def yaml_parse(file_path):
    return yaml.safe_load(open(file_path, encoding="utf-8").read())


# yaml、csv 文件解析
def yaml_csv(file_path, file_tag):
    # 获取文件路径的后缀
    file_suffix = Path(file_path).suffix
    if file_suffix == SUFFIX_LIST[0]:
        # 模型名称
        file_names = [i[0] for i in list(csv.reader(open(file_path)))]  # csv版
    elif file_suffix == SUFFIX_LIST[1]:
        # 模型名称
        file_names = yaml_parse(file_path).get(file_tag)  # yaml版
    else:
        print(f"{file_path}格式不正确！程序退出！")
        sys.exit()

    # 返回模型名称列表
    return file_names


# 调用摄像头
@pypw_wec.route("/Camera")
def cameraPage():
    user_info = session.get("user_info")
    return render_template("pyposeweb/camera.html", user_info=user_info)


# 显示姿态估计结果
@pypw_wec.route("/upload_camera", methods=["GET", "POST"])
def upload_camera():
    # 获取用户信息
    user_info = session.get("user_info")
    # 获取上传的JSON文件
    jsonFiles = request.json
    # 从JSON文件中获取视频帧数据
    video_frame = jsonFiles["frame"]
    # 查找逗号位置
    point = video_frame.find(",")
    # 提取逗号后的Base64编码字符串
    base64_str = video_frame[point + 1 :]
    # 如果视频帧存在
    if video_frame:
        # 解析Base64编码的图像数据
        img = Image.open(BytesIO(base64.b64decode(str(base64_str))))
        # 获取图像的宽高和形状列表
        w = img.width
        h = img.height
        img_shape = [w, h]

        # 姿态估计模型加载
        pose_predict = model_pose_loading(img, MODEL_NAME)
        pose_xy_list = pose_predict.xy.tolist()

        # 返回 JSON 格式的数据
        return jsonify(
            {
                # 图像形状
                "img_shape": img_shape,
                # 关键点坐标
                "coordinates": pose_xy_list,
                # 用户信息
                "user_info": user_info,
            }
        )
    # 如果视频帧不存在
    else:
        print("视频上传失败")
        return jsonify({"message": "视频上传失败"})
