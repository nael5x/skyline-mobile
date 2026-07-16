<?php
require_once __DIR__ . '/_bootstrap.php';

try {
    $stmt = $conn->query("SELECT 1 AS ok");
    $result = $stmt->fetch();

    api_response([
        'database' => !empty($result['ok']) ? 'connected' : 'unknown',
        'time' => date('c'),
        'api' => 'Skyline Mobile API',
        'version' => 'manual-step-1'
    ]);
} catch (Throwable $e) {
    api_error('Database test failed', 500);
}