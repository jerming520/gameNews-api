-- 建立 GameNews 資料庫
CREATE DATABASE IF NOT EXISTS gamenews;
-- 
-- 選擇資料庫
USE gamenews;
-- 
-- 建立留言資料表
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);