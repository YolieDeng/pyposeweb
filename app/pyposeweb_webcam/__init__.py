from flask import Blueprint

pypw_wec = Blueprint("pyposeweb_wec", __name__)

from .views import *
