<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\property-detail.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    if ($db === null) {
        throw new Exception("Database connection failed");
    }

    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid property ID"]);
        exit();
    }

    $query = "SELECT * FROM properties WHERE id = :id LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Property not found"]);
        exit();
    }

    $property = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Get gallery images
    $galleryQuery = "SELECT image_url FROM property_galleries WHERE property_id = :id ORDER BY id ASC";
    $galleryStmt = $db->prepare($galleryQuery);
    $galleryStmt->bindParam(':id', $id, PDO::PARAM_INT);
    $galleryStmt->execute();
    
    $galleries = [];
    while ($row = $galleryStmt->fetch(PDO::FETCH_ASSOC)) {
        if (!empty($row['image_url'])) {
            $galleries[] = $row['image_url'];
        }
    }
    
    // Return data - HAPUS video_url, features, amenities
    $response = [
        'success' => true,
        'id' => (int)$property['id'],
        'title' => $property['title'],
        'location' => $property['location'],
        'type' => $property['type'],
        'total_blocks' => (int)($property['total_blocks'] ?? 0),
        'total_units' => (int)($property['total_units'] ?? 0),
        'units_sold' => (int)($property['units_sold'] ?? 0),
        'units_available' => (int)($property['units_available'] ?? 0),
        'description' => $property['description'] ?? '',
        'main_image' => $property['main_image'] ?? null,
        'image' => $property['main_image'] ?? null,
        'gallery_images' => $galleries,
        'welcome_text' => $property['welcome_text'] ?? 'Selamat datang di PT FACHRI PROPERTY GROUP',
        'about_text' => $property['about_text'] ?? 'Borneo Real Properti Adalah Perusahaan...',
        'created_at' => $property['created_at'],
        'updated_at' => $property['updated_at'] ?? null
    ];
    
    http_response_code(200);
    echo json_encode($response);

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