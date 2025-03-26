<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Simple error logging
$logFile = __DIR__ . '/auth_errors.log';
function logMessage($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message" . PHP_EOL, FILE_APPEND);
}

logMessage('Authentication attempt started');

// Get raw POST data
$postData = file_get_contents('php://input');
logMessage("Raw POST data: $postData");

// Get and decode the JSON data
$data = json_decode($postData, true);

if (!$data || !isset($data['username']) || !isset($data['password'])) {
    logMessage('Invalid request format');
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$username = $data['username'];
$password = $data['password'];
logMessage("Login attempt for username: $username");

// Get path to users.json
$usersFilePath = __DIR__ . '/users.json';
logMessage("Reading user file from: $usersFilePath");

// Check if file exists
if (!file_exists($usersFilePath)) {
    logMessage("User file not found at: $usersFilePath");
    echo json_encode(['success' => false, 'message' => 'User database not found']);
    exit;
}

// Read the file
$usersJson = file_get_contents($usersFilePath);
if ($usersJson === false) {
    logMessage("Failed to read user file content");
    echo json_encode(['success' => false, 'message' => 'Failed to read user database']);
    exit;
}

// Parse JSON
$users = json_decode($usersJson, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    logMessage("JSON parsing error: " . json_last_error_msg());
    echo json_encode(['success' => false, 'message' => 'Invalid user database format']);
    exit;
}

// Check for users array
if (!isset($users['users']) || !is_array($users['users'])) {
    logMessage("User data structure is invalid");
    echo json_encode(['success' => false, 'message' => 'Invalid user database structure']);
    exit;
}

// Find user and verify password
$authenticated = false;
foreach ($users['users'] as $user) {
    if ($user['username'] === $username && $user['password'] === $password) {
        $authenticated = true;
        logMessage("Authentication successful for user: $username");
        break;
    }
}

if (!$authenticated) {
    logMessage("Authentication failed for username: $username");
}

// Return authentication result
echo json_encode([
    'success' => $authenticated
]);
?>
