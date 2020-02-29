<?php
/***************************************************************************
This is the API for adding a pizzas to the database

Parameters: an array of Pizzas.
Each element of the Pizzas array has the form:
Pizza {
    customerName,
    sizeID,
    topping1ID,
    topping2ID,
    topping3ID,
};
**************************************************************************/

include_once("getDBConnection.php");

$data = $_POST["data"];

$con = getDBConnection();

//insert each pizza into the database
foreach($data as $value ){

    //build a hash map from toppingID -> count
    $toppingsArr = array();

    //we will need the auto pizza id for inserting into pizzaToppings
    $pizzaID = '10';

    if( $value["topping1ID"] != "-1")
        array_push($toppingsArr, $value["topping1ID"]);
    if( $value["topping2ID"] != "-1")
        array_push($toppingsArr, $value["topping2ID"]);
    if( $value["topping3ID"] != "-1")
        array_push($toppingsArr, $value["topping3ID"]);

    $toppingsHash = array();

    for($i = 0; $i < count($toppingsArr); $i++){
        if(array_key_exists($toppingsArr[$i], $toppingsHash)){
            $toppingsHash[$toppingsArr[$i]] += 1;
        }
        else{
            $toppingsHash[$toppingsArr[$i]] = 1;
        }
    }

    //insert the pizza with its size and customer name
    $query1 = "INSERT INTO Pizzas (sizeID, customerName) ";
    $query1 .= "VALUES(";
    $query1 .=  "'" . $value["sizeID"] . "',";
    $query1 .= "'" . $value["customerName"] . "'";
    $query1 .= ");";

    if($con->query($query1) === TRUE){
        header("HTTP/1.1 200 OK");
        $pizzaID = $con->insert_id;
    }
    else{
          header("HTTP/1.1 500 Internal Server Error");
    }

    //insert the appropriate values into pizzaToppings.
    foreach($toppingsHash as $key => $val){
        $query2 = "INSERT INTO PizzaToppings (pizzaID, toppingID, quantity)";
        $query2 .= "VAlUES(";
        $query2 .= "'" . $pizzaID .  "',";
        $query2 .= "'" . $key . "',";
        $query2 .= "'" . $val . "'";
        $query2 .= ");";
        if($con->query($query2) === TRUE){
            header("HTTP/1.1 200 OK");
            echo(json_encode($query2));
        }
        else{
              header("HTTP/1.1 500 Internal Server Error");
        }
    }
}


?>
