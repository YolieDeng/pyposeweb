# 功能模块
import numpy as np
from flask import jsonify, redirect, render_template, request, session, url_for
from jinja2 import TemplateNotFound
from ultralytics import YOLO
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

from ..pgsql_conn import get_db_connection
from . import pypw


@pypw.route("/")
def index():
    user_info = session.get("user_info")
    return render_template("/home.html", user_info=user_info)
