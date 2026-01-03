<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\properties.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // Query untuk ambil SEMUA field dari database
    $query = "SELECT 
                id, title, location, map_embed_url, type, description,
                total_blocks, total_units, units_sold, units_available,
                welcome_text, about_text, main_image, created_at, updated_at
              FROM properties 
              ORDER BY id DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();

    $properties = [];
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $properties[] = [
            'id' => (int)$row['id'],
            'title' => $row['title'],
            'location' => $row['location'],
            'map_embed_url' => $row['map_embed_url'],
            'type' => $row['type'],
            'description' => $row['description'],
            'total_blocks' => (int)$row['total_blocks'],
            'total_units' => (int)$row['total_units'],
            'units_sold' => (int)$row['units_sold'],
            'units_available' => (int)$row['units_available'],
            'welcome_text' => $row['welcome_text'],
            'about_text' => $row['about_text'],
            'image' => $row['main_image'],
            'main_image' => $row['main_image'],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at']
        ];
    }

    http_response_code(200);
    echo json_encode($properties);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>