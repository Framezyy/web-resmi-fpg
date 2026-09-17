<?php

require_once __DIR__ . '/environment.php';

function sendTransactionalEmail(
    string $to,
    string $subject,
    string $html,
    string $text,
    ?string $replyTo = null,
    ?string $idempotencyKey = null
): array {
    $mode = strtolower(envValue('MAIL_MODE', isProduction() ? 'resend' : 'log'));
    if ($mode === 'log') {
        error_log("Email skipped in log mode. To={$to}; Subject={$subject}");
        return ['status' => 'skipped', 'id' => null];
    }

    $apiKey = envValue('RESEND_API_KEY', '');
    $from = envValue('MAIL_FROM', '');
    if ($apiKey === '' || $from === '') {
        throw new RuntimeException('Resend email configuration is incomplete.');
    }

    if (!function_exists('curl_init')) {
        throw new RuntimeException('PHP cURL extension is required to send email.');
    }

    $payload = [
        'from' => $from,
        'to' => [$to],
        'subject' => $subject,
        'html' => $html,
        'text' => $text,
    ];
    if ($replyTo !== null && $replyTo !== '') {
        $payload['reply_to'] = $replyTo;
    }

    $headers = [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ];
    if ($idempotencyKey !== null && $idempotencyKey !== '') {
        $headers[] = 'Idempotency-Key: ' . $idempotencyKey;
    }

    $curl = curl_init('https://api.resend.com/emails');
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 15,
    ]);

    $responseBody = curl_exec($curl);
    $curlError = curl_error($curl);
    $statusCode = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if ($responseBody === false || $curlError !== '') {
        throw new RuntimeException('Unable to connect to the email service.');
    }

    $response = json_decode($responseBody, true);
    if ($statusCode < 200 || $statusCode >= 300 || !is_array($response)) {
        $message = is_array($response) ? ($response['message'] ?? 'Email service rejected the request.') : 'Invalid email service response.';
        throw new RuntimeException($message);
    }

    return ['status' => 'sent', 'id' => $response['id'] ?? null];
}
