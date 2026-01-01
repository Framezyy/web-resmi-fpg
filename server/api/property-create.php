<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\property-create.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';

// Verify token
verifyToken();

// Database connection
$database = new Database();
$db = $database->getConnection();

try {
    // Get form data
    $title = $_POST['title'] ?? '';
    $location = $_POST['location'] ?? '';
    $type = $_POST['type'] ?? '';
    $description = $_POST['description'] ?? '';
    $land_area = $_POST['land_area'] ?? '';
    $development_type = $_POST['development_type'] ?? 'Pengembangan Terintegrasi';
    $city_distance = $_POST['city_distance'] ?? '';
    $airport_distance = $_POST['airport_distance'] ?? '';
    $welcome_text = $_POST['welcome_text'] ?? 'Selamat datang di PT FACHRI PROPERTY GROUP';
    $about_text = $_POST['about_text'] ?? '';
    $video_url = $_POST['video_url'] ?? '';
    $features = $_POST['features'] ?? '';
    $amenities = $_POST['amenities'] ?? '';
    
    // Validate required fields
    if (empty($title) || empty($location) || empty($type)) {
        throw new Exception("Title, location, and type are required");
    }
    
    // Handle main image upload
    $main_image = null;
    if (isset($_FILES['mainImage']) && $_FILES['mainImage']['error'] === 0) {
        $upload_dir = '../uploads/properties/main/';
        
        // Create directory if not exists
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $file_extension = pathinfo($_FILES['mainImage']['name'], PATHINFO_EXTENSION);
        $new_filename = 'main_' . time() . '_' . uniqid() . '.' . $file_extension;
        $upload_path = $upload_dir . $new_filename;
        
        if (move_uploaded_file($_FILES['mainImage']['tmp_name'], $upload_path)) {
            $main_image = 'http://localhost/web-resmi-fpg/server/uploads/properties/main/' . $new_filename;
        }
    }
    
    // Insert property dengan SEMUA field
    $query = "INSERT INTO properties (
                title, location, type, description, 
                land_area, development_type, city_distance, airport_distance,
                welcome_text, about_text, video_url, features, amenities,
                main_image, created_at
              ) VALUES (
                :title, :location, :type, :description,
                :land_area, :development_type, :city_distance, :airport_distance,
                :welcome_text, :about_text, :video_url, :features, :amenities,
                :main_image, NOW()
              )";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':location', $location);
    $stmt->bindParam(':type', $type);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':land_area', $land_area);
    $stmt->bindParam(':development_type', $development_type);
    $stmt->bindParam(':city_distance', $city_distance);
    $stmt->bindParam(':airport_distance', $airport_distance);
    $stmt->bindParam(':welcome_text', $welcome_text);
    $stmt->bindParam(':about_text', $about_text);
    $stmt->bindParam(':video_url', $video_url);
    $stmt->bindParam(':features', $features);
    $stmt->bindParam(':amenities', $amenities);
    $stmt->bindParam(':main_image', $main_image);
    
    if ($stmt->execute()) {
        $property_id = $db->lastInsertId();
        
        // Handle gallery images
        if (isset($_FILES['galleryImages']) && is_array($_FILES['galleryImages']['name'])) {
            $gallery_dir = '../uploads/properties/gallery/';
            
            if (!file_exists($gallery_dir)) {
                mkdir($gallery_dir, 0777, true);
            }
            
            foreach ($_FILES['galleryImages']['tmp_name'] as $key => $tmp_name) {
                if ($_FILES['galleryImages']['error'][$key] === 0) {
                    $file_extension = pathinfo($_FILES['galleryImages']['name'][$key], PATHINFO_EXTENSION);
                    $gallery_filename = 'gallery_' . time() . '_' . uniqid() . '.' . $file_extension;
                    $gallery_path = $gallery_dir . $gallery_filename;
                    
                    if (move_uploaded_file($tmp_name, $gallery_path)) {
                        $gallery_url = 'http://localhost/web-resmi-fpg/server/uploads/properties/gallery/' . $gallery_filename;
                        
                        // Insert to property_galleries table
                        $gallery_query = "INSERT INTO property_galleries (property_id, image_url, created_at) 
                                        VALUES (:property_id, :image_url, NOW())";
                        $gallery_stmt = $db->prepare($gallery_query);
                        $gallery_stmt->bindParam(':property_id', $property_id);
                        $gallery_stmt->bindParam(':image_url', $gallery_url);
                        $gallery_stmt->execute();
                    }
                }
            }
        }
        
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Property created successfully",
            "id" => $property_id
        ]);
    } else {
        throw new Exception("Failed to create property");
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>