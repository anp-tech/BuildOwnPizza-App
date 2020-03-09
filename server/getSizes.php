<?php
/****************************************************************************
This is the server side API for getting the list of pizza sizes and prices.

First we query the database for the id, size and price of all the pizza sizes.
Then, we echo the data back to the client.

Parameters: There are no POST or GET parameters for this API.
****************************************************************************/

include_once("getDBConnection.php");

//an array of size id, name and price
$pizzaSizeData = GetPizzaSizes();

echo(json_encode($pizzaSizeData));


//querries the database for the complete list of pizza sizes.
//returns an array of 'PizzaSize' objects with id, size and price for that pizza
function GetPizzaSizes(){
  $con = getDBConnection();
  $query = "SELECT sizeID, sizeName, price FROM Sizes;";
  $sizesArray = [];
  if($res = $con->query($query)){
      while($row = $res->fetch_assoc()){
          $sizeData = new PizzaSize($row["sizeID"], $row["sizeName"], $row["price"]);
          array_push($sizesArray, $sizeData);
      }
  }
  return $sizesArray;
}


//A class that represents the data for a pizza size.
class PizzaSize{

    function __construct($id, $name, $price){
        $this->sizeID = $id;
        $this->sizeName = $name;
        $this->price = $price;
    }

    public $sizeID;
    public $sizeName;
    public $price;
}
?>
