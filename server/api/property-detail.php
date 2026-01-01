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
    
    // Return SEMUA field dari database
    $response = [
        'success' => true,
        'id' => (int)$property['id'],
        'title' => $property['title'],
        'location' => $property['location'],
        'type' => $property['type'],
        'description' => $property['description'] ?? '',
        'main_image' => $property['main_image'] ?? null,
        'image' => $property['main_image'] ?? null,
        'gallery_images' => $galleries,
        'land_area' => $property['land_area'] ?? '2.000 hektar',
        'development_type' => $property['development_type'] ?? 'Pengembangan Terintegrasi',
        'city_distance' => $property['city_distance'] ?? '15 km dari Pusat Kota Surabaya',
        'airport_distance' => $property['airport_distance'] ?? '20 km dari Bandara Internasional Juanda',
        'welcome_text' => $property['welcome_text'] ?? 'Selamat datang di PT FACHRI PROPERTY GROUP',
        'about_text' => $property['about_text'] ?? 'Borneo Real Properti Adalah Perusahaan...',
        'video_url' => $property['video_url'] ?? '',
        'features' => $property['features'] ?? '',
        'amenities' => $property['amenities'] ?? '',
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