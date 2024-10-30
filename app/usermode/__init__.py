# user模块


from flask import Blueprint

user_mode = Blueprint("usermode", __name__)

from .views import *
