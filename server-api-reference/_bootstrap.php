<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function api_response($data = null, $success = true, $message = '', $status = 200) {
    http_response_code($status);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function api_error($message, $status = 400) {
    api_response(null, false, $message, $status);
}

$dbFile = __DIR__ . '/../includes/db_connection.php';

if (!file_exists($dbFile)) {
    api_error('db_connection.php file not found', 500);
}

require_once $dbFile;

if (!isset($conn) || !($conn instanceof PDO)) {
    api_error('Database connection is not ready', 500);
}