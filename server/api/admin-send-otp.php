<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\admin-send-otp.php

error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Set timezone ke Asia/Jakarta
date_default_timezone_set('Asia/Jakarta');

require '../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

include_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $data = json_decode(file_get_contents("php://input"), true);
    $email = trim($data['email'] ?? '');
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

    if (empty($email)) {
        throw new Exception("Email is required");
    }

    // Check if email exists
    $checkQuery = "SELECT id, username FROM admin_users WHERE email = :email LIMIT 1";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':email', $email);
    $checkStmt->execute();

    if ($checkStmt->rowCount() === 0) {
        throw new Exception("Email not found in our system");
    }

    $user = $checkStmt->fetch(PDO::FETCH_ASSOC);
    $user_id = $user['id'];

    // Rate limiting: Check last request (max 1 request per 2 minutes)
    $rateLimitQuery = "SELECT created_at FROM password_reset_tokens 
                       WHERE email = :email 
                       AND created_at > DATE_SUB(NOW(), INTERVAL 2 MINUTE)
                       ORDER BY created_at DESC LIMIT 1";
    $rateLimitStmt = $db->prepare($rateLimitQuery);
    $rateLimitStmt->bindParam(':email', $email);
    $rateLimitStmt->execute();

    if ($rateLimitStmt->rowCount() > 0) {
        throw new Exception("Please wait 2 minutes before requesting a new OTP");
    }

    // Generate 6-digit OTP
    $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    
    // Set expiry time using CURRENT_TIMESTAMP + INTERVAL
    $expires_at = date('Y-m-d H:i:s', time() + 600); // 10 minutes = 600 seconds

    // Save OTP to database (✅ FIX: sebutkan kolomnya)
    $insertQuery = "INSERT INTO password_reset_tokens
                    (user_id, email, otp, expires_at, used, ip_address, created_at)
                    VALUES
                    (:user_id, :email, :otp, :expires_at, 0, :ip_address, NOW())";

    $insertStmt = $db->prepare($insertQuery);
    $insertStmt->bindParam(':user_id', $user_id);
    $insertStmt->bindParam(':email', $email);
    $insertStmt->bindParam(':otp', $otp);
    $insertStmt->bindParam(':expires_at', $expires_at);
    $insertStmt->bindParam(':ip_address', $ip_address);
    $insertStmt->execute();

    // Send OTP via Email
    $mail = new PHPMailer(true);
    
    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'muhammadichsan2017@gmail.com';
    $mail->Password   = 'ixzrkmcjlovihmdw'; // ← GANTI INI
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // Email settings
    $mail->setFrom('noreply@fachripropertygroup.com', 'FPG Security');
    $mail->addAddress($email);
    $mail->isHTML(true);
    $mail->Subject = '[Action Required] Your Password Reset OTP - Fachri Property Group';

    // Email body
    $mail->Body = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
        <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;'>
            <h1 style='color: white; margin: 0;'>Password Reset Request</h1>
        </div>
        
        <div style='background: #f8f9fa; padding: 30px;'>
            <p style='font-size: 16px; color: #333;'>Hi <strong>{$user['username']}</strong>,</p>
            
            <p style='font-size: 14px; color: #666;'>
                You requested to reset your admin password. Please use this OTP code:
            </p>
            
            <div style='background: white; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;'>
                <p style='font-size: 12px; color: #999; margin: 0 0 10px 0;'>Your OTP Code</p>
                <h2 style='color: #667eea; font-size: 36px; margin: 0; letter-spacing: 5px;'>{$otp}</h2>
                <p style='font-size: 12px; color: #999; margin: 10px 0 0 0;'>Valid for 10 minutes</p>
            </div>
            
            <div style='background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;'>
                <p style='margin: 0; font-size: 13px; color: #856404;'>
                    <strong>⚠️ Security Tips:</strong><br>
                    • Never share this code with anyone<br>
                    • This code expires in 10 minutes<br>
                    • If you didn't request this, please ignore this email
                </p>
            </div>
            
            <p style='font-size: 12px; color: #999; text-align: center; margin-top: 30px;'>
                Best regards,<br>
                <strong>Fachri Property Group Security Team</strong>
            </p>
        </div>
        
        <div style='background: #333; padding: 20px; text-align: center;'>
            <p style='color: #999; font-size: 11px; margin: 0;'>
                © 2026 PT Fachri Property Group. All rights reserved.
            </p>
        </div>
    </div>
    ";

    $mail->send();

    ob_clean();
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'OTP has been sent to your email',
        'debug' => [
            'otp' => $otp, // ← HAPUS INI DI PRODUCTION
            'expires_at' => $expires_at
        ]
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