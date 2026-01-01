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

$database = new Database();
$db = $database->getConnection();

try {
    // Get form data - HAPUS video_url, features, amenities
    $title = $_POST['title'] ?? '';
    $location = $_POST['location'] ?? '';
    $type = $_POST['type'] ?? '';
    $total_blocks = $_POST['total_blocks'] ?? 0;
    $total_units = $_POST['total_units'] ?? 0;
    $units_sold = $_POST['units_sold'] ?? 0;
    $units_available = $_POST['units_available'] ?? 0;
    $description = $_POST['description'] ?? '';
    $welcome_text = $_POST['welcome_text'] ?? 'Selamat datang di PT FACHRI PROPERTY GROUP';
    $about_text = $_POST['about_text'] ?? '';
    
    if (empty($title) || empty($location) || empty($type)) {
        throw new Exception("Title, location, and type are required");
    }
    
    // Handle main image upload
    $main_image = null;
    if (isset($_FILES['mainImage']) && $_FILES['mainImage']['error'] === 0) {
        $upload_dir = '../uploads/properties/main/';
        
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
    
    // Insert property - HAPUS video_url, features, amenities
    $query = "INSERT INTO properties (
                title, location, type, 
                total_blocks, total_units, units_sold, units_available,
                description, welcome_text, about_text, 
                main_image, created_at
              ) VALUES (
                :title, :location, :type,
                :total_blocks, :total_units, :units_sold, :units_available,
                :description, :welcome_text, :about_text,
                :main_image, NOW()
              )";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':location', $location);
    $stmt->bindParam(':type', $type);
    $stmt->bindParam(':total_blocks', $total_blocks);
    $stmt->bindParam(':total_units', $total_units);
    $stmt->bindParam(':units_sold', $units_sold);
    $stmt->bindParam(':units_available', $units_available);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':welcome_text', $welcome_text);
    $stmt->bindParam(':about_text', $about_text);
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