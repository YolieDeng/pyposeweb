from flask import Blueprint

pypw_vids = Blueprint("pyposeweb_video", __name__)

from .views import *
