<?php

require_once __DIR__ . '/environment.php';

function verifyTurnstile(string $token, string $remoteIp): bool
{
    $secret = envValue('TURNSTILE_SECRET_KEY', '');
    if ($secret === '') {
        if (isProduction()) {
            throw new RuntimeException('Turnstile is not configured on the server.');
        }

        return true;
    }

    if ($token === '' || !function_exists('curl_init')) {
        return false;
    }

    $curl = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POSTFIELDS => http_build_query([
            'secret' => $secret,
            'response' => $token,
            'remoteip' => $remoteIp,
        ]),
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 10,
    ]);

    $responseBody = curl_exec($curl);
    $statusCode = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if ($responseBody === false || $statusCode !== 200) {
        return false;
    }

    $response = json_decode($responseBody, true);
    if (!is_array($response) || ($response['success'] ?? false) !== true) {
        return false;
    }

    $expectedHostname = envValue('TURNSTILE_HOSTNAME', '');
    if ($expectedHostname !== '' && ($response['hostname'] ?? '') !== $expectedHostname) {
        return false;
    }

    $expectedAction = envValue('TURNSTILE_ACTION', 'contact');
    return $expectedAction === '' || ($response['action'] ?? '') === $expectedAction;
}
