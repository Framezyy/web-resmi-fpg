<?php
// filepath: d:\xampp\htdocs\web-resmi-fpg\server\setup-security.php

include_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

echo "<h2>Setup Security Question for Admin</h2>";

// Update admin dengan username 'admin_fpg'
$username = 'admin_fpg'; // Ganti dengan username admin Anda
$security_question = 'What is your favorite color?';
$security_answer = 'blue'; // Ganti dengan jawaban yang mudah diingat

$query = "UPDATE admin_users 
          SET security_question = :question, 
              security_answer = :answer 
          WHERE username = :username";

$stmt = $db->prepare($query);
$stmt->bindParam(':question', $security_question);
$stmt->bindParam(':answer', $security_answer);
$stmt->bindParam(':username', $username);

if ($stmt->execute()) {
    echo "<p style='color: green;'>✅ Security question updated!</p>";
    echo "<p><strong>Username:</strong> $username</p>";
    echo "<p><strong>Question:</strong> $security_question</p>";
    echo "<p><strong>Answer:</strong> $security_answer</p>";
    echo "<p><a href='http://localhost:3000/admin/forgot-password'>Test Forgot Password</a></p>";
} else {
    echo "<p style='color: red;'>❌ Failed to update</p>";
}
?>