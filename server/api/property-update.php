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

// Get data - TAMBAH field yang kurang
$id = $_POST['id'] ?? '';
$title = $_POST['title'] ?? '';
$location = $_POST['location'] ?? '';
$map_embed_url = $_POST['map_embed_url'] ?? null;
$type = $_POST['type'] ?? '';
$description = $_POST['description'] ?? '';
$total_blocks = $_POST['total_blocks'] ?? 0;          // ← TAMBAH
$total_units = $_POST['total_units'] ?? 0;            // ← TAMBAH
$units_sold = $_POST['units_sold'] ?? 0;              // ← TAMBAH
$units_available = $_POST['units_available'] ?? 0;    // ← TAMBAH
$welcome_text = $_POST['welcome_text'] ?? '';         // ← TAMBAH
$about_text = $_POST['about_text'] ?? '';             // ← TAMBAH

// Extract src from iframe
if ($map_embed_url && strpos($map_embed_url, '<iframe') !== false) {
    preg_match('/src="([^"]+)"/', $map_embed_url, $matches);
    $map_embed_url = $matches[1] ?? null;
}

try {
    // Handle main image if uploaded
    $mainImage = null;
    if (isset($_FILES['mainImage']) && $_FILES['mainImage']['error'] === 0) {
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $mainImageName = time() . '_' . $_FILES['mainImage']['name'];
        if (move_uploaded_file($_FILES['mainImage']['tmp_name'], $uploadDir . $mainImageName)) {
            $mainImage = 'http://localhost/web-resmi-fpg/server/uploads/properties/' . $mainImageName;
        }
    }

    // Update query - TAMBAH semua field
    $query = "UPDATE properties SET 
              title = :title,
              location = :location,
              map_embed_url = :map_embed_url,
              type = :type,
              description = :description,
              total_blocks = :total_blocks,
              total_units = :total_units,
              units_sold = :units_sold,
              units_available = :units_available,
              welcome_text = :welcome_text,
              about_text = :about_text" . 
              ($mainImage ? ", main_image = :main_image" : "") . 
              " WHERE id = :id";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':location', $location);
    $stmt->bindParam(':map_embed_url', $map_embed_url);
    $stmt->bindParam(':type', $type);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':total_blocks', $total_blocks, PDO::PARAM_INT);      // ← TAMBAH
    $stmt->bindParam(':total_units', $total_units, PDO::PARAM_INT);        // ← TAMBAH
    $stmt->bindParam(':units_sold', $units_sold, PDO::PARAM_INT);          // ← TAMBAH
    $stmt->bindParam(':units_available', $units_available, PDO::PARAM_INT);// ← TAMBAH
    $stmt->bindParam(':welcome_text', $welcome_text);                      // ← TAMBAH
    $stmt->bindParam(':about_text', $about_text);                          // ← TAMBAH

    if ($mainImage) {
        $stmt->bindParam(':main_image', $mainImage);
    }

    if ($stmt->execute()) {
        // Handle gallery images if uploaded
        if (isset($_FILES['galleryImages'])) {
            $galleryDir = $uploadDir . 'gallery/';
            if (!file_exists($galleryDir)) {
                mkdir($galleryDir, 0777, true);
            }

            foreach ($_FILES['galleryImages']['tmp_name'] as $key => $tmp_name) {
                if ($_FILES['galleryImages']['error'][$key] === 0) {
                    $galleryImageName = time() . '_' . $key . '_' . $_FILES['galleryImages']['name'][$key];
                    if (move_uploaded_file($tmp_name, $galleryDir . $galleryImageName)) {
                        $imageUrl = 'http://localhost/web-resmi-fpg/server/uploads/properties/gallery/' . $galleryImageName;
                        
                        $galleryQuery = "INSERT INTO property_galleries (property_id, image_url) VALUES (:property_id, :image_url)";
                        $galleryStmt = $db->prepare($galleryQuery);
                        $galleryStmt->bindParam(':property_id', $id);
                        $galleryStmt->bindParam(':image_url', $imageUrl);
                        $galleryStmt->execute();
                    }
                }
            }
        }

        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Property updated successfully"
        ]);
    } else {
        throw new Exception("Failed to update property");
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>