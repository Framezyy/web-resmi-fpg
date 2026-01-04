<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\awards-list.php

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

    $query = "SELECT * FROM awards ORDER BY display_order ASC, created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();

    $awards = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $awards[] = [
            'id' => (int)$row['id'],
            'title' => $row['title'],
            'year' => $row['year'] ?? '',
            'image' => $row['image_url'],
            'display_order' => (int)$row['display_order']
        ];
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $awards
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>