<?php
/*********************************************************************
This is the server API for deleting a pizza size. The post params are:
1) sizeID
*********************************************************************/

include_once("getDBConnection.php");


$sizeID = $_POST['sizeID'];


//queries the db and deletes the Size with the given id from the Sizes table.
function DeleteTopping($sizeID){

    $query  = "DELETE FROM Sizes WHERE ";
    $query .= "sizeID = " . $sizeID;

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
DeleteTopping($sizeID);

?>
