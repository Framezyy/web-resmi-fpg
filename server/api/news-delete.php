<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\news-delete.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';

verifyToken();

function localPathFromUrl(?string $url): ?string {
    if (!$url) return null;
    $path = parse_url($url, PHP_URL_PATH);
    if (!$path) return null;
    $filename = basename($path);
    if (!$filename) return null;
    return "../uploads/news/" . $filename;
}

try {
    $database = new Database();
    $db = $database->getConnection();

    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "id tidak valid"]);
        exit();
    }

    $get = $db->prepare("SELECT cover_image FROM news WHERE id = :id LIMIT 1");
    $get->bindParam(':id', $id, PDO::PARAM_INT);
    $get->execute();

    if ($get->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Berita tidak ditemukan"]);
        exit();
    }

    $row = $get->fetch(PDO::FETCH_ASSOC);
    $cover = $row['cover_image'] ?? null;

    $del = $db->prepare("DELETE FROM news WHERE id = :id");
    $del->bindParam(':id', $id, PDO::PARAM_INT);
    $del->execute();

    $oldPath = localPathFromUrl($cover);
    if ($oldPath && file_exists($oldPath)) @unlink($oldPath);

    http_response_code(200);
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}