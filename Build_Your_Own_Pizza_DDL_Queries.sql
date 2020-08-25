-- delete previous tables--
DROP TABLE IF EXISTS PizzaToppings;
DROP TABLE IF EXISTS Pizzas;
DROP TABLE IF EXISTS Toppings;
DROP TABLE IF EXISTS Sizes;


-- Create the tables --
CREATE TABLE Toppings(
  toppingID int AUTO_INCREMENT PRIMARY KEY NOT NULL,
  toppingName varchar(255) NOT NULL,
  toppingDescription varchar(512)
);

CREATE TABLE Sizes(
   sizeID INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
   sizeName VARCHAR(255) NOT NULL,
   price DECIMAL(5,2) NOT NULL
);

CREATE TABLE Pizzas(
   pizzaID INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
   sizeID INT NOT NULL,
   customerName VARCHAR(512) NOT NULL,
   timeStamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   hasBeenMade BOOLEAN NOT NULL DEFAULT FALSE,
   FOREIGN KEY (sizeID) REFERENCES Sizes(sizeID)
   ON DELETE CASCADE
);

CREATE TABLE PizzaToppings(
  pizzaID INT NOT NULL,
  toppingID INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (pizzaID) REFERENCES Pizzas(pizzaID) ON DELETE CASCADE,
  FOREIGN KEY (toppingID) REFERENCES Toppings(toppingID) ON DELETE CASCADE,
  CONSTRAINT PK_PizzaToppings PRIMARY KEY (pizzaID, toppingID)
);


-- insert the default data --
INSERT INTO Toppings(`toppingName`, `toppingDescription`)
VALUES
   ('pepperoni', 'Our authentic Italian deliciousness'),
   ('chicken', 'Our farm fresh chicken (actually its been frozen for 2 years)'),
   ('bacon', 'We are not responsible if you have a heart attack. Its worth the risk though'),
   ('anchovies', 'anchovies will make your breath smell like a sewer for a week'),
   ('pinapple', 'sweet and savory');


INSERT INTO Sizes(`sizeName`, `price`)
VALUES 
  ('small', 8.00),
  ('medium', 10.00),
  ('large', 12.00);
  

INSERT INTO Pizzas(`sizeID`, `customerName`, `timeStamp`)
VALUES
  (
      (SELECT sizeID FROM Sizes where sizeName = 'small'), 
      'John Smith',
       (NOW() + INTERVAL 1 MINUTE)
  ),
  (
      (SELECT sizeID FROM Sizes where sizeName = 'small'), 
      'Sally Smith',
       (NOW() + INTERVAL 2 MINUTE)
  ),
  (
      (SELECT sizeID FROM Sizes where sizeName = 'medium'), 
      'Steve Smith',
        (NOW() + INTERVAL 3 MINUTE)
  ),
  (
      (SELECT sizeID FROM Sizes where sizeName = 'large'),
      'Bobby Smith',
        (NOW() + INTERVAL 4 MINUTE)
  ),
  (
      (SELECT sizeID FROM Sizes where sizeName = 'large'),
      'Amy Smith',
         (NOW() + INTERVAL 5 MINUTE)
  ),
  (
      (SELECT sizeID FROM Sizes where sizeName = 'medium'),
      'Amy Smith',
       (NOW() + INTERVAL 5 MINUTE)
  );


-- pizza toppings for John Smiths pizza: 2 pepperoni and 1 chicken --
INSERT INTO PizzaToppings(`pizzaID`, `toppingID`, `quantity`)
VALUES
   (
     (SELECT pizzaID FROM Pizzas WHERE customerName = 'John Smith'),
     (SELECT toppingID from Toppings where toppingName = 'pepperoni'),
     2
   ),
   (
     (SELECT pizzaID FROM Pizzas WHERE customerName = 'John Smith'),
     (SELECT toppingID from Toppings where toppingName = 'chicken'),
     1
   );
   
 
-- pizza toppings for Sally Smiths pizza: 1 bacon and 1 chicken --
INSERT INTO PizzaToppings(`pizzaID`, `toppingID`, `quantity`)
VALUES
   (
     (SELECT pizzaID FROM Pizzas WHERE customerName = 'Sally Smith'),
     (SELECT toppingID from Toppings where toppingName = 'bacon'),
     1
   ),
   (
     (SELECT pizzaID FROM Pizzas WHERE customerName = 'Sally Smith'),
     (SELECT toppingID from Toppings where toppingName = 'chicken'),
     1
   );
   

 
-- pizza toppings for Steve Smiths pizza: 1 bacon, 1 anchovies and 1 chicken --
INSERT INTO PizzaToppings(`pizzaID`, `toppingID`, `quantity`)
VALUES
   (
     (SELECT pizzaID FROM Pizzas WHERE customerName = 'Steve Smith'),
     (SELECT toppingID from Toppings where toppingName = 'bacon'),
     1
   ),
   (
     (SELECT pizzaID FROM Pizzas WHERE customerName = 'Steve Smith'),
     (SELECT toppingID from Toppings where toppingName = 'anchovies'),
     1
   ),
   (
     (SELECT pizzaID FROM Pizzas WHERE customerName = 'Steve Smith'),
     (SELECT toppingID from Toppings where toppingName = 'chicken'),
     1
   );


-- pizza toppings for Bobby Smith's pizza: 1 anchovies --
INSERT INTO PizzaToppings(`pizzaID`, `toppingID`, `quantity`)
VALUES
   (
     (SELECT pizzaID FROM Pizzas WHERE customerName = 'Bobby Smith'),
     (SELECT toppingID from Toppings where toppingName = 'anchovies'),
     1
   );


-- pizza toppings for Amy's large pizza: 1 chicken and 1 pinapple --
INSERT INTO PizzaToppings(`pizzaID`, `toppingID`, `quantity`)
VALUES
   (
     (SELECT pizzaID FROM Pizzas WHERE customerName = 'Amy Smith' AND sizeID = (SELECT sizeID FROM Sizes WHERE sizeName='large')),
     (SELECT toppingID from Toppings where toppingName = 'pinapple'),
     1
   ),
   (
     (SELECT pizzaID FROM Pizzas WHERE customerName = 'Amy Smith' AND sizeID = (SELECT sizeID FROM Sizes WHERE sizeName='large')),
     (SELECT toppingID from Toppings where toppingName = 'chicken'),
     1
   );


-- pizza toppings for Amy's medium pizza: 1 chicken, 2 bacon --
INSERT INTO PizzaToppings(`pizzaID`, `toppingID`, `quantity`)
VALUES
   (
     (SELECT pizzaID FROM Pizzas WHERE customerName = 'Amy Smith' AND sizeID = (SELECT sizeID FROM Sizes WHERE sizeName='medium')),
     (SELECT toppingID from Toppings where toppingName = 'bacon'),
      2
   ),
   (
     (SELECT pizzaID FROM Pizzas WHERE customerName = 'Amy Smith' AND sizeID = (SELECT sizeID FROM Sizes WHERE sizeName='medium')),
     (SELECT toppingID from Toppings where toppingName = 'chicken'),
     1
   );

