📚 Book Management API Documentation 

เอกสารฉบับนี้อธิบายรายละเอียดการใช้งาน API สำหรับระบบจัดการหนังสือ (innovate-book-chairat) เพื่อให้ทีมพัฒนา Frontend หรือทีม AI สามารถเชื่อมต่อระบบได้อย่างถูกต้อง🌐 

Base URL

    Development: http://localhost:3000/api

    Production: https://innovate-book-backend.onrender.com/api (ตัวอย่าง)
    
🔐 Authentication

ระบบใช้ JWT (JSON Web Token) ในการรักษาความปลอดภัย

    Header: Authorization: Bearer <your_token>

    Note: ต้องใช้ Token ในทุก Endpoint ที่ระบุว่าเป็น 

    (Protected)
    
📖 Endpoints

    1. Authentication   

    Method  Endpoint        Description             Auth   

    POST    /auth/register  สมัครสมาชิกใหม่            ❌

    POST    /auth/login     เข้าสู่ระบบเพื่อรับ Token     ❌

    2. Books Management

    Method  Endpoint        Description             Auth

    GET     /books          ดึงรายการหนังสือทั้งหมด      ❌

    GET     /books/:id      ดึงรายละเอียดหนังสือรายเล่ม  ❌

    POST    /books          เพิ่มหนังสือใหม่             ✅

    PUT     /books/:id      แก้ไขข้อมูลหนังสือ           ✅

    DELET   /books/:id      ลบหนังสือออกจากระบบ       ✅
    
📝 Request & Response Examples

Get All Books (with Pagination)

ดึงรายการหนังสือพร้อมกำหนดหน้าและจำนวนต่อหน้า

    URL: /books?page=1&limit=10
    
    Method: GET
    
    Success Response (200 OK):
    
    JSON{
        "success": true,
        "data": [
            {
            "_id": "65cad1...",
            "title": "Clean Code",
            "author": "Robert C. Martin",
            "year": 2020,
            "genre": "Tech",
            }
        ],
        "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalItems": 48
  }
}

Create New Book เพิ่มหนังสือใหม่เข้าสู่ระบบ
    
    URL: /books
    
    Method: POST
    
    Header: Authorization: Bearer <token>
    
    Body:JSON{
        "title": "Refactoring",
        "author": "Martin Fowler",
        "year": 2020,
        "genre": Tech
    }

    Success Response (201 Created):JSON{
        "success": true,
        "message": "Book created successfully",
        "data": { "id": "65cad2...", "title": "Refactoring" }
    }

⚠️ Error Codes

Status  Description     Reason

400     Bad Request     ข้อมูลที่ส่งมาไม่ถูกต้องหรือไม่ครบตาม Schema

401     Unauthorized    ไม่มีการส่ง Token หรือ Token หมดอายุ

403     Forbidden       ไม่มีสิทธิ์เข้าถึงข้อมูลส่วนนี้

404     Not Found       ไม่พบข้อมูลที่เรียกหา

500     Internal Server Errorเกิดข้อผิดพลาดที่ฝั่ง Server

