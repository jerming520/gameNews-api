from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
import os
from dotenv import load_dotenv
#
load_dotenv()
db = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)
#
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5502"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#
class MessageCreate(BaseModel):
    name: str
    content: str
#
@app.get("/")
def read_root():
    return {"message": "GameNews API is running"}
#
@app.post("/messages")
def create_message(message: MessageCreate):
    cursor = db.cursor()
    sql = "INSERT INTO messages (name, content) VALUES (%s, %s)"
    values = (message.name, message.content)
    cursor.execute(sql, values)
    db.commit()
    return {"message": "留言接收成功", "data": message}
#
@app.get("/messages")
def get_messages():
    cursor = db.cursor()
    sql = "SELECT * FROM messages"
    cursor.execute(sql)
    messages = cursor.fetchall()
    return {"message": "取得留言成功", "data": messages}
#
@app.delete("/messages/{message_id}")
def delete_message(message_id: int):
    cursor = db.cursor()
    sql = "DELETE FROM messages WHERE id = %s"
    values = (message_id,)
    cursor.execute(sql, values)
    db.commit()
    return {"message": "留言刪除成功", "id": message_id}