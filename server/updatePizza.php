<?php
/*********************************************************************
This is the server API for updating a pizza's hasBeenMade attrubute
Params:
1) pizzaID. Value true or false
*********************************************************************/


include_once("getDBConnection.php");


$pizzaID = $_POST['pizzaID'];

echo(json_encode($pizzaID));


?>
