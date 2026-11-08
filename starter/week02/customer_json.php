<?php
header("Content-Type: application/json; charset=UTF-8");
$customers = [
    ["CustomerID" => "C001", "Name" => "สมชาย ใจดี"],
    ["CustomerID" => "C002", "Name" => "สมหญิง รักเรียน"],
];
echo json_encode($customers, JSON_UNESCAPED_UNICODE);
