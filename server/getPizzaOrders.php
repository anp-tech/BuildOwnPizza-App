<?php
// Source: https://stackoverflow.com/questions/5279079/mysql-convert-timediff-output-to-day-hour-minute-second-format



include_once("getDBConnection.php");

//an array of size id, name and price
$pizzaOrdersData = GetPizzaOrders();

echo(json_encode($pizzaOrdersData));

//querries the database for the complete list of pizza sizes.
//returns an array of 'PizzaSize' objects with id, size and price for that pizza
function GetPizzaOrders() {
  $con = getDBConnection();
  $pizzaOrdersArray = array();

  $query = "SELECT p.pizzaID, p.sizeID, pt.toppingID, CONCAT(TIMESTAMPDIFF(day, p.timeStamp, CURRENT_TIME) , 'd ',
            MOD( TIMESTAMPDIFF(hour, p.timeStamp, CURRENT_TIME), 24), 'hr ',
            MOD( TIMESTAMPDIFF(minute, p.timeStamp, CURRENT_TIME), 60), 'mn ') as timeStamp, p.customerName, sizeName, toppingName, p.hasBeenMade FROM Sizes s 
            LEFT JOIN Pizzas p on s.sizeID = p.sizeID 
            LEFT JOIN PizzaToppings pt on pt.pizzaID = p.pizzaID 
            LEFT JOIN Toppings t ON t.toppingID = pt.toppingID 
            ORDER BY p.pizzaID, t.toppingName;";
  
  if($res = $con->query($query)) {
      while($row = $res->fetch_assoc()) {
         $pizzaOrdersData = new Pizza($row["pizzaID"], $row["sizeID"], $row["toppingID"], $row["timeStamp"], $row["customerName"], $row["sizeName"], $row["toppingName"], $row["hasBeenMade"]);
         array_push($pizzaOrdersArray, $pizzaOrdersData);
        }
  }
  return $pizzaOrdersArray;
}


//A class that represents the data for a pizza size.
class Pizza {
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
