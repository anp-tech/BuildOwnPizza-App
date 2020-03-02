<?php
/***************************************************************************
This is the API for adding a pizza size to the database

Parameters: sizeName, price.

**************************************************************************/
include_once("getDBConnection.php");


$sizeName = NULL;
$price = NULL;

//validate that the sizeName parameter is present
if(isset($_POST["sizeName"])){
    $sizeName = $_POST["sizeName"];
}
else{
    header("HTTP/1.1 500 Internal Server Error");
    return 0;
}

//set the price parameter if present
if(isset($_POST["price"])){
    $price = $_POST["price"];
}

insertSizes($sizeName, $price);

function insertSizes($sizeName, $price){
    $con = getDBConnection();
    $query = "INSERT INTO Sizes (sizeName, price) ";
    $query .= "VALUES(" . "'" . $sizeName . "', '" . $price . "');" ;
    echo json_encode($query);
    if($con->query($query) === TRUE){
        header("HTTP/1.1 200 OK");
    }
    header("HTTP/1.1 500 Internal Server Error");
}

?>
