<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\contact-send.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

require __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

try {
  // Ambil input (support JSON atau form-data)
  $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
  $data = [];

  if (stripos($contentType, 'application/json') !== false) {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true) ?: [];
  } else {
    $data = $_POST;
  }

  $jenisPernyataan = trim($data['jenisPernyataan'] ?? '');
  $name = trim($data['name'] ?? '');
  $email = trim($data['email'] ?? '');
  $pesan = trim($data['pesan'] ?? '');

  if ($name === '' || $email === '' || $pesan === '' || $jenisPernyataan === '') {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Semua field wajib diisi."]);
    exit();
  }

  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email tidak valid."]);
    exit();
  }

  // === KONFIG SMTP (ISI SESUAI EMAIL ADMIN) ===
  $SMTP_HOST = 'smtp.gmail.com';
  $SMTP_PORT = 587;
  $SMTP_USER = 'fachripropertiborneo@gmail.com';      // ganti
  $SMTP_PASS = 'qgohzrnhnyujpozs';     // ganti (mis. Gmail: App Password)
  $TO_EMAIL  = 'fachripropertiborneo@gmail.com';       // email admin penerima
  // ===========================================

  $mail = new PHPMailer(true);
  $mail->isSMTP();
  $mail->Host = $SMTP_HOST;
  $mail->SMTPAuth = true;
  $mail->Username = $SMTP_USER;
  $mail->Password = $SMTP_PASS;
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
  $mail->Port = $SMTP_PORT;

  $mail->CharSet = 'UTF-8';

  $mail->setFrom($SMTP_USER, 'Website FPG');
  $mail->addAddress($TO_EMAIL);

  // Reply-To agar admin bisa balas langsung ke email user
  $mail->addReplyTo($email, $name);

  $mail->Subject = "[Contact Us] {$jenisPernyataan} - {$name}";
  $mail->Body =
    "Jenis Pernyataan: {$jenisPernyataan}\n" .
    "Nama: {$name}\n" .
    "Email: {$email}\n\n" .
    "Pesan:\n{$pesan}\n";

  $mail->send();

  http_response_code(200);
  echo json_encode(["success" => true, "message" => "Pesan berhasil dikirim."]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["success" => false, "message" => "Gagal mengirim email. " . $e->getMessage()]);
}