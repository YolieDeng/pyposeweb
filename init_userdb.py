# pip install "psycopg[binary,pool]"

import psycopg

conn = psycopg.connect(
    host="localhost", dbname="postgres", user="postgres", password="pyposeweb"
)

# Open a cursor to perform database operations
cur = conn.cursor()

# Execute a command: this creates a new table
cur.execute("DROP TABLE IF EXISTS users;")
cur.execute(
    "CREATE TABLE users (id serial PRIMARY KEY,"
    "username varchar (150) NOT NULL,"
    "password varchar (200) NOT NULL);"
)

# Insert data into the table

cur.execute(
    "INSERT INTO users (username, password)" "VALUES (%s, %s)", ("Zengyf", "123")
)


cur.execute(
    "INSERT INTO users (username, password)" "VALUES (%s, %s)", ("Dengyh", "012")
)

conn.commit()

cur.close()
conn.close()
