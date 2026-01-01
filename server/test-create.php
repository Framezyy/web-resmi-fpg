<?php
include_once 'config/database.php';

echo "<h2>Testing Property Create</h2>";

try {
    $database = new Database();
    $db = $database->getConnection();
    
    echo "✅ Database connected: " . $database->db_name . "<br>";
    
    // Check tables
    $tables = ['properties', 'property_galleries', 'admin_users'];
    foreach ($tables as $table) {
        $query = "SHOW TABLES LIKE '$table'";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo "✅ Table exists: $table<br>";
        } else {
            echo "❌ Table missing: $table<br>";
        }
    }
    
    // Check upload folders
    $folders = ['uploads', 'uploads/properties', 'uploads/properties/main', 'uploads/properties/gallery'];
    foreach ($folders as $folder) {
        if (file_exists($folder)) {
            echo "✅ Folder exists: $folder<br>";
        } else {
            echo "❌ Folder missing: $folder<br>";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>