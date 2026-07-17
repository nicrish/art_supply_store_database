USE art_supply_store;

DELIMITER $$

DROP PROCEDURE IF EXISTS sp_load_art_supplies_db;
CREATE PROCEDURE `sp_load_art_supplies_db`()
BEGIN


  
  DECLARE v_productID INT;
  DECLARE v_receiptID INT;

  SET FOREIGN_KEY_CHECKS=0;


  DROP TABLE IF EXISTS `Customers`;


  -- create customers table

  CREATE TABLE `Customers` (
  `customerID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phoneNumber` varchar(45) NOT NULL,
  PRIMARY KEY (`customerID`)
  );
  INSERT INTO `Customers` (firstName, lastName, address, phoneNumber, email) VALUES 
  ('Tim', 'Brown', '123 45th St Seattle, WA 98105','206-555-2911','tim.brown@gmail.com'), 
  ('Stacy', 'Robinson', '223 108th st Seattle, WA 98105','206-955-9011','robinson100@gmail.com'),
  ('John', 'Morgan', '305 Portola Ave Seattle, WA 98105','206-001-1513','morga_mnm@gmail.com');

  DROP TABLE IF EXISTS `Manufacturers`;
  -- create manufacturers table

  CREATE TABLE `Manufacturers` (
  `manufacturerID` int(11) NOT NULL AUTO_INCREMENT,
  `phoneNumber` varchar(45) NOT NULL,
  `address` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`manufacturerID`)
  );
  INSERT INTO Manufacturers (name, phoneNumber, address)VALUES
  ('Leda Art Supply', '317-943-3305', '200 49th St Seattle, WA 98105'),
  ('Tri Dee Arts', ' 360-336-6131', '113 1st st Seattle, WA 98105'),
  ('DANIEL SMITH Artist Materials','206-848-6952', '300 Greenwood Ave Seattle, WA 98105');

  -- create products table
  DROP TABLE IF EXISTS `Products`;
  CREATE TABLE `Products` (
  `productID` int(11) NOT NULL AUTO_INCREMENT,
  `productName` varchar(45) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `sellPrice` decimal(10,2) NOT NULL,
  `newProduct` tinyint(4) NOT NULL,
  `firstDateOrdered` date NOT NULL,
  `manufacturerID` int(11) NOT NULL,
  PRIMARY KEY (`productID`),
  FOREIGN KEY (`manufacturerID`) REFERENCES `Manufacturers`(`manufacturerID`) ON DELETE CASCADE ON UPDATE CASCADE
  );

  INSERT INTO Products(productName, sellPrice, price, manufacturerID, newProduct, firstDateOrdered) VALUES
  ('specialty paint brush XL', 50.25, 40.50, (SELECT manufacturerID FROM Manufacturers WHERE name = 'Leda Art Supply'), 1, '2024-09-12'),
  ('35x35in Canvas', 35.50, 25.50, (SELECT manufacturerID FROM Manufacturers WHERE name = 'Tri Dee Arts'), 0, '2022-12-01'),
  ('Heavy Body Liquitex Acrylic Paint Large', 60.00, 49.50, (SELECT manufacturerID FROM Manufacturers WHERE name = 'Leda Art Supply'), 1, '2024-09-12');

  DROP TABLE IF EXISTS `Orders`;
  -- create orders table

  CREATE TABLE `Orders` (
  `orderID` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `quantity` int(11) NOT NULL,
  `productID` int(11) NOT NULL,
  PRIMARY KEY (`orderID`),
  FOREIGN KEY (`productID`) REFERENCES `Products`(`productID`) ON DELETE CASCADE ON UPDATE CASCADE
  );
  INSERT INTO Orders (date, quantity, productID) VALUES 
  ('2024-08-01', 250, (SELECT productID FROM Products WHERE productName = 'specialty paint brush XL')),
  ('2024-09-12', 100, (SELECT productID FROM Products WHERE productName = '35x35in Canvas')),
  ('2024-10-11', 60, (SELECT productID FROM Products WHERE productName = 'Heavy Body Liquitex Acrylic Paint Large'));

  -- create receipts table
  DROP TABLE IF EXISTS `Receipts`;
  CREATE TABLE `Receipts` (
  `receiptID` int(11) NOT NULL AUTO_INCREMENT,
  `dateTime` datetime NOT NULL,
  `customerID` int(11) NOT NULL,
  PRIMARY KEY (`receiptID`),
  FOREIGN KEY (`customerID`) REFERENCES `Customers`(`customerID`) ON DELETE CASCADE ON UPDATE CASCADE
  );

  INSERT INTO Receipts (dateTime, customerID) VALUES 
  ('2024-10-25 13:23:44', (SELECT customerID FROM Customers WHERE firstName = 'Tim' AND lastName ='Brown')),
  ('2024-10-26 11:12:01', (SELECT customerID FROM Customers WHERE firstName = 'Stacy' AND lastName ='Robinson')),
  ('2024-11-01 14:56:59', (SELECT customerID FROM Customers WHERE firstName = 'John' AND lastName ='Morgan'));


  DROP TABLE IF EXISTS `ProductReceipts`;
  -- create productreceipts table

  CREATE TABLE `ProductReceipts` (
  `productReceiptID` int(11) NOT NULL AUTO_INCREMENT,
  `quantity` int(11) NOT NULL,
  `productID` int(11) NOT NULL,
  `receiptID` int(11) NOT NULL,
  -- PRIMARY KEY (`productReceiptID`),
  -- FOREIGN KEY (`receiptID`) REFERENCES `Receipts`(`receiptID`) ON DELETE CASCADE ON UPDATE CASCADE,
  -- FOREIGN KEY (`productID`) REFERENCES `Products`(`productID`) ON DELETE CASCADE ON UPDATE CASCADE
  PRIMARY KEY (`productReceiptID`),
      
      CONSTRAINT `fk-receiptID`
        FOREIGN KEY (`receiptID`)
        REFERENCES `Receipts` (`receiptID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      CONSTRAINT `fk-productID`
        FOREIGN KEY (`productID`)
        REFERENCES `Products` (`productID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    ) ENGINE = InnoDB;

  
  SELECT productID INTO v_productID FROM Products WHERE productName = 'specialty paint brush XL' LIMIT 1;
  SELECT receiptID INTO v_receiptID FROM Receipts WHERE dateTime = '2024-10-25 13:23:44' LIMIT 1;

  INSERT INTO ProductReceipts (productID, receiptID, quantity)
  VALUES (v_productID, v_receiptID, 2);

  SELECT productID INTO v_productID FROM Products WHERE productName = '35x35in Canvas' LIMIT 1;
  SELECT receiptID INTO v_receiptID FROM Receipts WHERE dateTime = '2024-10-26 11:12:01' LIMIT 1;

  INSERT INTO ProductReceipts (productID, receiptID, quantity)
  VALUES (v_productID, v_receiptID, 3);


  SELECT productID INTO v_productID FROM Products WHERE productName = 'Heavy Body Liquitex Acrylic Paint Large' LIMIT 1;
  SELECT receiptID INTO v_receiptID FROM Receipts WHERE dateTime = '2024-11-01 14:56:59' LIMIT 1;

  INSERT INTO ProductReceipts (productID, receiptID, quantity)
  VALUES (v_productID, v_receiptID, 3);


  SET FOREIGN_KEY_CHECKS=1;
END $$

DELIMITER ;