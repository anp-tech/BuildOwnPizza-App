<?php
// Source: https://stackoverflow.com/questions/5279079/mysql-convert-timediff-output-to-day-hour-minute-second-format

include_once("getDBConnection.php");

if(isset($_GET["filter"])){
    $filter = trim($_GET["filter"]);
    if(!empty($_GET["filter"])) {
        $con = getDBConnection();
        if($filter == "all") {
            $stmn = $con->prepare("SELECT p.pizzaID, s.sizeID, t.toppingID, CONCAT(TIMESTAMPDIFF(day, p.timeStamp, CURRENT_TIME) , 'd ',
            MOD( TIMESTAMPDIFF(hour, p.timeStamp, CURRENT_TIME), 24), 'hr ',
            MOD( TIMESTAMPDIFF(minute, p.timeStamp, CURRENT_TIME), 60), 'mn ') as timeStamp, p.customerName, s.sizeName, t.toppingName, p.hasBeenMade FROM Sizes s
            LEFT JOIN Pizzas p on s.sizeID = p.sizeID
            LEFT JOIN PizzaToppings pt on pt.pizzaID = p.pizzaID
            LEFT JOIN Toppings t ON t.toppingID = pt.toppingID
            ORDER BY p.pizzaID, t.toppingName;");
        } else if ($filter == "1") {
                $stmn = $con->prepare("SELECT p.pizzaID, s.sizeID, t.toppingID, CONCAT(TIMESTAMPDIFF(day, p.timeStamp, CURRENT_TIME) , 'd ',
                MOD( TIMESTAMPDIFF(hour, p.timeStamp, CURRENT_TIME), 24), 'hr ',
                MOD( TIMESTAMPDIFF(minute, p.timeStamp, CURRENT_TIME), 60), 'mn ') as timeStamp, p.customerName, s.sizeName, t.toppingName, p.hasBeenMade FROM Sizes s
                LEFT JOIN Pizzas p on s.sizeID = p.sizeID
                LEFT JOIN PizzaToppings pt on pt.pizzaID = p.pizzaID
                LEFT JOIN Toppings t ON t.toppingID = pt.toppingID
                WHERE TIMESTAMPDIFF(hour, p.timeStamp, CURRENT_TIME) <= ?
                ORDER BY p.pizzaID, t.toppingName;");
                $stmn->bind_param("i", $filter);      
        } else if ($filter == "2") {
                $stmn = $con->prepare("SELECT p.pizzaID, s.sizeID, t.toppingID, CONCAT(TIMESTAMPDIFF(day, p.timeStamp, CURRENT_TIME) , 'd ',
                MOD( TIMESTAMPDIFF(hour, p.timeStamp, CURRENT_TIME), 24), 'hr ',
                MOD( TIMESTAMPDIFF(minute, p.timeStamp, CURRENT_TIME), 60), 'mn ') as timeStamp, p.customerName, s.sizeName, t.toppingName, p.hasBeenMade FROM Sizes s
                LEFT JOIN Pizzas p on s.sizeID = p.sizeID
                LEFT JOIN PizzaToppings pt on pt.pizzaID = p.pizzaID
                LEFT JOIN Toppings t ON t.toppingID = pt.toppingID
                WHERE TIMESTAMPDIFF(hour, p.timeStamp, CURRENT_TIME) <=? 
                ORDER BY p.pizzaID, t.toppingName;");
                $stmn->bind_param("i", $filter);
        } else{
                $stmn = $con->prepare("SELECT p.pizzaID, s.sizeID, t.toppingID, CONCAT(TIMESTAMPDIFF(day, p.timeStamp, CURRENT_TIME) , 'd ',
                MOD( TIMESTAMPDIFF(hour, p.timeStamp, CURRENT_TIME), 24), 'hr ',
                MOD( TIMESTAMPDIFF(minute, p.timeStamp, CURRENT_TIME), 60), 'mn ') as timeStamp, p.customerName, s.sizeName, t.toppingName, p.hasBeenMade FROM Sizes s
                LEFT JOIN Pizzas p on s.sizeID = p.sizeID
                LEFT JOIN PizzaToppings pt on pt.pizzaID = p.pizzaID
                LEFT JOIN Toppings t ON t.toppingID = pt.toppingID
                WHERE TIMESTAMPDIFF(hour, p.timeStamp, CURRENT_TIME) >=?
                ORDER BY p.pizzaID, t.toppingName;");
                $stmn->bind_param("i", $filter);
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
    

