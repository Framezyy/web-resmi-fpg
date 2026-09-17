<?php

require_once __DIR__ . '/environment.php';

function publicAssetUrl(string $path): string
{
    $baseUrl = rtrim(envValue('APP_URL', ''), '/');
    if ($baseUrl === '') {
        throw new RuntimeException('APP_URL is required to create public asset URLs.');
    }

    return $baseUrl . '/' . ltrim($path, '/');
}
