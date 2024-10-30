from flask import Blueprint

pypw_imgs = Blueprint("pyposeweb_imgs", __name__)

from .views import *
