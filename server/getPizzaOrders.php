<?php

include_once("getDBConnection.php");

//an array of size id, name and price
$pizzaOrdersData = GetPizzaOrders();

echo(json_encode($pizzaOrdersData));


//querries the database for the complete list of pizza sizes.
//returns an array of 'PizzaSize' objects with id, size and price for that pizza
function GetPizzaOrders() {
  $con = getDBConnection();
  $pizzaOrdersArray = array();

  $query = "SELECT p.pizzaID, p.sizeID, IFNULL(pt.toppingID, 0) as toppingID, p.timeStamp, p.customerName, sizeName, IFNULL(toppingName, 'pizza with no toppings') AS toppingName, p.hasBeenMade FROM Sizes s LEFT JOIN Pizzas p on s.sizeID = p.sizeID LEFT JOIN PizzaToppings pt on pt.pizzaID = p.pizzaID LEFT JOIN Toppings t ON t.toppingID = pt.toppingID ORDER BY p.pizzaID, t.toppingName;";
  
  if($res = $con->query($query)) {
      while($row = $res->fetch_assoc()) {
          $pizzaOrdersData = new PizzaSize($row["p.pizzaID"], $row["p.sizeID"], $row["pt.toppingID"], $row["p.timeStamp"], $row["p.customerName"], $row["sizeName"],$row["toppingName"], $row["p.hasBeenMade"]);
          array_push($pizzaOrdersArray, $pizzaOrdersData);
      }
  }
  return $pizzaOrdersArray;
}


//A class that represents the data for a pizza size.
class Pizza{
    function __construct($pid, $sid, $tid, $timeStamp, $customerName, $sizeName, $toppingName, $hasBeenMade) {
        $this->pizzaID = $pid;
        $this->sizeID = $sid;
        $this->toppingID = $tid;
        $this->timeStamp = $timeStamp;
        $this->customerName = $customerName;
        $this->sizeName = $sizeName;
        $this->toppingName = $toppingName;
        $this->hasBeenMade = $hasBeenMade;
    }
    public $pizzaID;
    public $sizeID;
    public $toppingID;
    public $timeStamp;
    public $customerName;
    public $sizeName;
    public $toppingName;
    public $hasBeenMade;
}

?>
