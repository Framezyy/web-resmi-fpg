<?php

require_once __DIR__ . '/../config/environment.php';

header('Access-Control-Allow-Origin: ' . envValue('CORS_ALLOWED_ORIGIN', '*'));
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Metode tidak diizinkan.']);
    exit();
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/resend.php';
require_once __DIR__ . '/../config/turnstile.php';

function contactResponse(int $status, bool $success, string $message): void
{
    http_response_code($status);
    echo json_encode(['success' => $success, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit();
}

function contactLength(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
}

try {
    $contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($contentLength > 20000) {
        contactResponse(413, false, 'Data yang dikirim terlalu besar.');
    }

    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        contactResponse(400, false, 'Format data tidak valid.');
    }

    // Honeypot fields are invisible to visitors but commonly filled by bots.
    if (trim((string) ($data['companyWebsite'] ?? '')) !== '') {
        contactResponse(201, true, 'Pesan Anda telah diterima.');
    }

    $inquiryType = trim((string) ($data['jenisPernyataan'] ?? ''));
    $name = trim((string) ($data['name'] ?? ''));
    $email = strtolower(trim((string) ($data['email'] ?? '')));
    $phone = trim((string) ($data['phone'] ?? ''));
    $message = trim((string) ($data['pesan'] ?? ''));
    $turnstileToken = trim((string) ($data['turnstileToken'] ?? ''));
    $privacyAccepted = filter_var($data['privacyAccepted'] ?? false, FILTER_VALIDATE_BOOLEAN);

    $allowedTypes = ['umum', 'properti', 'layanan'];
    if (!in_array($inquiryType, $allowedTypes, true)) {
        contactResponse(422, false, 'Silakan pilih jenis pertanyaan.');
    }
    if (contactLength($name) < 2 || contactLength($name) > 120) {
        contactResponse(422, false, 'Nama harus terdiri dari 2 sampai 120 karakter.');
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || contactLength($email) > 254) {
        contactResponse(422, false, 'Alamat email tidak valid.');
    }
    if ($phone !== '' && (!preg_match('/^[0-9+()\-\s]{7,30}$/', $phone))) {
        contactResponse(422, false, 'Nomor telepon tidak valid.');
    }
    if (contactLength($message) < 20 || contactLength($message) > 3000) {
        contactResponse(422, false, 'Pesan harus terdiri dari 20 sampai 3000 karakter.');
    }
    if (!$privacyAccepted) {
        contactResponse(422, false, 'Persetujuan penggunaan data diperlukan.');
    }

    $remoteIp = substr((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'), 0, 45);
    if (!verifyTurnstile($turnstileToken, $remoteIp)) {
        contactResponse(422, false, 'Verifikasi keamanan gagal. Silakan coba kembali.');
    }

    $database = new Database();
    $db = $database->getConnection();

    $rateLimitMax = max(1, (int) envValue('CONTACT_RATE_LIMIT_MAX', '5'));
    $rateLimitMinutes = max(1, (int) envValue('CONTACT_RATE_LIMIT_MINUTES', '10'));
    $rateLimit = $db->prepare(
        'SELECT COUNT(*) FROM contacts
         WHERE ip_address = :ip_address
         AND created_at >= DATE_SUB(NOW(), INTERVAL :minutes MINUTE)'
    );
    $rateLimit->bindValue(':ip_address', $remoteIp);
    $rateLimit->bindValue(':minutes', $rateLimitMinutes, PDO::PARAM_INT);
    $rateLimit->execute();
    if ((int) $rateLimit->fetchColumn() >= $rateLimitMax) {
        contactResponse(429, false, 'Terlalu banyak percobaan. Silakan tunggu beberapa menit.');
    }

    $insert = $db->prepare(
        'INSERT INTO contacts
            (inquiry_type, name, email, phone, message, status, email_status, ip_address, user_agent)
         VALUES
            (:inquiry_type, :name, :email, :phone, :message, :status, :email_status, :ip_address, :user_agent)'
    );
    $insert->execute([
        ':inquiry_type' => $inquiryType,
        ':name' => $name,
        ':email' => $email,
        ':phone' => $phone !== '' ? $phone : null,
        ':message' => $message,
        ':status' => 'new',
        ':email_status' => 'pending',
        ':ip_address' => $remoteIp,
        ':user_agent' => substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 500),
    ]);
    $contactId = (int) $db->lastInsertId();

    $typeLabels = [
        'umum' => 'Pertanyaan Umum',
        'properti' => 'Pertanyaan Properti',
        'layanan' => 'Pertanyaan Layanan',
    ];
    $typeLabel = $typeLabels[$inquiryType];
    $safeName = htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $safeEmail = htmlspecialchars($email, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $safePhone = htmlspecialchars($phone !== '' ? $phone : '-', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));

    $html = "<h2>Pesan baru dari website FPG</h2>"
        . "<p><strong>Jenis:</strong> {$typeLabel}</p>"
        . "<p><strong>Nama:</strong> {$safeName}</p>"
        . "<p><strong>Email:</strong> {$safeEmail}</p>"
        . "<p><strong>Telepon:</strong> {$safePhone}</p>"
        . "<p><strong>Pesan:</strong><br>{$safeMessage}</p>"
        . "<p><small>Nomor pesan: {$contactId}</small></p>";
    $text = "Pesan baru dari website FPG\n\n"
        . "Jenis: {$typeLabel}\nNama: {$name}\nEmail: {$email}\nTelepon: " . ($phone !== '' ? $phone : '-')
        . "\n\nPesan:\n{$message}\n\nNomor pesan: {$contactId}";

    try {
        $mailResult = sendTransactionalEmail(
            envValue('CONTACT_MAIL_TO', ''),
            "[Website FPG] {$typeLabel} - {$name}",
            $html,
            $text,
            $email,
            "contact-{$contactId}"
        );

        $update = $db->prepare(
            'UPDATE contacts SET email_status = :email_status, provider_message_id = :provider_message_id WHERE id = :id'
        );
        $update->execute([
            ':email_status' => $mailResult['status'],
            ':provider_message_id' => $mailResult['id'],
            ':id' => $contactId,
        ]);
    } catch (Throwable $mailError) {
        error_log("Contact email failed for ID {$contactId}: " . $mailError->getMessage());
        $update = $db->prepare(
            'UPDATE contacts SET email_status = :email_status, email_error = :email_error WHERE id = :id'
        );
        $update->execute([
            ':email_status' => 'failed',
            ':email_error' => substr($mailError->getMessage(), 0, 500),
            ':id' => $contactId,
        ]);
    }

    contactResponse(201, true, 'Pesan Anda telah diterima. Tim kami akan segera menghubungi Anda.');
} catch (Throwable $error) {
    error_log('Contact form error: ' . $error->getMessage());
    contactResponse(500, false, 'Pesan belum dapat diproses. Silakan coba kembali.');
}
