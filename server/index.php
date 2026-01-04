<?php
header("Content-Type: application/json");

require_once 'config/database.php';
require __DIR__ . '/vendor/autoload.php';

// Simple routing
$request_uri = $_SERVER['REQUEST_URI'];

switch ($request_uri) {
    case '/api/properties':
        require_once 'api/properties.php';
        break;
    case '/api/contact':
        require_once 'api/contact.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(["message" => "Endpoint not found"]);
        break;
}
?>