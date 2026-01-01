<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\properties.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db === null) {
        throw new Exception("Database connection failed");
    }
    
    // Query untuk get semua properties
    $query = "SELECT 
                p.id,
                p.title,
                p.location,
                p.type,
                p.description,
                p.main_image,
                p.created_at,
                p.updated_at
              FROM properties p
              ORDER BY p.created_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $properties = [];
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Get gallery images untuk setiap property
        $gallery_query = "SELECT image_url FROM property_galleries WHERE property_id = :property_id ORDER BY created_at";
        $gallery_stmt = $db->prepare($gallery_query);
        $gallery_stmt->bindParam(':property_id', $row['id']);
        $gallery_stmt->execute();
        
        $gallery_images = [];
        while ($gallery_row = $gallery_stmt->fetch(PDO::FETCH_ASSOC)) {
            $gallery_images[] = $gallery_row['image_url'];
        }
        
        $property = [
            'id' => $row['id'],
            'title' => $row['title'],
            'location' => $row['location'],
            'type' => $row['type'],
            'description' => $row['description'],
            'image' => $row['main_image'],
            'main_image' => $row['main_image'],
            'gallery' => $gallery_images,
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at']
        ];
        
        $properties[] = $property;
    }
    
    http_response_code(200);
    echo json_encode($properties);
    
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