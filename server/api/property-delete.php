<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\property-delete.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';

// Verify token
verifyToken();

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db === null) {
        throw new Exception("Database connection failed");
    }
    
    // Get property ID from URL
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    if ($id <= 0) {
        throw new Exception("Invalid property ID");
    }
    
    // Get property details untuk hapus gambar
    $query = "SELECT main_image FROM properties WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    
    if ($stmt->rowCount() == 0) {
        throw new Exception("Property not found");
    }
    
    $property = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Get gallery images
    $galleryQuery = "SELECT image_url FROM property_galleries WHERE property_id = :id";
    $galleryStmt = $db->prepare($galleryQuery);
    $galleryStmt->bindParam(':id', $id, PDO::PARAM_INT);
    $galleryStmt->execute();
    $galleryImages = $galleryStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Delete main image file dari server
    if (!empty($property['main_image'])) {
        // Extract filename dari URL
        $mainImageUrl = $property['main_image'];
        $filename = basename(parse_url($mainImageUrl, PHP_URL_PATH));
        $filepath = '../uploads/properties/main/' . $filename;
        
        if (file_exists($filepath)) {
            unlink($filepath);
        }
    }
    
    // Delete gallery image files dari server
    foreach ($galleryImages as $gallery) {
        if (!empty($gallery['image_url'])) {
            $galleryImageUrl = $gallery['image_url'];
            $filename = basename(parse_url($galleryImageUrl, PHP_URL_PATH));
            $filepath = '../uploads/properties/gallery/' . $filename;
            
            if (file_exists($filepath)) {
                unlink($filepath);
            }
        }
    }
    
    // Delete gallery records dari database (akan otomatis terhapus karena foreign key CASCADE)
    $deleteGalleryQuery = "DELETE FROM property_galleries WHERE property_id = :id";
    $deleteGalleryStmt = $db->prepare($deleteGalleryQuery);
    $deleteGalleryStmt->bindParam(':id', $id, PDO::PARAM_INT);
    $deleteGalleryStmt->execute();
    
    // Delete property dari database
    $deleteQuery = "DELETE FROM properties WHERE id = :id";
    $deleteStmt = $db->prepare($deleteQuery);
    $deleteStmt->bindParam(':id', $id, PDO::PARAM_INT);
    
    if ($deleteStmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Property deleted successfully"
        ]);
    } else {
        throw new Exception("Failed to delete property from database");
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>