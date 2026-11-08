<?php
session_start();
if (!isset($_SESSION['user'])) {   // ยังไม่ได้ล็อกอิน ให้กลับไปหน้า login
    header('Location: login.php');
    exit;
}
?>
<h1>แดชบอร์ด</h1>
<p>สวัสดี <?= htmlspecialchars($_SESSION['user']) ?></p>
<a href="logout.php">ออกจากระบบ</a>
