<?php
/*********************************************************************
This is the server API for deleting a pizza order. The post params are:
1) pizzaID
*********************************************************************/

include_once("getDBConnection.php");


$pizzaID = $_POST['pizzaID'];

function DeletePizzaOrder($pizzaID){

    $query  = "DELETE FROM Pizzas WHERE ";
    $query .= "pizzaID = " . $pizzaID;

    //get the db connection string
    $con = getDBConnection();

    //try to perform the delete query and echo the result back to the client.
    if(mysqli_query($con, $query)){
        echo json_encode("success");
    }
    else {
        echo(json_encode("Error: could not run the delete query:\n"));
        echo(json_encode($query));
    }
}

//call this function to start things
DeletePizzaOrder($pizzaID);
?>
