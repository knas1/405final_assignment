<?php
// Database configuration
require_once 'config/database.php';

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Check if it's an OPTIONS request and exit
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Function to handle CRUD operations
function handleRequest($method, $data = null)
{
    global $conn;

    switch ($method) {
        case 'GET':
            // Fetch bookmarks for the specific user
            $result = [];
            $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

            if ($user_id) {
                $query = "SELECT * FROM Bookmark WHERE user_id = $user_id";
                $result_set = $conn->query($query);

                while ($row = $result_set->fetch_assoc()) {
                    $result[] = $row;
                }
            }

            echo json_encode($result);
            break;


        case 'POST':
            // Create a new bookmark
            $url = $data['url'];
            $title = $data['title'];
            $user_id = $data['user_id'];
            $stmt = $conn->prepare("INSERT INTO Bookmark (URL, title, user_id) VALUES (?, ?, ?)");
            $stmt->bind_param("ssi", $url, $title, $user_id);
            $stmt->execute();
            echo json_encode(['message' => 'Bookmark added successfully']);
            break;



        case 'PUT':
            // Update an existing bookmark
            $data = json_decode(file_get_contents("php://input"), true);
            error_log(print_r($data, true)); // Add this line

            if (isset($data['id'])) {
                $id = $data['id'];
                $url = $data['url'];
                $title = $data['title'];
                $stmt = $conn->prepare("UPDATE Bookmark SET URL = ?, title = ? WHERE id = ?");
                $stmt->bind_param("ssi", $url, $title, $id);
                $stmt->execute();
                echo json_encode(['message' => 'Bookmark updated successfully']);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid request']);
            }
            break;



        case 'DELETE':
            // Delete a bookmark
            $data = json_decode(file_get_contents('php://input'), true);

            if (isset($data['id'])) {
                $id = $data['id'];

                $stmt = $conn->prepare("DELETE FROM Bookmark WHERE id = ?");
                $stmt->bind_param("i", $id);

                if ($stmt->execute()) {
                    echo json_encode(['message' => 'Bookmark deleted successfully']);
                } else {
                    http_response_code(500); // Internal Server Error
                    echo json_encode(['error' => 'Failed to delete bookmark']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid request']);
            }
            break;


        case 'OPTIONS':
            //I needed to put option to avoid problems
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid request']);
            break;
    }
}

// Check request method
$method = $_SERVER['REQUEST_METHOD'];

// Get data from request body
$data = json_decode(file_get_contents('php://input'), true);

// Handle the request
handleRequest($method, $data);
?>