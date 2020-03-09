<?php

include_once("getDBConnection.php");

if ($_POST && isset($_POST['isChecked'])) {
    
    $query  = "UPDATE Pizzas SET hasBeenMade = 1 WHERE pizzaID = '$pizzaID';";    
    $con = getDBConnection();

    if(mysqli_query($con, $query)){
        echo json_encode("success");
    }
    else {
        echo(json_encode("Error: could not run the update query:\n"));
        echo(json_encode($query));
    }
   
}


if ($_POST && isset($_POST['isNotChecked'])) {
        $query  = "UPDATE Pizzas SET hasBeenMade = 0 WHERE pizzaID = '$pizzaID';";
        $con = getDBConnection();
        
        if(mysqli_query($con, $query)){
            echo json_encode("success");
        }
        else {
            echo(json_encode("Error: could not run the update query:\n"));
            echo(json_encode($query));
        }
}

?>



