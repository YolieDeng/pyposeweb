# Py Pose Web v1.0.0
# 创建人：曾逸夫 邓乙华
# 创建时间：2024-01-26
# flask --app py-pose-web run


import torch
from flask import Flask
from flask_cors import CORS

from .app.pyposeweb import views as pv
from .app.pyposeweb_imgs import views as piv
from .app.pyposeweb_video import views as pvv
from .app.pyposeweb_webcam import views as pwv
from .app.usermode import views as uv


def create_app():
    app = Flask(__name__)
    # GPU版PyTorch冷启动
    # torch.cuda.is_available()

    # --------- 自动更新前后端 ---------
    app.jinja_env.auto_reload = True
    app.config["TEMPLATES_AUTO_RELOAD"] = True
    app.secret_key = "QWERTYUIOP"  # 对用户信息加密

    app.register_blueprint(pv.pypw, url_prefix="/pypw")
    app.register_blueprint(piv.pypw_imgs, url_prefix="/pypw_imgs")
    app.register_blueprint(pvv.pypw_vids, url_prefix="/pypw_vids")
    app.register_blueprint(pwv.pypw_wec, url_prefix="/pypw_wec")
    app.register_blueprint(uv.user_mode, url_prefix="/user_mode")
    app.add_url_rule("/", endpoint="index", view_func=uv.register)

    CORS(app)  # 跨域
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
