<?php
// Source: https://stackoverflow.com/questions/5279079/mysql-convert-timediff-output-to-day-hour-minute-second-format

include_once("getDBConnection.php");

if(isset($_GET["sF"])){
    $sF = trim($_GET["sF"]);
    if(!empty($_GET["sF"])) {
        $con = getDBConnection();

   //build out the query string
    $q = "SELECT  p.pizzaID, IFNULL(s.sizeID, 0) AS sizeID, IFNULL(t.toppingID, 0) AS toppingID, IFNULL(pt.quantity, 0) AS quantity, ";
    $q .= "CONCAT(TIMESTAMPDIFF(day, p.timeStamp, CURRENT_TIME) , 'd ', MOD( TIMESTAMPDIFF(hour, p.timeStamp, CURRENT_TIME), 24), 'hr ',MOD( TIMESTAMPDIFF(minute, p.timeStamp, CURRENT_TIME), 60), 'mn ') as timeStamp,";
    $q .= "p.customerName, s.sizeName, IFNULL(t.toppingName, '') as toppingName, p.hasBeenMade FROM Pizzas p ";
    $q .= "LEFT JOIN PizzaToppings pt on pt.pizzaID = p.pizzaID ";
    $q .= "LEFT JOIN Toppings t on t.toppingID = pt.toppingID ";
    $q .= "LEFT JOIN Sizes s on s.sizeID = p.sizeID ";

    if($sF != "allOrders"){
     $q .= 'WHERE p.timeStamp >=  NOW() - INTERVAL ' . $sF . ' HOUR  ';
    }
    $q .= " ORDER BY p.pizzaID, t.toppingID ";

    //perform the query
    $pizzasArray = array();
    if($res = $con->query($q)){
        while($row = $res->fetch_assoc()){
            $d = new PizzaData();
            $d->pizzaID = $row['pizzaID'];
            $d->quantity = $row['quantity'];
            $d->timeStamp = $row['timeStamp'];
            $d->customerName = $row['customerName'];
            $d->sizeName = $row['sizeName'];
            $d->toppingName = $row['toppingName'];
            $d->hasBeenMade = $row['hasBeenMade'];
            array_push($pizzasArray, $d);


       }
       echo(json_encode($pizzasArray));
   }

    else{
        echo(json_encode("error"));
    }
  }
}

class PizzaData{

        public $pizzaID;
        public $quantity;
        public $timeStamp;
        public $customerName;
        public $sizeName;
        public $toppingName;
        public $hasBeenMade;
}

?>
