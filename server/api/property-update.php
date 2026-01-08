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
$company = $_POST['company'] ?? 'FPG'; // ← TAMBAH INI
$description = $_POST['description'] ?? '';
$total_blocks = $_POST['total_blocks'] ?? 0;
$total_units = $_POST['total_units'] ?? 0;
$units_sold = $_POST['units_sold'] ?? 0;
$units_available = $_POST['units_available'] ?? 0;
$welcome_text = $_POST['welcome_text'] ?? '';
$about_text = $_POST['about_text'] ?? '';

// === TAMBAH: daftar URL gallery yang ingin dihapus (kirim dari UI edit) ===
// Support 2 format:
// 1) deleted_gallery_images: string JSON '["url1","url2"]'
// 2) deleted_gallery_images[]: array POST biasa
$deleted_gallery_images = [];
if (isset($_POST['deleted_gallery_images'])) {
    if (is_array($_POST['deleted_gallery_images'])) {
        $deleted_gallery_images = $_POST['deleted_gallery_images'];
    } else {
        $decoded = json_decode($_POST['deleted_gallery_images'], true);
        if (is_array($decoded)) $deleted_gallery_images = $decoded;
    }
}
// === END TAMBAH ===

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

    // Update query - TAMBAH company
    $query = "UPDATE properties SET 
              title = :title,
              location = :location,
              map_embed_url = :map_embed_url,
              type = :type,
              company = :company,
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
    $stmt->bindParam(':company', $company); // ← TAMBAH INI
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':total_blocks', $total_blocks, PDO::PARAM_INT);
    $stmt->bindParam(':total_units', $total_units, PDO::PARAM_INT);
    $stmt->bindParam(':units_sold', $units_sold, PDO::PARAM_INT);
    $stmt->bindParam(':units_available', $units_available, PDO::PARAM_INT);
    $stmt->bindParam(':welcome_text', $welcome_text);
    $stmt->bindParam(':about_text', $about_text);

    if ($mainImage) {
        $stmt->bindParam(':main_image', $mainImage);
    }

    if ($stmt->execute()) {

        // === TAMBAH: hapus gallery yang diminta ===
        if (!empty($deleted_gallery_images) && is_array($deleted_gallery_images)) {
            $galleryDir = $uploadDir . 'gallery/';

            // Delete record + file satu per satu berdasarkan URL
            $delQuery = "DELETE FROM property_galleries 
                         WHERE property_id = :property_id AND image_url = :image_url";
            $delStmt = $db->prepare($delQuery);

            foreach ($deleted_gallery_images as $url) {
                if (!is_string($url) || trim($url) === '') continue;

                // hapus file (kalau ada)
                $filename = basename(parse_url($url, PHP_URL_PATH));
                $filepath = $galleryDir . $filename;
                if ($filename && file_exists($filepath)) {
                    @unlink($filepath);
                }

                // hapus row DB
                $delStmt->bindParam(':property_id', $id);
                $delStmt->bindParam(':image_url', $url);
                $delStmt->execute();
            }
        }
        // === END TAMBAH ===

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