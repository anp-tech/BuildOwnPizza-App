<?php
/*********************************************************************
This is the server API for updating a pizza's hasBeenMade attrubute
Params:
1) pizzaID. Value true or false
*********************************************************************/


include_once("getDBConnection.php");


$pizzaID = $_POST['pizzaID'];
$hasBeenMade = $_POST['hasBeenMade'];

function UpdatePizza($pizzaID, $hasBeenMade){
    $query = "UPDATE Pizzas SET hasBeenMade = " . $hasBeenMade;
    $query .= " WHERE pizzaID = " . $pizzaID;

    $con = getDBConnection();
    
    //try to perform the update query and echo the result back to the client.
    if(mysqli_query($con, $query)){
        echo json_encode("success");
    }
    else {
        echo(json_encode("Error: could not run the update query:\n"));
        echo(json_encode($query));
    }
}


UpdatePizza($pizzaID, $hasBeenMade);




?>
