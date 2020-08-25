-- SOURCE: INTRODUCTION TO DATABASES (CS_340_401_W2020) - sample_data_manipulation_queries.sql
--       : https://stackoverflow.com/questions/5279079/mysql-convert-timediff-output-to-day-hour-minute-second-format
-- '$' is used to denote the variables 



-- EMPLOYEE PAGE

--   ADD/VIEW/UPDATE/DELETE PIZZA SIZES PAGE
--     add a new pizza size
INSERT INTO Sizes(sizeName, price)
VALUES ('$sizeName', '$price');

--     get all Size IDs, Names, and Prices to list
SELECT sizeID, sizeName, price FROM Sizes;

--     update a size's data based on submission of the Update Sizes Form
UPDATE Sizes SET sizeName = '$sizeName', price = '$price'
WHERE sizeID = '$sizeID';

--	delete a size
DELETE FROM Sizes WHERE sizeID = '$sizeID';


--   ADD/VIEW/UPDATE/DELETE PIZZA TOPPINGS PAGE
--     add a new pizza topping
INSERT INTO Toppings(toppingName, toppingDescription)
VALUES ('$toppingName', '$toppingDescription');

--     get all Topping IDs, Names, and Descriptionps to list
SELECT toppingID, toppingName, toppingDescription FROM Toppings;

--     update a topping's data based on submission of the Update Toppings 
UPDATE Toppings SET toppingName = '$toppingName', toppingDescription = '$toppingDescription'
WHERE toppingID = '$toppingID';

--     delete a topping
DELETE FROM Toppings WHERE toppingID = '$toppingID';



-- CUSTOMER PAGE

--   get all Size Names and Prices to poplulate a dropdown for the Pizza Size with Price
SELECT sizeName, price FROM Sizes;

--   get all Topping Names to populate a dropdown for the Pizza Topping(s) 
SELECT toppingName FROM Toppings;

--   add a new customer name
INSERT INTO Pizzas(sizeID, customerName)
VALUES ((SELECT sizeID FROM Sizes WHERE sizeName = '$sizeName' limit 1), '$customerName');

--   assicoate a pizza with a topping (M-to-M relationship addition)
INSERT INTO PizzaToppings (pizzaID, toppingID, quantity)
VALUES ((SELECT pizzaID FROM Pizzas WHERE customerName = '$customerName' limit 1), (SELECT toppingID from Toppings where toppingName = '$toppingName' limit 1), '$val');



-- EMPLOYEE PAGE

--   VIEW/UPDATE/DELETE CUSTOMER ORDERS PAGE
--     seach filter: for orders to be filtered by timestamp
-- 	 display all pizza orders 
SELECT  p.pizzaID, IFNULL(s.sizeID, 0) AS sizeID, IFNULL(t.toppingID, 0) AS toppingID, IFNULL(pt.quantity, 0) AS quantity, 
CONCAT(TIMESTAMPDIFF(day, p.timeStamp, CURRENT_TIME) , 'd ', MOD( TIMESTAMPDIFF(hour, p.timeStamp, CURRENT_TIME), 24), 'hr ',
MOD( TIMESTAMPDIFF(minute, p.timeStamp, CURRENT_TIME), 60), 'mn ') as timeStamp, p.customerName, s.sizeName, IFNULL(t.toppingName, '') as toppingName, 
p.hasBeenMade FROM Pizzas p LEFT JOIN PizzaToppings pt on pt.pizzaID = p.pizzaID LEFT JOIN Toppings t on t.toppingID = pt.toppingID 
LEFT JOIN Sizes s on s.sizeID = p.sizeID ORDER BY p.pizzaID, t.toppingID;

-- 	 display pizza orders by different hour(s) "1, 2, or 3"
SELECT  p.pizzaID, IFNULL(s.sizeID, 0) AS sizeID, IFNULL(t.toppingID, 0) AS toppingID, IFNULL(pt.quantity, 0) AS quantity, 
CONCAT(TIMESTAMPDIFF(day, p.timeStamp, CURRENT_TIME) , 'd ', MOD( TIMESTAMPDIFF(hour, p.timeStamp, CURRENT_TIME), 24), 'hr ',
MOD( TIMESTAMPDIFF(minute, p.timeStamp, CURRENT_TIME), 60), 'mn ') as timeStamp, p.customerName, s.sizeName, IFNULL(t.toppingName, '') as toppingName, 
p.hasBeenMade FROM Pizzas p LEFT JOIN PizzaToppings pt on pt.pizzaID = p.pizzaID LEFT JOIN Toppings t on t.toppingID = pt.toppingID 
LEFT JOIN Sizes s on s.sizeID = p.sizeID WHERE p.timeStamp >=  NOW() - INTERVAL '$hours$' HOUR ORDER BY p.pizzaID, t.toppingID;

--     delete a pizza order, this also dis-associates a topping from a pizza (M-to-M relationship deletion)
DELETE FROM Pizzas WHERE pizzaID = '$pizzaID';

--     update a pizza's hasBeenMade attribute (by checking a checkbox once the pizza is made)
UPDATE Pizzas SET hasBeenMade = '$hasBeenMade' WHERE pizzaID = '$pizzaID';

