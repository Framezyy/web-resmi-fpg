<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\news-create.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';

verifyToken();

function parseContentFromPost(): array {
    if (isset($_POST['content']) && is_string($_POST['content'])) {
        $decoded = json_decode($_POST['content'], true);
        if (is_array($decoded)) {
            return array_values(array_filter($decoded, fn($x) => is_string($x) && trim($x) !== ''));
        }
    }
    if (isset($_POST['content']) && is_array($_POST['content'])) {
        return array_values(array_filter($_POST['content'], fn($x) => is_string($x) && trim($x) !== ''));
    }
    return [];
}

try {
    $database = new Database();
    $db = $database->getConnection();

    $title = trim($_POST['title'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $summary = trim($_POST['summary'] ?? '');
    $location = trim($_POST['location'] ?? '');
    $publishedAt = trim($_POST['publishedAt'] ?? '');

    if ($title === '') {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "title wajib diisi"]);
        exit();
    }

    if ($publishedAt !== '') {
        $publishedAt = substr($publishedAt, 0, 10);
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $publishedAt)) $publishedAt = '';
    }

    $contentArr = parseContentFromPost();
    $contentJson = json_encode($contentArr, JSON_UNESCAPED_UNICODE);

    // Upload cover
    $coverUrl = null;
    $uploadDir = "../uploads/news/";
    if (isset($_FILES['coverImage']) && $_FILES['coverImage']['error'] === 0) {
        if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);

        $ext = pathinfo($_FILES['coverImage']['name'], PATHINFO_EXTENSION);
        $safeName = time() . '_' . bin2hex(random_bytes(6)) . ($ext ? ('.' . $ext) : '');
        $target = $uploadDir . $safeName;

        if (!move_uploaded_file($_FILES['coverImage']['tmp_name'], $target)) {
            throw new Exception("Gagal upload cover image");
        }

        $coverUrl = 'http://localhost/web-resmi-fpg/server/uploads/news/' . $safeName;
    }

    $q = "INSERT INTO news (title, category, summary, location, published_at, cover_image, content_json)
          VALUES (:title, :category, :summary, :location, :published_at, :cover_image, :content_json)";
    $stmt = $db->prepare($q);
    $stmt->bindValue(':title', $title);
    $stmt->bindValue(':category', $category !== '' ? $category : null);
    $stmt->bindValue(':summary', $summary !== '' ? $summary : null);
    $stmt->bindValue(':location', $location !== '' ? $location : null);
    $stmt->bindValue(':published_at', $publishedAt !== '' ? $publishedAt : null);
    $stmt->bindValue(':cover_image', $coverUrl);
    $stmt->bindValue(':content_json', $contentJson);
    $stmt->execute();

    http_response_code(201);
    echo json_encode(["success" => true, "id" => (string)$db->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}