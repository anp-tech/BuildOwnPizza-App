<?php
/*********************************************************************
This is the server API for updating a pizza size. The post params are:
1) sizeID
2) sizeName
2) price
*********************************************************************/

include_once("getDBConnection.php");

//for now make sure there are no weird characters in the post data. More validation later
$sizeID =            $_POST['sizeID'];
$sizeName =         preg_replace("/[^A-Za-z0-9 ]/", '', $_POST['sizeName']);
$price = $_POST['price']; 


function UpdateTopping($sizeID, $sizeName, $price){

    //echo(json_encode($toppingName));
    $query  = "UPDATE Sizes SET ";
    $query .= "sizeName = " . "'" . $sizeName . "',";
    $query .= "price = " . "'" .  $price . "' ";
    $query .= "WHERE sizeID = " . $sizeID;

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
UpdateTopping($sizeID, $sizeName, $price);

?>
