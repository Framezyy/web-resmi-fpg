<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\recaps-list.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $query = "SELECT * FROM company_recaps ORDER BY display_order ASC, company_id ASC";
    $stmt = $db->prepare($query);
    $stmt->execute();

    $recaps = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $recaps[] = [
            'id' => (int)$row['id'],
            'company_id' => $row['company_id'],
            'company_name' => $row['company_name'],
            'display_order' => (int)$row['display_order'],
            'total_komplek' => (int)$row['total_komplek'],
            'total_rumah' => (int)$row['total_rumah'],
            'total_terjual' => (int)$row['total_terjual']
        ];
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $recaps
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>