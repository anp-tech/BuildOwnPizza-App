<?php
/*********************************************************************
This is the server API for deleting a pizza topping. The post params are:
1) toppingID
*********************************************************************/

include_once("getDBConnection.php");


$toppingID = $_POST['toppingID'];



function DeleteTopping($toppingID){

    $query  = "DELETE FROM Toppings WHERE ";
    $query .= "toppingID = " . $toppingID;

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
DeleteTopping($toppingID);

?>
