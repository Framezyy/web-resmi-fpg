<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
http_response_code(410);
echo json_encode([
    'success' => false,
    'message' => 'Endpoint ini sudah digantikan oleh contact-send.php.',
]);
