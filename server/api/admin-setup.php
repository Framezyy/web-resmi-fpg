<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\admin-setup.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';

try {
    $data = json_decode(file_get_contents("php://input"));

    // Validate input
    if (!isset($data->username) || !isset($data->email) || !isset($data->password)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Missing required fields (username, email, password)"
        ]);
        exit();
    }

    $username = trim($data->username);
    $email = trim($data->email);
    $password = $data->password;
    $security_question = isset($data->security_question) ? $data->security_question : "What is your favorite color?";
    $security_answer = isset($data->security_answer) ? $data->security_answer : "blue";

    // Validate password length
    if (strlen($password) < 8) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Password must be at least 8 characters"
        ]);
        exit();
    }

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Invalid email format"
        ]);
        exit();
    }

    $database = new Database();
    $db = $database->getConnection();

    if ($db === null) {
        throw new Exception("Database connection failed");
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Check if admin exists
    $check_query = "SELECT id FROM admin_users WHERE username = :username OR email = :email LIMIT 1";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(':username', $username);
    $check_stmt->bindParam(':email', $email);
    $check_stmt->execute();

    if ($check_stmt->rowCount() > 0) {
        // Update existing admin
        $query = "UPDATE admin_users 
                  SET password = :password,
                      email = :email,
                      security_question = :security_question,
                      security_answer = :security_answer
                  WHERE username = :username";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashed_password);
        $stmt->bindParam(':security_question', $security_question);
        $stmt->bindParam(':security_answer', $security_answer);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Admin credentials updated successfully",
                "action" => "updated"
            ]);
        } else {
            throw new Exception("Failed to update admin");
        }
    } else {
        // Create new admin
        $query = "INSERT INTO admin_users (username, email, password, security_question, security_answer, created_at) 
                  VALUES (:username, :email, :password, :security_question, :security_answer, NOW())";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashed_password);
        $stmt->bindParam(':security_question', $security_question);
        $stmt->bindParam(':security_answer', $security_answer);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Admin created successfully",
                "action" => "created"
            ]);
        } else {
            throw new Exception("Failed to create admin");
        }
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>