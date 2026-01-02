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
    // Get form data - TAMBAH field yang kurang
    $title = $_POST['title'] ?? '';
    $location = $_POST['location'] ?? '';
    $map_embed_url = $_POST['map_embed_url'] ?? null;
    $type = $_POST['type'] ?? '';
    $description = $_POST['description'] ?? '';
    $total_blocks = $_POST['total_blocks'] ?? 0;        // ← TAMBAH
    $total_units = $_POST['total_units'] ?? 0;          // ← TAMBAH
    $units_sold = $_POST['units_sold'] ?? 0;            // ← TAMBAH
    $units_available = $_POST['units_available'] ?? 0;  // ← TAMBAH
    $welcome_text = $_POST['welcome_text'] ?? 'Selamat datang di PT FACHRI PROPERTY GROUP';  // ← TAMBAH
    $about_text = $_POST['about_text'] ?? '';           // ← TAMBAH

    // Extract src from iframe
    if ($map_embed_url && strpos($map_embed_url, '<iframe') !== false) {
        preg_match('/src="([^"]+)"/', $map_embed_url, $matches);
        $map_embed_url = $matches[1] ?? null;
    }

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

    // Insert property - TAMBAH semua field
    $query = "INSERT INTO properties (
                title, location, map_embed_url, type, description, 
                total_blocks, total_units, units_sold, units_available,
                welcome_text, about_text, main_image, created_at
              ) VALUES (
                :title, :location, :map_embed_url, :type, :description,
                :total_blocks, :total_units, :units_sold, :units_available,
                :welcome_text, :about_text, :main_image, NOW()
              )";

    $stmt = $db->prepare($query);
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