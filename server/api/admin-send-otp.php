<?php

error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', '0');

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

date_default_timezone_set('Asia/Jakarta');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/resend.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = strtolower(trim((string) ($data['email'] ?? '')));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new RuntimeException('Email tidak valid.');
    }

    $db = (new Database())->getConnection();
    $check = $db->prepare('SELECT id, username FROM admin_users WHERE email = :email LIMIT 1');
    $check->execute([':email' => $email]);
    $user = $check->fetch();
    if (!$user) {
        throw new RuntimeException('Email tidak ditemukan.');
    }

    $rateLimit = $db->prepare(
        'SELECT COUNT(*) FROM password_reset_tokens
         WHERE email = :email AND created_at > DATE_SUB(NOW(), INTERVAL 2 MINUTE)'
    );
    $rateLimit->execute([':email' => $email]);
    if ((int) $rateLimit->fetchColumn() > 0) {
        throw new RuntimeException('Tunggu 2 menit sebelum meminta OTP baru.');
    }

    $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    $expiresAt = date('Y-m-d H:i:s', time() + 600);
    $insert = $db->prepare(
        'INSERT INTO password_reset_tokens
            (user_id, email, otp, expires_at, used, ip_address, created_at)
         VALUES
            (:user_id, :email, :otp, :expires_at, 0, :ip_address, NOW())'
    );
    $insert->execute([
        ':user_id' => $user['id'],
        ':email' => $email,
        ':otp' => $otp,
        ':expires_at' => $expiresAt,
        ':ip_address' => substr((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'), 0, 45),
    ]);
    $tokenId = (int) $db->lastInsertId();

    $safeUsername = htmlspecialchars($user['username'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    sendTransactionalEmail(
        $email,
        'Kode OTP Reset Password - Fachri Property Group',
        "<h2>Reset password admin FPG</h2><p>Halo <strong>{$safeUsername}</strong>, gunakan kode berikut:</p><p style='font-size:32px;letter-spacing:5px'><strong>{$otp}</strong></p><p>Kode berlaku selama 10 menit dan hanya dapat digunakan satu kali.</p>",
        "Kode OTP reset password FPG: {$otp}. Kode berlaku selama 10 menit.",
        null,
        "admin-otp-{$tokenId}"
    );

    $response = ['success' => true, 'message' => 'OTP telah dikirim ke email Anda.'];
    if (!isProduction()) {
        $response['debug'] = ['otp' => $otp, 'expires_at' => $expiresAt];
    }

    http_response_code(200);
    echo json_encode($response);
} catch (Throwable $error) {
    error_log('Admin OTP error: ' . $error->getMessage());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $error->getMessage()]);
}
