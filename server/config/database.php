<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\config\database.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

function verifyToken() {
    $headers = getallheaders();
    
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(["message" => "No token provided"]);
        exit();
    }

    $token = str_replace('Bearer ', '', $headers['Authorization']);
    
    if (empty($token) || strlen($token) < 20) {
        http_response_code(401);
        echo json_encode(["message" => "Invalid token"]);
        exit();
    }
    
    return true;
}

function generateToken($userId, $username) {
    return base64_encode($userId . '|' . $username . '|' . time());
}

class Database {
    private $host = "localhost";
    private $db_name = "fpg_properties";  // ← UBAH DARI fpg_properties KE fpg_property
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        
        return $this->conn;
    }
}
?>