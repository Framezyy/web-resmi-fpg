<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\recap-create.php

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
        'message' => 'Authentication failed: ' . $e->getMessage()
    ]);
    exit();
}

try {
    $database = new Database();
    $db = $database->getConnection();

    $data = json_decode(file_get_contents("php://input"), true);

    $company_id = trim($data['company_id'] ?? '');
    $company_name = trim($data['company_name'] ?? '');
    $display_order = isset($data['display_order']) ? intval($data['display_order']) : 0; // ← TAMBAH INI
    $total_komplek = isset($data['total_komplek']) ? intval($data['total_komplek']) : 0;
    $total_rumah = isset($data['total_rumah']) ? intval($data['total_rumah']) : 0;
    $total_terjual = isset($data['total_terjual']) ? intval($data['total_terjual']) : 0;

    if (empty($company_id)) {
        throw new Exception("Company ID is required");
    }

    if (empty($company_name)) {
        throw new Exception("Company name is required");
    }

    $checkQuery = "SELECT id FROM company_recaps WHERE company_id = :company_id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':company_id', $company_id);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        throw new Exception("Company ID '$company_id' already exists. Please use a different ID.");
    }

    // ← TAMBAH display_order di query
    $query = "INSERT INTO company_recaps (
                company_id, company_name, display_order, total_komplek, total_rumah, total_terjual, created_at
              ) VALUES (
                :company_id, :company_name, :display_order, :total_komplek, :total_rumah, :total_terjual, NOW()
              )";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':company_id', $company_id);
    $stmt->bindParam(':company_name', $company_name);
    $stmt->bindParam(':display_order', $display_order, PDO::PARAM_INT); // ← TAMBAH INI
    $stmt->bindParam(':total_komplek', $total_komplek, PDO::PARAM_INT);
    $stmt->bindParam(':total_rumah', $total_rumah, PDO::PARAM_INT);
    $stmt->bindParam(':total_terjual', $total_terjual, PDO::PARAM_INT);

    if ($stmt->execute()) {
        ob_clean();
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Recap created successfully',
            'id' => (int)$db->lastInsertId()
        ]);
        exit();
    } else {
        throw new Exception("Failed to insert data to database");
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