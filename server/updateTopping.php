<?php
/*********************************************************************
This is the server API for updating a pizza topping. The post params are:
1) toppingID
2) toppingName
2) toppingDescription
*********************************************************************/

include_once("getDBConnection.php");

//Note: still need to add more server side validation
//for now make sure there are no weird characters in the post data
$toppingID =            $_POST['toppingID'];
$toppingName =         preg_replace("/[^A-Za-z0-9 ]/", '', $_POST['toppingName']);
$toppingDescription =  preg_replace("/[^A-Za-z0-9 ]/", '', $_POST['toppingDescription']);


function UpdateTopping($toppingID, $toppingName, $toppingDescription){

    //echo(json_encode($toppingName));
    $query  = "UPDATE Toppings SET ";
    $query .= "toppingName = " . "'" . $toppingName . "',";
    $query .= "toppingDescription = " . "'" .  $toppingDescription . "' ";
    $query .= "WHERE toppingID = " . $toppingID;

    //get the db connection string
    $con = getDBConnection();
    //try to perform the update query and echo the result back to the client.
    //use the mysqli to avoid an injection attack.
    if(mysqli_query($con, $query)){
        echo json_encode("success");
    }
    else {
        echo(json_encode("Error: could not run the update query:\n"));
        echo(json_encode($query));
    }
}

//call this function to start things
UpdateTopping($toppingID, $toppingName, $toppingDescription);

?>
