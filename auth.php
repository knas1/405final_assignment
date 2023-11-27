<?php
require_once 'config/database.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    global $conn;

    $data = json_decode(file_get_contents('php://input'), true);

    $username = $data['username'];
    $password = $data['password'];

    // Check if the user exists for login
    $loginQuery = "SELECT id, password FROM users WHERE username = ?";
    $stmt = $conn->prepare($loginQuery);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // User exists, check password
        $stmt->bind_result($userId, $hashedPassword);
        $stmt->fetch();

        if (password_verify($password, $hashedPassword)) {
            // Password is correct, user is authenticated
            $token = bin2hex(random_bytes(32));
            echo json_encode(['success' => true, 'userId' => $userId, 'token' => $token]);
        } else {
            // Incorrect password
            echo json_encode(['error' => 'Invalid credentials']);
        }
    } else {
        // User does not exist, perform signup
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $signupQuery = "INSERT INTO users (username, password) VALUES (?, ?)";
        $stmt = $conn->prepare($signupQuery);
        $stmt->bind_param("ss", $username, $hashedPassword);

        if ($stmt->execute()) {
            // Signup successful
            $userId = $conn->insert_id;
            $token = bin2hex(random_bytes(32));
            echo json_encode(['success' => true, 'userId' => $userId, 'token' => $token]);
        } else {
            // Signup failed
            echo json_encode(['error' => 'Signup failed']);
        }
    }

    // Close database connection
    $stmt->close();
    $conn->close();
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request']);
}
?>