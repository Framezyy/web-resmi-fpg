<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include_once '../config/database.php';
include_once '../config/auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

verifyToken();

$database = new Database();
$db = $database->getConnection();

$uploadDir = "../uploads/properties/";

$id = $_POST['id'] ?? '';
$title = $_POST['title'] ?? '';
$location = $_POST['location'] ?? '';
$type = $_POST['type'] ?? '';
$description = $_POST['description'] ?? '';

if (empty($id) || empty($title) || empty($location) || empty($type)) {
    http_response_code(400);
    echo json_encode(["message" => "Required fields missing"]);
    exit();
}

$mainImage = null;

// Upload new main image if provided
if (isset($_FILES['mainImage']) && $_FILES['mainImage']['error'] === 0) {
    // Get old image
    $oldQuery = "SELECT main_image FROM properties WHERE id = :id";
    $oldStmt = $db->prepare($oldQuery);
    $oldStmt->bindParam(':id', $id);
    $oldStmt->execute();
    $oldData = $oldStmt->fetch(PDO::FETCH_ASSOC);
    
    // Delete old image
    if ($oldData['main_image'] && file_exists($uploadDir . $oldData['main_image'])) {
        unlink($uploadDir . $oldData['main_image']);
    }
    
    $fileExt = pathinfo($_FILES['mainImage']['name'], PATHINFO_EXTENSION);
    $mainImage = 'main_' . time() . '_' . uniqid() . '.' . $fileExt;
    move_uploaded_file($_FILES['mainImage']['tmp_name'], $uploadDir . $mainImage);
}

// Update property
$query = "UPDATE properties SET 
          title = :title, 
          location = :location, 
          type = :type, 
          description = :description";

if ($mainImage) {
    $query .= ", main_image = :main_image";
}

$query .= " WHERE id = :id";

$stmt = $db->prepare($query);
$stmt->bindParam(':title', $title);
$stmt->bindParam(':location', $location);
$stmt->bindParam(':type', $type);
$stmt->bindParam(':description', $description);
$stmt->bindParam(':id', $id);

if ($mainImage) {
    $stmt->bindParam(':main_image', $mainImage);
}

if ($stmt->execute()) {
    // Upload additional gallery images
    if (isset($_FILES['galleryImages'])) {
        $galleryQuery = "INSERT INTO property_galleries (property_id, image_path) VALUES (:property_id, :image_path)";
        $galleryStmt = $db->prepare($galleryQuery);
        
        foreach ($_FILES['galleryImages']['tmp_name'] as $key => $tmpName) {
            if ($_FILES['galleryImages']['error'][$key] === 0) {
                $fileExt = pathinfo($_FILES['galleryImages']['name'][$key], PATHINFO_EXTENSION);
                $galleryImage = 'gallery_' . time() . '_' . $key . '_' . uniqid() . '.' . $fileExt;
                move_uploaded_file($tmpName, $uploadDir . $galleryImage);
                
                $galleryStmt->bindParam(':property_id', $id);
                $galleryStmt->bindParam(':image_path', $galleryImage);
                $galleryStmt->execute();
            }
        }
    }
    
    http_response_code(200);
    echo json_encode(["message" => "Property updated successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Failed to update property"]);
}
?>