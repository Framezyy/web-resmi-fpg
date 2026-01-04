<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\award-create.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $title = $_POST['title'] ?? '';
    $year = $_POST['year'] ?? '';
    $display_order = $_POST['display_order'] ?? 0;

    if (empty($title)) {
        throw new Exception("Title is required");
    }

    // Handle image upload
    $image_url = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $upload_dir = '../uploads/awards/';
        
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $file_extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $new_filename = 'award_' . time() . '_' . uniqid() . '.' . $file_extension;
        $upload_path = $upload_dir . $new_filename;
        
        if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_path)) {
            $image_url = 'http://localhost/web-resmi-fpg/server/uploads/awards/' . $new_filename;
        } else {
            throw new Exception("Failed to upload image");
        }
    } else {
        throw new Exception("Image is required");
    }

    $query = "INSERT INTO awards (title, year, image_url, display_order, created_at) 
              VALUES (:title, :year, :image_url, :display_order, NOW())";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':year', $year);
    $stmt->bindParam(':image_url', $image_url);
    $stmt->bindParam(':display_order', $display_order);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Award created successfully',
            'id' => $db->lastInsertId()
        ]);
    } else {
        throw new Exception("Failed to create award");
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>