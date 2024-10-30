from flask import Blueprint

pypw = Blueprint("pyposeweb", __name__)

from .views import *
