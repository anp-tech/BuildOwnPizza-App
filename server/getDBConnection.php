<?php

//The function to generate the connection string to the CS340 database
 function GetDBConnection(){
     $servername = "classmysql.engr.oregonstate.edu";
     $username = "cs340_hoglundb";
     $password = "6406";
     $dbname = "cs340_hoglundb";
     // Create connection
     $conn = new mysqli($servername, $username, $password, $dbname);
     // Check connection
     if ($conn->connect_error) {
         die("Connection failed: " . $conn->connect_error);
     }
     return $conn;
  }

?>
