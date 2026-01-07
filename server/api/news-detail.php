<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\news-detail.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(null);
        exit();
    }

    $q = "SELECT id, title, category, summary, location, published_at, cover_image, content_json
          FROM news
          WHERE id = :id
          LIMIT 1";
    $stmt = $db->prepare($q);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(null);
        exit();
    }

    $r = $stmt->fetch(PDO::FETCH_ASSOC);

    $content = [];
    if (!empty($r['content_json'])) {
        $decoded = json_decode($r['content_json'], true);
        if (is_array($decoded)) $content = $decoded;
    }

    http_response_code(200);
    echo json_encode([
        "id" => (string)$r["id"],
        "title" => $r["title"],
        "category" => $r["category"],
        "summary" => $r["summary"],
        "location" => $r["location"],
        "publishedAt" => $r["published_at"] ? $r["published_at"] : null,
        "coverImage" => $r["cover_image"],
        "content" => $content,
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(null);
}