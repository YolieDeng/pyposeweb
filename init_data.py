import psycopg

# 连接数据库
conn = psycopg.connect(
    host="localhost", dbname="postgres", user="postgres", password="pyposeweb"
)

cur = conn.cursor()

cur.execute("DROP TABLE IF EXISTS images;")

cur.execute(
    "CREATE TABLE images (id serial PRIMARY KEY,"
    "image_base64 text NOT NULL,"
    # "img_path text,"
    "date_added date DEFAULT CURRENT_TIMESTAMP);"
)

# cur.execute(
#     "CREATE TABLE videos (id serial PRIMARY KEY,"
#     "video_data bytea NOT NULL,"
#     "date_added date DEFAULT CURRENT_TIMESTAMP);"
# )

conn.commit()

cur.close()
conn.close()
