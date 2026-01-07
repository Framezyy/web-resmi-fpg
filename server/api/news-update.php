<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\news-update.php

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

    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "id tidak valid"]);
        exit();
    }

    $oldStmt = $db->prepare("SELECT cover_image FROM news WHERE id = :id LIMIT 1");
    $oldStmt->bindParam(':id', $id, PDO::PARAM_INT);
    $oldStmt->execute();
    if ($oldStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Berita tidak ditemukan"]);
        exit();
    }
    $old = $oldStmt->fetch(PDO::FETCH_ASSOC);
    $oldCover = $old['cover_image'] ?? null;

    $title = trim($_POST['title'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $summary = trim($_POST['summary'] ?? '');
    $location = trim($_POST['location'] ?? '');
    $publishedAt = trim($_POST['publishedAt'] ?? '');

    if ($publishedAt !== '') {
        $publishedAt = substr($publishedAt, 0, 10);
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $publishedAt)) $publishedAt = '';
    }

    $contentArr = parseContentFromPost();
    $contentJson = json_encode($contentArr, JSON_UNESCAPED_UNICODE);

    // Upload cover (optional)
    $newCoverUrl = null;
    $uploadDir = "../uploads/news/";
    if (isset($_FILES['coverImage']) && $_FILES['coverImage']['error'] === 0) {
        if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);

        $ext = pathinfo($_FILES['coverImage']['name'], PATHINFO_EXTENSION);
        $safeName = time() . '_' . bin2hex(random_bytes(6)) . ($ext ? ('.' . $ext) : '');
        $target = $uploadDir . $safeName;

        if (!move_uploaded_file($_FILES['coverImage']['tmp_name'], $target)) {
            throw new Exception("Gagal upload cover image");
        }

        $newCoverUrl = 'http://localhost/web-resmi-fpg/server/uploads/news/' . $safeName;

        $oldPath = localPathFromUrl($oldCover);
        if ($oldPath && file_exists($oldPath)) @unlink($oldPath);
    }

    $q = "UPDATE news SET
            title = :title,
            category = :category,
            summary = :summary,
            location = :location,
            published_at = :published_at,
            content_json = :content_json" .
         ($newCoverUrl ? ", cover_image = :cover_image" : "") .
         " WHERE id = :id";

    $stmt = $db->prepare($q);
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->bindValue(':title', $title);
    $stmt->bindValue(':category', $category !== '' ? $category : null);
    $stmt->bindValue(':summary', $summary !== '' ? $summary : null);
    $stmt->bindValue(':location', $location !== '' ? $location : null);
    $stmt->bindValue(':published_at', $publishedAt !== '' ? $publishedAt : null);
    $stmt->bindValue(':content_json', $contentJson);
    if ($newCoverUrl) $stmt->bindValue(':cover_image', $newCoverUrl);

    $stmt->execute();

    http_response_code(200);
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}