<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\api\admin-reset-password.php

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_log("=== ADMIN RESET PASSWORD START ===");

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

date_default_timezone_set('Asia/Jakarta');

require '../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

include_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $input = file_get_contents("php://input");
    error_log("Raw input: " . $input);
    
    $data = json_decode($input, true);

    $reset_token = trim(strval($data['reset_token'] ?? ''));
    $new_password = trim($data['new_password'] ?? '');
    $confirm_password = trim($data['confirm_password'] ?? '');

    // ✅ FIX: pakai waktu PHP (Asia/Jakarta) untuk validasi expiry, jangan NOW()
    $currentTime = date('Y-m-d H:i:s');

    error_log("Reset token received (trimmed): '" . $reset_token . "'");
    error_log("Token length: " . strlen($reset_token));
    error_log("Password length: " . strlen($new_password));

    if (empty($reset_token) || empty($new_password) || empty($confirm_password)) {
        throw new Exception("All fields are required");
    }

    if ($new_password !== $confirm_password) {
        throw new Exception("Passwords do not match");
    }

    if (strlen($new_password) < 8) {
        throw new Exception("Password must be at least 8 characters");
    }

    // ← FIX: Query dengan TRIM di database juga
    $query = "SELECT 
                id, user_id, email, otp, expires_at, used,
                TIMESTAMPDIFF(SECOND, :current_time, expires_at) as seconds_left
              FROM password_reset_tokens 
              WHERE TRIM(otp) = :token 
              AND used = 0 
              AND expires_at > :current_time
              ORDER BY created_at DESC 
              LIMIT 1";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':token', $reset_token);
    $stmt->bindParam(':current_time', $currentTime);
    $stmt->execute();

    error_log("Query executed. Rows found: " . $stmt->rowCount());

    if ($stmt->rowCount() === 0) {
        // ← FIX: Debug lebih detail
        $debugQuery = "SELECT id, otp, used, expires_at, 
                       TIMESTAMPDIFF(SECOND, NOW(), expires_at) as seconds_left,
                       LENGTH(otp) as otp_length,
                       HEX(otp) as otp_hex
                       FROM password_reset_tokens 
                       WHERE user_id = (SELECT id FROM admin_users ORDER BY id LIMIT 1)
                       ORDER BY created_at DESC LIMIT 3";
        $debugStmt = $db->prepare($debugQuery);
        $debugStmt->execute();
        
        $debugResults = $debugStmt->fetchAll(PDO::FETCH_ASSOC);
        error_log("Debug tokens in DB: " . json_encode($debugResults));
        error_log("Received token hex: " . bin2hex($reset_token));
        
        throw new Exception("Invalid or expired reset session. Please request a new OTP. (Token: '{$reset_token}')");
    }

    $session = $stmt->fetch(PDO::FETCH_ASSOC);
    error_log("Session found: " . json_encode($session));

    if ($session['seconds_left'] < 0) {
        throw new Exception("Session has expired (" . abs($session['seconds_left']) . " seconds ago). Please start over.");
    }

    $user_id = $session['user_id'];
    $email = $session['email'];

    error_log("User ID: " . $user_id . ", Email: " . $email);

    // Hash new password
    $hashed_password = password_hash($new_password, PASSWORD_BCRYPT);
    error_log("Password hashed successfully");

    // Update password
    $updateQuery = "UPDATE admin_users SET password = :password WHERE id = :user_id";
    $updateStmt = $db->prepare($updateQuery);
    $updateStmt->bindParam(':password', $hashed_password);
    $updateStmt->bindParam(':user_id', $user_id);
    
    if (!$updateStmt->execute()) {
        throw new Exception("Failed to update password in database");
    }
    
    error_log("Password updated successfully for user ID: " . $user_id);

    // Mark session token as used
    $markUsedQuery = "UPDATE password_reset_tokens SET used = 1 WHERE id = :id";
    $markUsedStmt = $db->prepare($markUsedQuery);
    $markUsedStmt->bindParam(':id', $session['id']);
    $markUsedStmt->execute();
    
    error_log("Token marked as used");

    // Delete old unused tokens
    $deleteQuery = "DELETE FROM password_reset_tokens WHERE user_id = :user_id AND id != :id";
    $deleteStmt = $db->prepare($deleteQuery);
    $deleteStmt->bindParam(':user_id', $user_id);
    $deleteStmt->bindParam(':id', $session['id']);
    $deleteStmt->execute();
    
    error_log("Old tokens deleted");

    // Send confirmation email (optional, don't fail if email fails)
    try {
        $mail = new PHPMailer(true);
        
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'muhammadichsan2017@gmail.com';
        $mail->Password   = 'ixzrkmcjlovihmdw';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        $mail->setFrom('noreply@fachripropertygroup.com', 'FPG Security');
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = '[Security Alert] Your Password Was Changed';

        $reset_time = date('F j, Y \a\t H:i');
        $ip_address = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

        $mail->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
            <div style='background: #28a745; padding: 30px; text-align: center;'>
                <h1 style='color: white; margin: 0;'>✅ Password Changed Successfully</h1>
            </div>
            
            <div style='background: #f8f9fa; padding: 30px;'>
                <p style='font-size: 16px; color: #333;'>Hi Admin,</p>
                
                <p style='font-size: 14px; color: #666;'>
                    Your admin password was successfully changed on <strong>{$reset_time}</strong>.
                </p>
                
                <div style='background: white; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;'>
                    <p style='margin: 0; font-size: 13px; color: #333;'>
                        <strong>Reset Details:</strong><br>
                        • Time: {$reset_time}<br>
                        • IP Address: {$ip_address}<br>
                    </p>
                </div>
                
                <p style='font-size: 12px; color: #999; text-align: center; margin-top: 30px;'>
                    Best regards,<br>
                    <strong>Fachri Property Group Security Team</strong>
                </p>
            </div>
        </div>
        ";

        $mail->send();
        error_log("Confirmation email sent to: " . $email);
    } catch (Exception $mailError) {
        error_log("Failed to send confirmation email: " . $mailError->getMessage());
    }

    ob_clean();
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Password has been reset successfully! You can now login with your new password.'
    ]);
    exit();

} catch (Exception $e) {
    error_log("ERROR: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    
    ob_clean();
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
    exit();
}
?>