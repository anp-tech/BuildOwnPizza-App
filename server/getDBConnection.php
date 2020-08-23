<?php
// Source: https://devcenter.heroku.com/articles/jawsdb#using-jawsdb-with-php 

//The function to generate the connection string to the JawsDB
function GetDBConnection() {
    $url = getenv('JAWSDB_URL');
    $dbparts = parse_url($url);

    $servername = $dbparts['host'];
    $username = $dbparts['user'];
    $password = $dbparts['pass'];
    $dbname = ltrim($dbparts['path'],'/');

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}
  
?>