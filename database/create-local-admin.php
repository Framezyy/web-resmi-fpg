<?php

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "This script can only be run from the command line.\n");
    exit(1);
}

$password = getenv('FPG_ADMIN_PASSWORD');
if ($password === false || strlen($password) < 12) {
    fwrite(STDERR, "Set FPG_ADMIN_PASSWORD to a value with at least 12 characters.\n");
    exit(1);
}

$host = getenv('FPG_DB_HOST') ?: '127.0.0.1';
$port = getenv('FPG_DB_PORT') ?: '3306';
$database = getenv('FPG_DB_NAME') ?: 'fpg_properties';
$username = getenv('FPG_DB_USER') ?: 'root';
$dbPassword = getenv('FPG_DB_PASSWORD') ?: '';

try {
    $pdo = new PDO(
        "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4",
        $username,
        $dbPassword,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $statement = $pdo->prepare(
        'INSERT INTO admin_users
            (username, email, password, security_question, security_answer)
         VALUES
            (:username, :email, :password, :security_question, :security_answer)
         ON DUPLICATE KEY UPDATE
            email = VALUES(email),
            password = VALUES(password),
            security_question = VALUES(security_question),
            security_answer = VALUES(security_answer)'
    );

    $statement->execute([
        ':username' => 'admin_fpg',
        ':email' => 'admin@localhost.test',
        ':password' => password_hash($password, PASSWORD_DEFAULT),
        ':security_question' => 'Local development account',
        ':security_answer' => 'local',
    ]);

    fwrite(STDOUT, "Local admin account created or updated.\n");
} catch (Throwable $error) {
    fwrite(STDERR, "Failed to create local admin: {$error->getMessage()}\n");
    exit(1);
}
