DROP PROCEDURE IF EXISTS sp_CreateProduct;
DELIMITER $$
CREATE  PROCEDURE `sp_CreateProduct`(
    IN productName VARCHAR(45), 
    IN price decimal(10,2), 
    IN sellPrice decimal(10,2), 
    IN newProduct tinyint(4),
    IN firstDateOrdered date,
    IN manufacturerName VARCHAR(255),
    OUT productID INT(11))
BEGIN
-- Citation for the following function: sp_CreateProduct
-- Date: 08/14/2025
-- Adapted from : canvas starter code
-- Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25664628
     

    DECLARE mID INT;
    SELECT manufacturerID INTO mID
    FROM Manufacturers
    WHERE name = manufacturerName
    LIMIT 1;
    INSERT INTO Products (productName, price, sellPrice, newProduct, firstDateOrdered, manufacturerID)
    VALUES (productName, price, sellPrice, newProduct, firstDateOrdered, mID);
    -- Store the ID of the last inserted row
    SELECT LAST_INSERT_ID() into productID;
    -- Display the ID of the last inserted person.
    SELECT LAST_INSERT_ID() AS 'new_id';
    -- Example of how to get the ID of the newly created person:
        -- CALL sp_CreatePerson('Theresa', 'Evans', 2, 48, @new_id);
        -- SELECT @new_id AS 'New Person ID';
END $$

DELIMITER ;
DROP PROCEDURE IF EXISTS sp_CreateProductReceipt;
DELIMITER $$

CREATE DEFINER=`cs340_rishwain`@`%` PROCEDURE `sp_CreateProductReceipt`(
    IN quantity INT(11),
    IN product_name VARCHAR(45),
    IN receipt_dateTime DATETIME,
    OUT productReceiptID INT(11))
BEGIN
	DECLARE rID INT;
    DECLARE pID INT;
-- Citation for the following function: sp_CreateProductReceipt
-- Date: 08/14/2025
-- Adapted from : canvas starter code
-- Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25664628

-- Citation for use of AI Tools:
-- Date: 08/14/2025
-- Prompts used to fix PL/SQL 
-- date and time was not matching up on the database and website
-- share sql procedure and asked how to fix it 
-- asked how to make the it less specific and just do within 24 hour
-- it suggested to use DATE() function
-- AI Source URL: https://copilot.microsoft.com/

   
    
    SELECT productID INTO pID
    FROM `Products`
    WHERE `productName` = product_name
    LIMIT 1;
    IF pID IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Product not found';
    END IF;
    SELECT receiptID INTO rID
    FROM `Receipts`
    WHERE DATE(dateTime) = DATE(receipt_dateTime)
    LIMIT 1;
    IF rID IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Receipt not found';
    END IF;
    INSERT INTO `ProductReceipts` (quantity, `productID`, receiptID)
    VALUES (quantity, pID, rID);
    -- Store the ID of the last inserted row
    SELECT LAST_INSERT_ID() into productReceiptID;
    -- Display the ID of the last inserted person.
    SELECT LAST_INSERT_ID() AS 'new_id';
    -- Example of how to get the ID of the newly created person:
        -- CALL sp_CreatePerson('Theresa', 'Evans', 2, 48, @new_id);
        -- SELECT @new_id AS 'New Person ID';
END $$
-- DELIMITER $$

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_CreateReceipt;
DELIMITER $$
CREATE DEFINER=`cs340_rishwain`@`%` PROCEDURE `sp_CreateReceipt`(
    IN dateTime DATETIME, 
    IN customer_firstName VARCHAR(255),
    IN customer_lastName VARCHAR(255),
    OUT receiptID INT(11))
BEGIN
-- Citation for the following function: sp_CreateReceipt
-- Date: 08/14/2025
-- Adapted from : canvas starter code
-- Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25664628
     
    DECLARE cID INT;
    SELECT customerID INTO cID
    FROM Customers
    WHERE `firstName` = customer_firstName and `lastName` = customer_lastName
    LIMIT 1;
    INSERT INTO Receipts (dateTime, customerID)
    VALUES (dateTime, cID);
    -- Store the ID of the last inserted row
    SELECT LAST_INSERT_ID() into ReceiptID;
    -- Display the ID of the last inserted person.
    SELECT LAST_INSERT_ID() AS 'new_id';
    -- Example of how to get the ID of the newly created person:
        -- CALL sp_CreatePerson('Theresa', 'Evans', 2, 48, @new_id);
        -- SELECT @new_id AS 'New Person ID';
END $$
DELIMITER ;
DROP PROCEDURE IF EXISTS sp_delete_productreceipts;
DELIMITER $$
CREATE DEFINER=`cs340_rishwain`@`%` PROCEDURE `sp_delete_productreceipts`( 
IN p_productReceiptID INT 
)
BEGIN 
-- Citation for the following function: sp_delete_productreceipts
-- Date: 08/14/2025
-- Adapted from : canvas starter code
-- Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25664628
        
DECLARE EXIT HANDLER FOR SQLEXCEPTION 
BEGIN  
-- Rollback the transaction in case of any error  
ROLLBACK;
SELECT 'Error! ProductReceipt not deleted.' AS Result;
END;
-- Start the transaction 
START TRANSACTION;
-- Delete from productreceipts table  
DELETE FROM `ProductReceipts` WHERE `productReceiptID` = p_productReceiptID;
-- Delete from products table  
-- DELETE FROM `Products` WHERE `productID` = productID;
-- DELETE FROM `Receipts` WHERE `receiptID` = receiptID;
-- Commit the transaction  
COMMIT;
END $$
DELIMITER ;
DROP PROCEDURE IF EXISTS sp_DeleteProduct;
DELIMITER $$
CREATE DEFINER=`cs340_rishwain`@`%` PROCEDURE `sp_DeleteProduct`(IN p_id INT)
BEGIN
-- Citation for the following function: sp_DeleteProduct
-- Date: 08/14/2025
-- Adapted from : canvas starter code
-- Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25664628
         
    DECLARE error_message VARCHAR(255);
    -- error handling
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Roll back the transaction on any error
        ROLLBACK;
        -- Propagate the custom error message to the caller
        RESIGNAL;
    END;
    START TRANSACTION;
        -- Deleting corresponding rows from both bsg_people table and 
        --      intersection table to prevent a data anomaly
        -- This can also be accomplished by using an 'ON DELETE CASCADE' constraint
        --      inside the bsg_cert_people table.
        DELETE FROM `Products` WHERE `productID` = p_id;
        -- DELETE FROM bsg_people WHERE id = p_id;
        -- ROW_COUNT() returns the number of rows affected by the preceding statement.
        IF ROW_COUNT() = 0 THEN
            set error_message = CONCAT('No matching record found in Products for id: ', p_id);
            -- Trigger custom error, invoke EXIT HANDLER
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
    COMMIT;
END $$
DELIMITER ;
DROP PROCEDURE IF EXISTS sp_DeleteReceipt;
DELIMITER $$
CREATE DEFINER=`cs340_rishwain`@`%` PROCEDURE `sp_DeleteReceipt`(IN r_id INT)
BEGIN
-- Citation for the following function: sp_DeleteReceipt
-- Date: 08/14/2025
-- Adapted from : canvas starter code
-- Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25664628
     
    DECLARE error_message VARCHAR(255);
    -- error handling
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Roll back the transaction on any error
        ROLLBACK;
        -- Propagate the custom error message to the caller
        RESIGNAL;
    END;
    START TRANSACTION;
        -- Deleting corresponding rows from both bsg_people table and 
        --      intersection table to prevent a data anomaly
        -- This can also be accomplished by using an 'ON DELETE CASCADE' constraint
        --      inside the bsg_cert_people table.
        DELETE FROM `Receipts` WHERE `receiptID` = r_id;
        -- DELETE FROM bsg_people WHERE id = p_id;
        -- ROW_COUNT() returns the number of rows affected by the preceding statement.
        IF ROW_COUNT() = 0 THEN
            set error_message = CONCAT('No matching record found in bsg_people for id: ', r_id);
            -- Trigger custom error, invoke EXIT HANDLER
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
    COMMIT;
END $$
DELIMITER ;
DROP PROCEDURE IF EXISTS sp_load_art_supplies_db;
DELIMITER $$
CREATE DEFINER=`cs340_rishwain`@`%` PROCEDURE `sp_load_art_supplies_db`()
BEGIN

-- Citation for the following function: sp_CreateProduct
-- Date: 08/14/2025
-- Adapted from : bsg_db.sql 
-- Source URL: https://canvas.oregonstate.edu/courses/2007765/assignments/10118880?module_item_id=25664605
  
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
DROP PROCEDURE IF EXISTS sp_UpdateProduct;
DELIMITER $$
CREATE DEFINER=`cs340_rishwain`@`%` PROCEDURE `sp_UpdateProduct`(IN productID_Input INT(11), 
    IN productName_Input VARCHAR(45), 
    IN price_Input decimal(10,2), 
    IN sellPrice_Input decimal(10,2), 
    IN newProduct_Input tinyint(4),
    IN firstDateOrdered_Input date,
    IN manufacturerID_Input int(11)
    )
BEGIN
-- Citation for the following function:
-- Date: 08/14/2025
-- Adapted from :
-- Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25664628
     
    Update Products SET productName = productName_Input, price = price_Input, 
    sellPrice = sellPrice_Input, newProduct = newProduct_Input, 
    firstDateOrdered = firstDateOrdered_Input,  manufacturerID = manufacturerID_Input
    WHERE productID = productID_Input;
END $$
DELIMITER ;
DROP PROCEDURE IF EXISTS sp_UpdateProductReceipt;
DELIMITER $$
CREATE DEFINER=`cs340_rishwain`@`%` PROCEDURE `sp_UpdateProductReceipt`(IN productReceiptID_INPUT INT(11), 
    IN quantity_INPUT int(11), 
    IN productID_INPUT int(11),
    IN receiptID_INPUT int(11)
    )
BEGIN
-- Citation for the following function: sp_UpdateProductReceipt
-- Date: 08/14/2025
-- Adapted from : canvas starter code
-- Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25664628
       
     
    Update `ProductReceipts` SET quantity = quantity_INPUT, productID = productID_INPUT, receiptID = receiptID_INPUT
    WHERE productReceiptID = productReceiptID_Input;
END //
DELIMITER ;
DROP PROCEDURE IF EXISTS sp_UpdateReceipt;
DELIMITER $$
CREATE DEFINER=`cs340_rishwain`@`%` PROCEDURE `sp_UpdateReceipt`(IN receiptID_Input INT(11), 
    IN dateTime_Input DATETIME, 
    IN customerID_Input int(11)
    )
BEGIN
-- Citation for the following function: sp_UpdateReceipt
-- Date: 08/14/2025
-- Adapted from : canvas starter code
-- Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25664628
      
     
    Update `Receipts` SET dateTime = dateTime_Input, customerID = customerID_Input
    WHERE receiptID = receiptID_Input;
END $$
DELIMITER ;