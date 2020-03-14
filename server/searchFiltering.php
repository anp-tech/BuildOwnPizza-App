<?php
// Source: https://stackoverflow.com/questions/5279079/mysql-convert-timediff-output-to-day-hour-minute-second-format

include_once("getDBConnection.php");

if(isset($_GET["sF"])){
    $sF = trim($_GET["sF"]);
    if(!empty($_GET["sF"])) {
        $con = getDBConnection();
        if($sF == "allOrders") {
            $stmn = $con->prepare("SELECT p.pizzaID, s.sizeID, t.toppingID, CONCAT(TIMESTAMPDIFF(day, p.timeStamp, CURRENT_TIME) , 'd ',
            MOD( TIMESTAMPDIFF(hour, p.timeStamp, CURRENT_TIME), 24), 'hr ',
            MOD( TIMESTAMPDIFF(minute, p.timeStamp, CURRENT_TIME), 60), 'mn ') as timeStamp, p.customerName, s.sizeName, IFNULL(t.toppingName, ''), p.hasBeenMade FROM Pizzas p
            LEFT JOIN PizzaToppings pt on pt.pizzaID = p.pizzaID
            LEFT JOIN Toppings t ON t.toppingID = pt.toppingID
            LEFT JOIN Sizes s on s.sizeID = p.sizeID
            ORDER BY p.pizzaID, t.toppingName;");
        } else if ($sF == "1") {
                $stmn = $con->prepare("SELECT p.pizzaID, s.sizeID, t.toppingID, CONCAT(TIMESTAMPDIFF(day, p.timeStamp, CURRENT_TIME) , 'd ',
                MOD( TIMESTAMPDIFF(hour, p.timeStamp, CURRENT_TIME), 24), 'hr ',
                MOD( TIMESTAMPDIFF(minute, p.timeStamp, CURRENT_TIME), 60), 'mn ') as timeStamp, p.customerName, s.sizeName, IFNULL(t.toppingName, ''), p.hasBeenMade FROM Pizzas p
                LEFT JOIN PizzaToppings pt on pt.pizzaID = p.pizzaID
                LEFT JOIN Toppings t ON t.toppingID = pt.toppingID
                LEFT JOIN Sizes s on s.sizeID = p.sizeID
                WHERE TIMESTAMPDIFF(hour, p.timeStamp, CURRENT_TIME) <= ?
                ORDER BY p.pizzaID, t.toppingName;");
                $stmn->bind_param("i", $sF);      
        } else if ($sF == "2") {
                $stmn = $con->prepare("SELECT p.pizzaID, s.sizeID, t.toppingID, CONCAT(TIMESTAMPDIFF(day, p.timeStamp, CURRENT_TIME) , 'd ',
                MOD( TIMESTAMPDIFF(hour, p.timeStamp, CURRENT_TIME), 24), 'hr ',
                MOD( TIMESTAMPDIFF(minute, p.timeStamp, CURRENT_TIME), 60), 'mn ') as timeStamp, p.customerName, s.sizeName, IFNULL(t.toppingName, ''), p.hasBeenMade FROM Pizzas p
                LEFT JOIN PizzaToppings pt on pt.pizzaID = p.pizzaID
                LEFT JOIN Toppings t ON t.toppingID = pt.toppingID
                LEFT JOIN Sizes s on s.sizeID = p.sizeID
                WHERE TIMESTAMPDIFF(hour, p.timeStamp, CURRENT_TIME) <=? 
                ORDER BY p.pizzaID, t.toppingName;");
                $stmn->bind_param("i", $sF);
        } else{
                $stmn = $con->prepare("SELECT p.pizzaID, s.sizeID, t.toppingID, CONCAT(TIMESTAMPDIFF(day, p.timeStamp, CURRENT_TIME) , 'd ',
                MOD( TIMESTAMPDIFF(hour, p.timeStamp, CURRENT_TIME), 24), 'hr ',
                MOD( TIMESTAMPDIFF(minute, p.timeStamp, CURRENT_TIME), 60), 'mn ') as timeStamp, p.customerName, s.sizeName, IFNULL(t.toppingName, ''), p.hasBeenMade FROM Sizes s
                LEFT JOIN Pizzas p on s.sizeID = p.sizeID
                LEFT JOIN PizzaToppings pt on pt.pizzaID = p.pizzaID
                LEFT JOIN Toppings t ON t.toppingID = pt.toppingID
                WHERE TIMESTAMPDIFF(hour, p.timeStamp, CURRENT_TIME) >=?
                ORDER BY p.pizzaID, t.toppingName;");
                $stmn->bind_param("i", $sF);
        };
        $stmn->execute();
        $stmn->store_result();
        $stmn->bind_result($pizzaID, $sizeID, $toppingID, $timeStamp, $customerName, $sizeName, $toppingName, $hasBeenMade);
        $filterArr = array();
        while($stmn->fetch()) {
            $eachOrderData = array(
                "pizzaID"=> $pizzaID,
                "sizeID" => $sizeID,
                "toppingID" => $toppingID,
                "timeStamp" => $timeStamp,
                "customerName" => $customerName,
                "sizeName" => $sizeName,
                "toppingName" => $toppingName,
                "hasBeenMade" => $hasBeenMade,
            );
            array_push($filterArr, $eachOrderData);
        };
        echo json_encode($filterArr);
        $stmn->close();
        $con->close(); 
    };
};

?>
    

