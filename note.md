# TO DO LIST
1. 考慮加入管理員後台
   -> Admin帳號，擁有管理員權限，會多出一個user list頁面，可以BAN或刪掉USER
   -> Admin帳號對使用者PO的圖可以管到多少？刪除？下架？修改內文？
2. 考慮把CSS整合在一起
   -> 目前：模板內建的放在src\assets\css\templatemo-cyborg-gaming.css、自訂的放在src\App.css
3. 改overlay字體排版、黑底透明度(用linear gradient) (done)
4. Search Bar的實作：useEffect監聽onChange，只要有輸入關鍵字就自動切換到browse分頁並顯示filter過後的結果
5. Browse頁面上的tabs，用Bootstrap的Badges，按下去就等同於輸入對應關鍵字(觸發useEffect監聽onChange，同第4點)
6. Artists的頁面自己再做另一個search bar
7. ArtworkDetails.jsx => 展示單一作品的頁面，從父元件(Gallery)拿props (done)
8. 考慮用recaptcha驗證
9. **Browse 加 tags 列表**
10. **編輯作品**
11. Markdown比較是for工程師 DEMO的時候要詳細講一下怎麼用
12. DEMO前準備好要上傳的頭圖和作品圖片
13. 沒實作的功能別講 RRRRRR

# MEMO
前端資料流入口(暫定)
Gallery 或 ArtworkDetailsPage(目前在這)

# 標準色
primary `#2e68ff`
secondary `#618dff`
紫色 `#be58fe`

# Schema
Database: artisan

## Table1: user
+-------------------------------------------------------------------------------------+
| id(PK) | name | password | tags |  bio  | upload-works | saved-works | created-date |
|-------------------------------------------------------------------------------------|
|   01   | John | (hased)  |      |       | [38, 05, 12] | [22, 34, 53]|  2022-07-20  |
|-------------------------------------------------------------------------------------|
|   02   | Meow | (hased)  |      |       | [01, 11    ] | [02, 08, 16]|  2023-01-21  |
|-------------------------------------------------------------------------------------|
|   03   | BABA | (hased)  |      |       | [01, 11    ] | [02, 08, 16]|  2024-04-12  |
+-------------------------------------------------------------------------------------+

+----------------------------------------------------------+
|     follower    |     following    | email | liked-works |
|------------------------------------|-------|-------------+
| [12, 2323, 356] | [123, 3, 89, 64] |       | [22, 34, 53]|
+----------------------------------------------------------+

id: INT
email: VARCHAR(255) 
name: VARCHAR(45)
password: TEXT(hash加鹽加密過)
tags: 
  * DB: TEXT (EX. digital_art, colored art, ...)
  * PO: List<String>
bio: TEXT
upload-works: 上傳的作品(work)的id (FK)
  * DB: TEXT (EX. 38, 05, 12, ...)
  * PO: List<int>
saved-works: 收藏的作品(work)的id (FK)
  * DB: TEXT (EX. 38, 05, 12, ...)
  * PO: List<int>
liked-works: 按讚過的作品(work)的id (FK)
  * DB: TEXT (EX. 38, 05, 12, ...)
  * PO: List<int>
created-date: DATE
follower: 追蹤者(user)的id
  * DB: TEXT (EX. 12, 2323, 356, ...)
  * PO: List<int>

* works存的是works的id(FK)陣列 
* tags 字串(用逗號,分隔，進JAVA再用split分割成List<String>)
* about 不超過一定字數的自我介紹

## Table2: work
+-------------------------------------------------------------------------------------------------+
| id(PK) | name  | tags | description | likes | saved-count | img-urls | created-date | author_id |
+-------------------------------------------------------------------------------------------------+

id: INT
name: VARCHAR(255)
tags: TEXT (EX. digital_art, colored art, ...)
description: TEXT
likes: INT (被按讚的次數)
saved-count: INT (被收藏的次數)
img-urls: TEXT(base64)陣列
  * DB: TEXT (EX. aHR0cHM6Ly9tdXNpYy5hcHBsZS5jb20vdHcv, aHR0cHM6Ly9kaXNjb3JkLmNvbS8=, ...)
  * PO: List<String>
created-date: DATE
author_id: FK, 作者的user id

* description 採用 Markdown(暫定)

# DAO
## Works CRUD
1. findWorkById
2. findAllWorks (不實作透過tag或作者篩選的功能，一律都讓前端做，減少呼叫後端DB的次數)
3. deleteWorkById (需確認目前session，登入中使用者的upload-works中有包含此作品ID or 登入中的是admin才能刪，否則後端throw exception)
4. updateWorkById (需確認目前session，登入中使用者的upload-works中有包含此作品ID or 登入中的是admin才能修改，否則後端throw exception)
5. addWork

## User CRUD
1. findUserById
2. findAllUser
3. deleteUserById (***危險*** 僅admin可使用)
4. updateUserById (需確認目前session，比對登入中使用者的ID確認身分 or 登入中的是admin才能修改，否則後端throw exception)
5. addUser
6. getUploadWorks

# 登入相關API
1. login
2. checkAuthentication

# 使用技術
前：React, Bootstrap
後：Spring Boot, JPA, MySQL, BCrypt, jsonwebtoken

# Credit
SVG示意圖來源: Storyset
<a href="https://storyset.com/self-care">Self care illustrations by Storyset</a>
其他插圖：
https://www.irasutoya.com/p/figure.html
真人照片：
https://www.pexels.com/photo/man-sitting-on-the-mountain-edge-91224/

