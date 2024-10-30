import os

import psycopg
import yaml


# 数据库连接
def get_db_connection():
    current_path = os.path.abspath(os.path.dirname(__file__))

    with open(current_path + "/pgsql_config.yaml", "r") as f:
        pgsql_config = yaml.safe_load(f.read())
        conn = psycopg.connect(
            host=pgsql_config["host"],
            dbname=pgsql_config["dbname"],
            user=pgsql_config["username"],
            password=pgsql_config["password"],
        )
        return conn
