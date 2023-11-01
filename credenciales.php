<?php

$server = "localhost";

$username = "root";

$password = "";

$database = "midcenturywareho_psdb2";

$conn = new mysqli($server, $username, $password, $database);

if ($conn->connect_errno) {
    die("Conexion fallida: " . $conn->connect_error);
} 

//echo ("se conecto a la db");