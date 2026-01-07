<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\news-list.php

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

    $q = "SELECT id, title, category, summary, location, published_at, cover_image, content_json
          FROM news
          ORDER BY published_at DESC, id DESC";
    $stmt = $db->prepare($q);
    $stmt->execute();

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $out = array_map(function ($r) {
        $content = [];
        if (!empty($r['content_json'])) {
            $decoded = json_decode($r['content_json'], true);
            if (is_array($decoded)) $content = $decoded;
        }

        return [
            "id" => (string)$r["id"],
            "title" => $r["title"],
            "category" => $r["category"],
            "summary" => $r["summary"],
            "location" => $r["location"],
            "publishedAt" => $r["published_at"] ? $r["published_at"] : null,
            "coverImage" => $r["cover_image"],
            "content" => $content,
        ];
    }, $rows);

    http_response_code(200);
    echo json_encode($out);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([]);
}
