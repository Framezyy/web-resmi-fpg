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
    $resetToken = trim((string) ($data['reset_token'] ?? ''));
    $newPassword = (string) ($data['new_password'] ?? '');
    $confirmPassword = (string) ($data['confirm_password'] ?? '');

    if ($resetToken === '' || $newPassword === '' || $confirmPassword === '') {
        throw new RuntimeException('Semua field wajib diisi.');
    }
    if (!hash_equals($newPassword, $confirmPassword)) {
        throw new RuntimeException('Konfirmasi password tidak sama.');
    }
    if (strlen($newPassword) < 8) {
        throw new RuntimeException('Password minimal 8 karakter.');
    }

    $db = (new Database())->getConnection();
    $sessionQuery = $db->prepare(
        'SELECT id, user_id, email
         FROM password_reset_tokens
         WHERE otp = :token AND used = 0 AND expires_at > :current_time
         ORDER BY created_at DESC LIMIT 1'
    );
    $sessionQuery->execute([
        ':token' => $resetToken,
        ':current_time' => date('Y-m-d H:i:s'),
    ]);
    $session = $sessionQuery->fetch();
    if (!$session) {
        throw new RuntimeException('Sesi reset tidak valid atau sudah kedaluwarsa.');
    }

    $db->beginTransaction();
    $updatePassword = $db->prepare('UPDATE admin_users SET password = :password WHERE id = :user_id');
    $updatePassword->execute([
        ':password' => password_hash($newPassword, PASSWORD_DEFAULT),
        ':user_id' => $session['user_id'],
    ]);

    $markUsed = $db->prepare('UPDATE password_reset_tokens SET used = 1 WHERE id = :id');
    $markUsed->execute([':id' => $session['id']]);

    $deleteOld = $db->prepare('DELETE FROM password_reset_tokens WHERE user_id = :user_id AND id != :id');
    $deleteOld->execute([':user_id' => $session['user_id'], ':id' => $session['id']]);
    $db->commit();

    try {
        $resetTime = date('d F Y H:i');
        $ipAddress = substr((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'), 0, 45);
        sendTransactionalEmail(
            $session['email'],
            'Password Admin FPG Telah Diubah',
            "<h2>Password admin FPG telah diubah</h2><p>Perubahan dilakukan pada <strong>{$resetTime}</strong>.</p><p>Alamat IP: {$ipAddress}</p>",
            "Password admin FPG telah diubah pada {$resetTime}. Alamat IP: {$ipAddress}.",
            null,
            'admin-password-changed-' . $session['id']
        );
    } catch (Throwable $mailError) {
        error_log('Password confirmation email failed: ' . $mailError->getMessage());
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Password berhasil diubah. Silakan masuk menggunakan password baru.',
    ]);
} catch (Throwable $error) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    error_log('Admin password reset error: ' . $error->getMessage());
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $error->getMessage()]);
}
