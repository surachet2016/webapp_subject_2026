<?php
session_start();
// ตัวอย่างเพื่อการเรียน: ในงานจริงให้ดึงผู้ใช้และค่าแฮชจากฐานข้อมูล (บทที่ 8)
$users = ['admin' => password_hash('Secret1234', PASSWORD_DEFAULT)];
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = trim($_POST['username'] ?? '');
    $pass = $_POST['password'] ?? '';
    if (isset($users[$user]) && password_verify($pass, $users[$user])) {
        session_regenerate_id(true);
        $_SESSION['user'] = $user;
        header('Location: dashboard.php');
        exit;
    }
    $error = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
}
?>
<form method="post">
  <p style="color:red"><?= htmlspecialchars($error) ?></p>
  ชื่อผู้ใช้: <input name="username" required><br>
  รหัสผ่าน: <input type="password" name="password" required><br>
  <button type="submit">เข้าสู่ระบบ</button>
</form>
