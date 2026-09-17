<?php

function loadEnvironment(string $path): void
{
    if (!is_file($path) || !is_readable($path)) {
        return;
    }

    $values = parse_ini_file($path, false, INI_SCANNER_RAW);
    if ($values === false) {
        throw new RuntimeException("Unable to read environment file: {$path}");
    }

    foreach ($values as $key => $value) {
        if (getenv($key) !== false) {
            continue;
        }

        $stringValue = (string) $value;
        putenv("{$key}={$stringValue}");
        $_ENV[$key] = $stringValue;
    }
}

function envValue(string $key, ?string $default = null): ?string
{
    $value = getenv($key);
    return $value === false ? $default : $value;
}

function envBool(string $key, bool $default = false): bool
{
    $value = envValue($key);
    if ($value === null) {
        return $default;
    }

    return filter_var($value, FILTER_VALIDATE_BOOLEAN);
}

function isProduction(): bool
{
    return strtolower(envValue('APP_ENV', 'production')) === 'production';
}

loadEnvironment(dirname(__DIR__) . '/.env');
