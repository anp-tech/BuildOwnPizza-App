<?php
/***************************************************************************
This is the API for adding a pizza topping to the database

Parameters: toppingName, toppingDescription.

**************************************************************************/
include_once("getDBConnection.php");


$toppingName = NULL;
$toppingDescription = NULL;

//validate that the toppingName parameter is present
if(isset($_POST["toppingName"])){
    $toppingName = $_POST["toppingName"];
}
else{
    header("HTTP/1.1 500 Internal Server Error");
    return 0;
}

//set the description parameter if present
if(isset($_POST["toppingDescription"])){
    $toppingDescription = $_POST["toppingDescription"];
}

insertTopping($toppingName, $toppingDescription);

function insertTopping($toppingName, $toppingDescription){
    $con = getDBConnection();
    $query = "INSERT INTO Toppings (toppingName, toppingDescription) ";
    $query .= "VALUES(" . "'" . $toppingName . "', '" . $toppingDescription . "');" ;
    echo json_encode($query);
    if($con->query($query) === TRUE){
        header("HTTP/1.1 200 OK");
    }
    header("HTTP/1.1 500 Internal Server Error");
}

?>
