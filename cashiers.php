<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Define the list of cashiers without passwords for security reasons
$cashierList = [
    ["id" => 1, "username" => "Pitok",  "fl_name" => "Batolata", "c_password" => '123'],
    ["id" => 2, "username" => "Kulas", "fl_name" => "Kulas Lacoste",  "c_password" => '321'],
    ["id" => 3, "username" => "Joksan", "fl_name" => "Joksan Jambert",  "c_password" => '111'],
];

echo json_encode($cashierList);
?>