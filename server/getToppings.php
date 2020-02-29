<?php
/****************************************************************************
This is the server side API for getting the list of Pizza Toppings.

First we query the database for the name and description of all the pizza toppings.
Then, we echo the data back to the client.

Parameters: There are no POST or GET parameters for this API.
****************************************************************************/

include_once("getDBConnection.php");

//query the topping data
$toppingData = GetToppingData();

//echo the topping data to the client that made the Ajax request
echo(json_encode($toppingData));



/***************************Function definitions**************************/

//function to query the list of topping names and descriptions.
function GetToppingData(){
   $con = getDBConnection();
   $query = "SELECT toppingID, toppingName, toppingDescription FROM Toppings;";

   $toppingsArray = [];
   if($res = $con->query($query)){
       while($row = $res->fetch_assoc()){
           $toppingData = new ToppingData($row["toppingID"], $row["toppingName"], $row["toppingDescription"]);
           array_push($toppingsArray, $toppingData);
       }
   }
   return $toppingsArray;
}


//Class to hold a toppingName and toppingDescription
class ToppingData{

     function __construct($id, $name, $description){
        $this->toppingID = $id;
        $this->toppingName = $name;
        $this->toppingDescription = $description;
    }

    public $toppingName;
    public $toppingDescription;
    public $toppingID;
}

?>
