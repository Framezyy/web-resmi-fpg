<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\award-delete.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($id <= 0) {
        throw new Exception("Invalid award ID");
    }

    // Get image URL before delete
    $query = "SELECT image_url FROM awards WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $award = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$award) {
        throw new Exception("Award not found");
    }

    // Delete from database
    $delete_query = "DELETE FROM awards WHERE id = :id";
    $delete_stmt = $db->prepare($delete_query);
    $delete_stmt->bindParam(':id', $id);

    if ($delete_stmt->execute()) {
        // Delete image file
        if (!empty($award['image_url'])) {
            $filename = basename($award['image_url']);
            $file_path = '../uploads/awards/' . $filename;
            if (file_exists($file_path)) {
                unlink($file_path);
            }
        }

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Award deleted successfully'
        ]);
    } else {
        throw new Exception("Failed to delete award");
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>