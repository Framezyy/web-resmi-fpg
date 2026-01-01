<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\admin-reset-password.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';

try {
    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->user_id) || !isset($data->new_password)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Missing required fields"
        ]);
        exit();
    }

    $user_id = $data->user_id;
    $new_password = $data->new_password;

    if (strlen($new_password) < 8) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Password must be at least 8 characters"
        ]);
        exit();
    }

    $database = new Database();
    $db = $database->getConnection();

    if ($db === null) {
        throw new Exception("Database connection failed");
    }

    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

    // HAPUS updated_at dari query
    $query = "UPDATE admin_users 
              SET password = :password 
              WHERE id = :user_id";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':password', $hashed_password);
    $stmt->bindParam(':user_id', $user_id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Password reset successfully"
        ]);
    } else {
        throw new Exception("Failed to update password");
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>