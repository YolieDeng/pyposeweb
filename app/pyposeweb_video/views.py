# 视频检测模块
# 创建人：曾逸夫 邓乙华
# 创建时间：2024-01-26

import base64
import csv
import os
import platform
import sys
from io import BytesIO
from pathlib import Path

import cv2
import numpy as np
import yaml
from flask import jsonify, render_template, request, session
from jinja2 import TemplateNotFound
from PIL import Image
from ultralytics import YOLO
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

from ..pgsql_conn import get_db_connection
from . import pypw_vids

SUFFIX_LIST = [".csv", ".yaml"]
SYS_NAME = platform.uname()[0]
MODEL_NAME = "yolov8s-pose.pt"


# 姿态估计模型加载
def model_pose_loading(img_path, yolo_model="yolov8s-pose.pt"):
    model = YOLO(yolo_model)

    # results = model(source=img_path, device=0)  # GPU
    if SYS_NAME == "Darwin":
        print("正在 Mac OS 系统上运行")
        results = model(source=img_path, device="mps")
    else:
        results = model(source=img_path, device="cpu")
    results = list(results)[0].keypoints

    return results


# yaml文件解析
def yaml_parse(file_path):
    return yaml.safe_load(open(file_path, encoding="utf-8").read())


# yaml csv 文件解析
def yaml_csv(file_path, file_tag):
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

    return file_names


# 视频页面
@pypw_vids.route("/videoPage")
def video_pose():
    user_info = session.get("user_info")
    return render_template("pyposeweb/videoPage.html", user_info=user_info)


# 显示姿态估计结果
@pypw_vids.route("/upload_video", methods=["GET", "POST"])
def upload_video():
    user_info = session.get("user_info")
    # 获取上传的图片文件
    jsonFiles = request.json
    video_frame = jsonFiles["frame"]
    point = video_frame.find(",")
    # remove unused part like this: "data:image/jpeg;base64,"
    base64_str = video_frame[point + 1 :]
    if video_frame:
        img = Image.open(BytesIO(base64.b64decode(str(base64_str))))
        # img = Image.open(BytesIO(video_frame.read()))

        w = img.width
        h = img.height
        img_shape = [w, h]

        # 模型加载
        pose_predict = model_pose_loading(img, MODEL_NAME)
        pose_xy_list = pose_predict.xy.tolist()
        # print(pose_xy_list)

        # 返回 JSON 格式的数据
        return jsonify(
            {
                "img_shape": img_shape,
                "coordinates": pose_xy_list,
                "user_info": user_info,
            }
        )
    else:
        print("视频上传失败")
        return jsonify({"message": "视频上传失败"})
