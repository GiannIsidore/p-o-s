<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
$input = file_get_contents('php://input');

error_log("Raw input: " . $input);

if (empty($input)) {
    error_log("No input received");
    echo json_encode(["status" => "error", "message" => "No input received"]);
    exit;
}

$cashierList = [
       ["id" => 1, "username" => "Pitok",  "fullname" => "Batolata Pitok", "password" => '123'],
    ["id" => 2, "username" => "Kulas ", "fullname" => "Kulas Lacoste",  "password" => '321'],
    ["id" => 3, "username" => "Joksan", "fullname" => "Joksan Jambert",  "password" => '111'],
];

$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    error_log("JSON decode error: " . json_last_error_msg());
    echo json_encode(["status" => "error", "message" => "Invalid JSON input: " . json_last_error_msg()]);
    exit;
}

if (!isset($data['username']) || !isset($data['password'])) {
    error_log("Missing username or password");
    echo json_encode(["status" => "error", "message" => "Username and password are required"]);
    exit;
}

$username = $data['username'];
$password = $data['password'];

error_log("Username: " . $username);
error_log("Password: " . $password);

$found = false;
$fullname = "";

foreach ($cashierList as $cahier) {
    if ($cahier['username'] === $username && $cahier['password'] === $password) {
        $found = true;
        $fullname = $cahier['fullname'];
        break;
    }
}

if ($found) {
    echo json_encode(["status" => "success", "message" => "Login successful", "fullname" => $fullname]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid username or password"]);
}
?>