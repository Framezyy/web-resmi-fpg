<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\admin-verify-otp.php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

date_default_timezone_set('Asia/Jakarta');

include_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $data = json_decode(file_get_contents("php://input"), true);
    $email = trim($data['email'] ?? '');
    $otp = trim($data['otp'] ?? '');

    if (empty($email) || empty($otp)) {
        throw new Exception("Email and OTP are required");
    }

    $currentTime = date('Y-m-d H:i:s');
    
    $query = "SELECT * FROM password_reset_tokens 
              WHERE email = :email 
              AND otp = :otp 
              AND used = 0 
              AND expires_at > :current_time
              ORDER BY created_at DESC 
              LIMIT 1";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':otp', $otp);
    $stmt->bindParam(':current_time', $currentTime);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        $debugQuery = "SELECT otp, used, expires_at, created_at,
                       CASE 
                           WHEN expires_at > :current_time THEN 'VALID'
                           ELSE 'EXPIRED'
                       END as status
                       FROM password_reset_tokens 
                       WHERE email = :email 
                       ORDER BY created_at DESC LIMIT 1";
        $debugStmt = $db->prepare($debugQuery);
        $debugStmt->bindParam(':email', $email);
        $debugStmt->bindParam(':current_time', $currentTime);
        $debugStmt->execute();
        
        if ($debugStmt->rowCount() > 0) {
            $lastOtp = $debugStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($lastOtp['used'] == 1) {
                throw new Exception("OTP has already been used. Please request a new one.");
            }
            
            if ($lastOtp['status'] === 'EXPIRED') {
                throw new Exception("OTP has expired. Please request a new one.");
            }
            
            if ($lastOtp['otp'] !== $otp) {
                throw new Exception("Invalid OTP code. Please check and try again.");
            }
        }
        
        throw new Exception("Invalid or expired OTP");
    }

    $token = $stmt->fetch(PDO::FETCH_ASSOC);

    // Mark OTP as used
    $updateQuery = "UPDATE password_reset_tokens SET used = 1 WHERE id = :id";
    $updateStmt = $db->prepare($updateQuery);
    $updateStmt->bindParam(':id', $token['id']);
    $updateStmt->execute();

    // ← FIX: Perpanjang session token jadi 30 MENIT (1800 detik)
    $sessionToken = bin2hex(random_bytes(32));
    $sessionExpires = date('Y-m-d H:i:s', time() + 1800); // 30 minutes = 1800 seconds

    error_log("Creating session token: " . $sessionToken);
    error_log("Session expires at: " . $sessionExpires);

    $sessionQuery = "INSERT INTO password_reset_tokens
                     (user_id, email, otp, expires_at, used, ip_address, created_at)
                     VALUES
                     (:user_id, :email, :token, :expires_at, 0, :ip_address, NOW())";

    $sessionStmt = $db->prepare($sessionQuery);
    $sessionStmt->bindParam(':user_id', $token['user_id']);
    $sessionStmt->bindParam(':email', $email);
    $sessionStmt->bindParam(':token', $sessionToken);
    $sessionStmt->bindParam(':expires_at', $sessionExpires);
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $sessionStmt->bindParam(':ip_address', $ip_address);
    $sessionStmt->execute();

    error_log("Session token created successfully");

    ob_clean();
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'OTP verified successfully',
        'reset_token' => $sessionToken,
        'user_id' => $token['user_id'],
        'expires_in' => 1800, // 30 minutes
        'expires_at' => $sessionExpires
    ]);
    exit();

} catch (Exception $e) {
    ob_clean();
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
    exit();
}
?>