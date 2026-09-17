<?php

require_once __DIR__ . '/environment.php';

header('Access-Control-Allow-Origin: ' . envValue('CORS_ALLOWED_ORIGIN', '*'));
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

function verifyToken()
{
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(["message" => "No token provided"]);
        exit();
    }

    $token = str_replace('Bearer ', '', $headers['Authorization']);
    if ($token === '' || strlen($token) < 20) {
        http_response_code(401);
        echo json_encode(["message" => "Invalid token"]);
        exit();
    }

    return true;
}

function generateToken($userId, $username)
{
    return base64_encode($userId . '|' . $username . '|' . time());
}

class Database
{
    public $conn;

    public function getConnection()
    {
        $this->conn = new PDO(
            sprintf(
                'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
                envValue('DB_HOST', '127.0.0.1'),
                envValue('DB_PORT', '3306'),
                envValue('DB_NAME', 'fpg_properties')
            ),
            envValue('DB_USER', 'root'),
            envValue('DB_PASSWORD', ''),
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );

        return $this->conn;
    }
}
