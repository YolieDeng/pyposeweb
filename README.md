<p align="center">
    基于 Ultralytics YOLOv8 和 Flask Blueprints 的姿态估计的智能 Web 项目
</p>
</p>
<p align="center">
<a href="./CodeCheck.md"><img src="https://img.shields.io/badge/CodeCheck-passing-success" alt="code check" /></a>
<a href="https://gitee.com/intelligence-vision/py-pose-web/releases/v1.0.1"><img src="https://img.shields.io/badge/Releases-v1.0.1-green" alt="Releases Version" /></a>
<a href="https://github.com/ultralytics/ultralytics"><img src="https://img.shields.io/badge/ultralytics-8.1.9%2B-blue" alt="YOLOv8 Version" /></a>
<a href="https://github.com/pallets/flask"><img src="https://img.shields.io/badge/flask-3.0.2%2B-orange?logo=flask" alt="Flask Version" /></a>
<a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-16.1%2B-blue?logo=PostgreSQL" alt="PostgreSQL Version" /></a>
<a href="https://gitee.com/intelligence-vision/face-vectordb-login/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-AGPL--3.0-blue" alt="License" /></a>
</p>
<p align="center">
<a href="https://github.com/psycopg/psycopg"><img src="https://img.shields.io/badge/psycopg-3.1.18%2B-green?logo=psycopg" alt="psycopg Version" /></a>
<a href="https://github.com/pgvector/pgvector"><img src="https://img.shields.io/badge/pgvector--python-0.2.4%2B-blue?logo=pgvector" alt="pgvector Version" /></a>
<a href="https://jquery.com/"><img src="https://img.shields.io/badge/JQuery-3.7.1%2B-green?logo=jquery" alt="JQuery Version" /></a>
<a href="https://github.com/python-pillow/Pillow"><img src="https://img.shields.io/badge/pillow-10.2.0%2B-blue?logo=pillow" alt="Pillow Version" /></a>
<a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3.8%2B-blue?logo=python" alt="Python Version" /></a>
<a href="https://github.com/SeleniumHQ/selenium"><img src="https://img.shields.io/badge/Selenium-4.16.0%2b-brightgreen?logo=selenium" alt="Selenium Version"></a>
</p>

## 🚀 作者简介

### 👨‍🏫 导师

曾逸夫，从事人工智能研究与开发；主研领域：计算机视觉；[YOLOv8官方开源项目代码贡献人](https://github.com/ultralytics/ultralytics/graphs/contributors)；[YOLOv5官方开源项目代码贡献人](https://github.com/ultralytics/yolov5/graphs/contributors)；[YOLOv5 v6.1代码贡献人](https://github.com/ultralytics/yolov5/releases/tag/v6.1)；[YOLOv5 v6.2代码贡献人](https://github.com/ultralytics/yolov5/releases/tag/v6.2)；[YOLOv5 v7.0代码贡献人](https://github.com/ultralytics/yolov5/releases/tag/v7.0)；[Gradio官方开源项目代码贡献人](https://github.com/gradio-app/gradio/graphs/contributors)

### 👩‍🎓 学生

邓乙华，从事人工智能应用开发；主要研究领域：大模型能力增强、智能体通信机制、跨模态数据处理与生成式系统设计

<h2 align="center">🚀更新走势</h2>

- `2024-02-05` **⚡ [Py Pose Web v1.0.1](https://gitee.com/intelligence-vision/py-pose-web/releases/tag/v1.0.1)正式上线**
- `2024-01-27` **⚡ [Py Pose Web v1.0.0](https://gitee.com/intelligence-vision/py-pose-web/releases/tag/v1.0.0)正式上线**

<h2 align="center">💎项目流程与用途</h2>

### 🌟 项目功能介绍

本项目基于 **Ultralytics YOLOv8** 和 **Flask Blueprints** 构建，提供一个智能姿态估计的 Web 应用平台，主要实现以下功能：

- **多模块姿态估计**  
  支持图片、视频及实时摄像头三种输入形式的姿态估计，模块化设计，功能清晰独立。

- **用户管理系统**  
  提供用户注册、登录和信息管理功能，基于 PostgreSQL 实现数据持久化存储。

- **前后端交互**  
  利用 JavaScript、JQuery 等前端技术，实现图片上传、视频播放及实时摄像头数据交互。

- **高效模型推理**  
  集成 YOLOv8 模型，实现对人体关键点的快速准确识别和姿态估计。

- **完整项目架构**  
  涵盖数据库配置、后端API设计、前端页面开发及项目部署，构建一套可运行的智能姿态估计 Web 服务。


### 💡 项目结构

```
.
├── py-pose-web								# 项目名称
│   ├── app									# 核心逻辑文件
│   │   ├── pyposeweb						# 主页逻辑
│   │   │	├── __init__.py					# 蓝图初始化
│   │   │	└── views.py					# 主页逻辑文件
│   │   ├── pyposeweb_imgs					# 图片姿态估计模块
│   │   │	├── __init__.py					# 蓝图初始化
│   │   │	└── views.py					# 图片逻辑文件
│   │   ├── pyposeweb_video					# 视频姿态估计模块
│   │   │	├── __init__.py					# 蓝图初始化
│   │   │	└── views.py					# 视频逻辑文件
│   │   ├── pyposeweb_webcam				# 实时姿态估计模块
│   │   │	├── __init__.py					# 蓝图初始化
│   │   │	└── views.py					# 实时逻辑文件
│   │   ├── usermode						# 用户模块
│   │   │	├── __init__.py					# 蓝图初始化
│   │   │	└── views.py					# 用户逻辑文件
│   │   ├── pgsql_config.yaml				# PostgreSQL配置文件
│   │   └── pgsql_conn.py					# PostgreSQL连接文件
│   ├── static								# 静态文件
│   │   ├── js								# JavaScript文件
│   │   │	├── imagePage.js				# 图片模块前端文件
│   │   │	├── videoPage.js				# 视频模块前端文件
│   │   │	├── cameraPage.js				# 实时模块前端文件
│   │   │	├── functions.js				# 功能文件
│   │   │	└── vendor						# 渲染文件
│   │   ├── css								# CSS文件
│   │   ├── scss							# SCSS文件
│   │   └── img								# 图片文件
│   ├── templates							# 网页模板
│   │   ├── pyposeweb						# pyposeweb模板
│   │   │	├── index.html					# 首页
│   │   │	├── imgPage.html				# 图片姿态估计页面
│   │   │	├── videoPage.html				# 视频姿态估计页面
│   │   │	├── camera.html					# 实时姿态估计页面
│   │   │	└── error.html					# ERROR页面
│   │   ├── usermode						# 用户模板
│   │   │	├── login.html					# 登录页面
│   │   │	├── register.html				# 注册页面
│   │   │	├── update_userInfo.html		# 用户信息修改页面
│   │   │	└── user_main.html				# 用户信息页面
│   │   └── home.html						# 基础模板页面
│   ├── __init__.py							# 项目初始化
│   ├── init_db.py							# 数据库初始化文件
│   ├── init_data.py						# 数据库初始化文件
│   ├── init_userdb.py						# 数据库初始化文件
│   ├── LICENSE								# 项目许可
│   ├── setup.cfg							# pre-commit CI检查源配置文件
│   ├── .pre-commit-config.yaml				# pre-commit配置文件
│   ├── .gitignore							# git忽略文件
│   ├── README.md							# 项目说明
│   └── requirements.txt					# 脚本依赖包
```

<h2 align="center">🔥安装教程</h2>

### ✅ 第一步：安装PostgreSQL

📌 在 https://www.postgresql.org/ 网站下载并安装PostgreSQL

### ✅ 第二步：创建conda环境并安装项目组件

📌 创建conda环境

```shell
conda create -n pyposeweb python=3.8
conda activate pyposeweb
```

📌 安装项目组件

```shell
pip install requrements.txt -U
```

<h2 align="center">⚡使用教程</h2>

**🔥 本项目采用Flask 3 Blueprints（蓝图）模块化架构**

📌 安装 Flask 3.x 框架

```shell
# 切换到yolo环境
conda activate yolo

# 安装Flask Web框架
pip install flask --upgrade
```

📌  在项目根目录上一级目录运行 pyposeweb

```shell
# 转到根目录上一级
cd ..

# 执行指令启动项目
flask --app py-pose-web run
```

### 📝 项目引用指南

📌 如需引用 Py Pose Web，请在相关文章的**参考文献**中加入下面文字：

```
曾逸夫, 邓乙华 (2024) Py Pose Web.https://github.com/YolieDeng/pyposeweb.
```
