# รายวิชาการเขียนโปรแกรมบนเว็บ (Web Programming) ปีการศึกษา 2569

ที่เก็บนี้รวม **ใบงานปฏิบัติการ** และ **ไฟล์เริ่มต้น (starter files)** สำหรับรายวิชา ไม่รวมเฉลย

## โครงสร้าง

| โฟลเดอร์ | เนื้อหา |
|---|---|
| `worksheets/` | ใบงานปฏิบัติการที่ 1–10 (ข้อความตรงกับภาคผนวก ก ของเอกสารประกอบการสอน) |
| `starter/week02/` | โครงโฟลเดอร์โครงงานเว็บ, `customer_json.php` และตัวอย่าง Fetch API |
| `starter/week05/` | ส่วนหัวเด่น (Hero) และการ์ดสินค้าด้วย Bootstrap 5 |
| `starter/week06/` | สลับโหมดสว่าง/มืด, คำนวณภาษีแบบเรียลไทม์, ดึงข้อมูล JSONPlaceholder |
| `starter/week07/` | ระบบเข้าสู่ระบบ 3 ไฟล์ด้วย Session (ตัวอย่างเพื่อการเรียน เก็บผู้ใช้ในอาร์เรย์) |
| `starter/week08/` | SQL สร้างตาราง `orders` พร้อม Foreign Key |

## วิธีใช้

- **ดาวน์โหลดเป็น ZIP:** กดปุ่ม Code แล้วเลือก Download ZIP
- **หรือ clone ด้วย Git:** `git clone https://github.com/surachet2016/webapp_subject_2026.git`
- ไฟล์ PHP ต้องรันผ่านเว็บเซิร์ฟเวอร์ (XAMPP บน Windows หรือ MAMP บน macOS) ไม่ใช่เปิดไฟล์โดยตรง ไฟล์ HTML/JavaScript เปิดด้วยเบราว์เซอร์ได้
- ผู้ใช้ MAMP: รหัสผ่านของ MySQL ผู้ใช้ `root` คือ `root` และต้องเปิดโมดูล `mod_rewrite` หากใช้ WordPress ตามลิงก์ถาวร ดูรายละเอียดในเอกสารประกอบการสอน

## ข้อควรระวัง

- ตัวอย่างล็อกอินใน `starter/week07/` ใช้รหัสผ่านทดลองที่เขียนไว้ในโค้ด เพื่อการเรียนเท่านั้น ห้ามนำไปใช้กับระบบจริง
- ห้าม commit รหัสผ่านจริง ไฟล์ `.env` หรือ `wp-config.php` (อยู่ใน `.gitignore` แล้ว)

## ลิขสิทธิ์

ยังไม่ได้กำหนดใบอนุญาตของที่เก็บนี้ (ผู้จัดทำจะระบุภายหลัง) ตามค่าเริ่มต้นเจ้าของงานสงวนสิทธิ์ทั้งหมด ตัวอย่างที่เกี่ยวข้องกับ Bootstrap ใช้ผ่าน CDN ภายใต้ MIT License ของ The Bootstrap Authors

## การ deploy เว็บรายวิชา

ซอร์สเว็บอยู่ในโฟลเดอร์ `site/` เมื่อ merge เข้า `main` และมีการเปลี่ยนแปลงในโฟลเดอร์นี้ GitHub Actions
(`.github/workflows/deploy.yml`) จะอัปโหลดขึ้น https://fms.pnu.ac.th/lessons/ โดยอัตโนมัติ
ต้องตั้ง Secrets `SFTP_USERNAME` และ `SFTP_PASSWORD` ใน Settings > Secrets and variables > Actions ก่อน
(ระบบอัปโหลดไฟล์ทับของเดิม แต่ไม่ลบไฟล์ที่ถูกลบออกจาก repo)
