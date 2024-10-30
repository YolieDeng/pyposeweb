# 图片检测模块
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
import yaml
from flask import jsonify, render_template, request, session
from PIL import Image
from ultralytics import YOLO

from ..pgsql_conn import get_db_connection
from . import pypw_imgs

SUFFIX_LIST = [".csv", ".yaml"]
SYS_NAME = platform.uname()[0]
MODEL_NAME = "yolov8s-pose.pt"


# 姿态估计模型加载
def model_pose_loading(img_path, yolo_model="yolov8s-pose.pt"):
    model = YOLO(yolo_model)

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


# 上传照片
@pypw_imgs.route("/upload_image", methods=["GET", "POST"])
def process_image():
    try:
        # 获取上传的图片文件
        file = request.files["image_data"]
        img = Image.open(BytesIO(file.read()))
        _, processed_image_data = cv2.imencode(".png", img)
        processed_base64 = base64.b64encode(processed_image_data).decode("utf-8")

        # 插入到数据库
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(f"INSERT INTO images (image_base64) VALUES ('{processed_base64}')")
        conn.commit()
        cur.close()
        conn.close()

        return {"processed_image": processed_base64}, 200

    except Exception as e:
        print("Image processing error:", e)
        return {"error": str(e)}, 500


# 显示分类结果
@pypw_imgs.route("/show_results", methods=["GET", "POST"])
def show_results():
    user_info = session.get("user_info")
    # 获取上传的图片文件
    file = request.files["image_data"]

    img = Image.open(BytesIO(file.read()))
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


# 这里直接跳页，不需要检测
@pypw_imgs.route("/imgPage")
def imgPage():
    user_info = session.get("user_info")

    return render_template("pyposeweb/imgPage.html", user_info=user_info)
