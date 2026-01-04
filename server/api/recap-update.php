<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\recap-update.php

error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';
include_once '../config/auth.php';

try {
    verifyToken();
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Authentication failed'
    ]);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();

    $data = json_decode(file_get_contents("php://input"), true);

    $company_id = trim($data['company_id'] ?? '');
    $display_order = isset($data['display_order']) ? intval($data['display_order']) : 0; // ← TAMBAH INI
    $total_komplek = isset($data['total_komplek']) ? intval($data['total_komplek']) : 0;
    $total_rumah = isset($data['total_rumah']) ? intval($data['total_rumah']) : 0;
    $total_terjual = isset($data['total_terjual']) ? intval($data['total_terjual']) : 0;

    if (empty($company_id)) {
        throw new Exception("Company ID is required");
    }

    // ← TAMBAH display_order di query
    $query = "UPDATE company_recaps SET 
              display_order = :display_order,
              total_komplek = :total_komplek,
              total_rumah = :total_rumah,
              total_terjual = :total_terjual,
              updated_at = NOW()
              WHERE company_id = :company_id";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':company_id', $company_id);
    $stmt->bindParam(':display_order', $display_order, PDO::PARAM_INT); // ← TAMBAH INI
    $stmt->bindParam(':total_komplek', $total_komplek, PDO::PARAM_INT);
    $stmt->bindParam(':total_rumah', $total_rumah, PDO::PARAM_INT);
    $stmt->bindParam(':total_terjual', $total_terjual, PDO::PARAM_INT);

    if ($stmt->execute()) {
        ob_clean();
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Recap updated successfully'
        ]);
        exit();
    } else {
        throw new Exception("Failed to update data");
    }

} catch (Exception $e) {
    ob_clean();
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
    exit();
}
?>