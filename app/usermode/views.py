# user模块


from flask import abort, redirect, render_template, request, session, url_for
from jinja2 import TemplateNotFound
from werkzeug.security import check_password_hash, generate_password_hash

from ..pgsql_conn import get_db_connection
from . import user_mode


# 注册
@user_mode.route("/register/", methods=("GET", "POST"))
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO users (username, password) VALUES ('{username}', '{password}')"
        )
        conn.commit()
        cur.close()
        conn.close()
        return redirect(url_for("usermode.login"))

    return render_template("usermode/register.html")


# 登录
@user_mode.route("/login", methods=["GET", "POST"])
def login():
    conn = get_db_connection()
    cur = conn.cursor()

    if request.method == "GET":
        return render_template("usermode/login.html")
    username = request.form.get("username")
    password = request.form.get("password")
    cur.execute(
        f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    )
    res = cur.fetchall()
    conn.commit()
    cur.close()
    conn.close()
    if res:
        # 验证通过
        session["user_info"] = res[0]
        return redirect(url_for("pyposeweb.index"))

    else:
        return render_template("usermode/login.html", msg="用户名或密码输入错误")


# 用户主页
@user_mode.route("/user_main")
def user_main():
    user_info = session.get("user_info")

    return render_template("usermode/user_main.html", user_info=user_info)


# 修改用户信息
@user_mode.route("/update_userInfo/", methods=("GET", "POST"))
def update_userInfo():
    user_info = session.get("user_info")
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            f"UPDATE users SET username='{username}', password='{password}' WHERE id='{user_info[0]}'"
        )
        conn.commit()
        cur.close()
        conn.close()
        return redirect(url_for("usermode.login"))

    return render_template("usermode/update_userInfo.html", user_info=user_info)


@user_mode.route("/logout")
def logout():
    session.pop("user_info", None)
    return redirect(url_for("usermode.login"))
