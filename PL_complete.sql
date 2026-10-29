-- ============================================
-- Paint the Day Away — All Stored Procedures
-- Rebuilt and corrected: no DEFINER clauses,
-- no nested procedures, proper DELIMITER framing
-- ============================================

USE art_supply_store;

-- ===== sp_CreateProduct =====
DROP PROCEDURE IF EXISTS sp_CreateProduct;
DELIMITER $$
CREATE PROCEDURE `sp_CreateProduct`(
    IN productName VARCHAR(45),
    IN price decimal(10,2),
    IN sellPrice decimal(10,2),
    IN newProduct tinyint(4),
    IN firstDateOrdered date,
    IN manufacturerName VARCHAR(255),
    OUT productID INT(11))
BEGIN
    DECLARE mID INT;
    SELECT manufacturerID INTO mID
    FROM Manufacturers
    WHERE name = manufacturerName
    LIMIT 1;
    INSERT INTO Products (productName, price, sellPrice, newProduct, firstDateOrdered, manufacturerID)
    VALUES (productName, price, sellPrice, newProduct, firstDateOrdered, mID);
    SELECT LAST_INSERT_ID() into productID;
    SELECT LAST_INSERT_ID() AS 'new_id';
END $$
DELIMITER ;


-- ===== sp_UpdateProduct =====
DROP PROCEDURE IF EXISTS sp_UpdateProduct;
DELIMITER $$
CREATE PROCEDURE `sp_UpdateProduct`(IN productID_Input INT(11),
    IN productName_Input VARCHAR(45),
    IN price_Input decimal(10,2),
    IN sellPrice_Input decimal(10,2),
    IN newProduct_Input tinyint(4),
    IN firstDateOrdered_Input date,
    IN manufacturerID_Input int(11)
    )
BEGIN
    Update Products SET productName = productName_Input, price = price_Input,
    sellPrice = sellPrice_Input, newProduct = newProduct_Input,
    firstDateOrdered = firstDateOrdered_Input,  manufacturerID = manufacturerID_Input
    WHERE productID = productID_Input;
END $$
DELIMITER ;


-- ===== sp_DeleteProduct =====
DROP PROCEDURE IF EXISTS sp_DeleteProduct;
DELIMITER $$
CREATE PROCEDURE `sp_DeleteProduct`(IN p_id INT)
BEGIN
    DECLARE error_message VARCHAR(255);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    START TRANSACTION;
        DELETE FROM `Products` WHERE `productID` = p_id;
        IF ROW_COUNT() = 0 THEN
            set error_message = CONCAT('No matching record found in Products for id: ', p_id);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
    COMMIT;
END $$
DELIMITER ;


-- ===== sp_CreateManufacturer =====
DROP PROCEDURE IF EXISTS sp_CreateManufacturer;
DELIMITER $$
CREATE PROCEDURE `sp_CreateManufacturer`(
    IN name_Input VARCHAR(255),
    IN phoneNumber_Input VARCHAR(45),
    IN address_Input VARCHAR(255),
    OUT new_id INT
)
BEGIN
    INSERT INTO `Manufacturers` (name, phoneNumber, address)
    VALUES (name_Input, phoneNumber_Input, address_Input);
    SET new_id = LAST_INSERT_ID();
END $$
DELIMITER ;


-- ===== sp_UpdateManufacturer =====
DROP PROCEDURE IF EXISTS sp_UpdateManufacturer;
DELIMITER $$
CREATE PROCEDURE `sp_UpdateManufacturer`(
    IN manufacturerID_Input INT(11),
    IN name_Input VARCHAR(255),
    IN phoneNumber_Input VARCHAR(45),
    IN address_Input VARCHAR(255)
)
BEGIN
    UPDATE `Manufacturers`
    SET name = name_Input,
        phoneNumber = phoneNumber_Input,
        address = address_Input
    WHERE manufacturerID = manufacturerID_Input;
END $$
DELIMITER ;


-- ===== sp_CreateCustomer =====
DROP PROCEDURE IF EXISTS sp_CreateCustomer;
DELIMITER $$
CREATE PROCEDURE `sp_CreateCustomer`(
    IN firstName_Input VARCHAR(100),
    IN lastName_Input VARCHAR(100),
    IN email_Input VARCHAR(255),
    IN address_Input VARCHAR(255),
    IN phoneNumber_Input VARCHAR(45),
    OUT new_id INT
)
BEGIN
    INSERT INTO `Customers` (firstName, lastName, email, address, phoneNumber)
    VALUES (firstName_Input, lastName_Input, email_Input, address_Input, phoneNumber_Input);
    SET new_id = LAST_INSERT_ID();
END $$
DELIMITER ;


-- ===== sp_UpdateCustomer =====
DROP PROCEDURE IF EXISTS sp_UpdateCustomer;
DELIMITER $$
CREATE PROCEDURE `sp_UpdateCustomer`(
    IN customerID_Input INT(11),
    IN firstName_Input VARCHAR(100),
    IN lastName_Input VARCHAR(100),
    IN email_Input VARCHAR(255),
    IN address_Input VARCHAR(255),
    IN phoneNumber_Input VARCHAR(45)
)
BEGIN
    UPDATE `Customers`
    SET firstName = firstName_Input,
        lastName = lastName_Input,
        email = email_Input,
        address = address_Input,
        phoneNumber = phoneNumber_Input
    WHERE customerID = customerID_Input;
END $$
DELIMITER ;


-- ===== sp_CreateReceipt =====
DROP PROCEDURE IF EXISTS sp_CreateReceipt;
DELIMITER $$
CREATE PROCEDURE `sp_CreateReceipt`(
    IN dateTime DATETIME,
    IN customer_firstName VARCHAR(255),
    IN customer_lastName VARCHAR(255),
    OUT receiptID INT(11))
BEGIN
    DECLARE cID INT;
    SELECT customerID INTO cID
    FROM Customers
    WHERE `firstName` = customer_firstName and `lastName` = customer_lastName
    LIMIT 1;
    INSERT INTO Receipts (dateTime, customerID)
    VALUES (dateTime, cID);
    SELECT LAST_INSERT_ID() into receiptID;
    SELECT LAST_INSERT_ID() AS 'new_id';
END $$
DELIMITER ;


-- ===== sp_UpdateReceipt =====
DROP PROCEDURE IF EXISTS sp_UpdateReceipt;
DELIMITER $$
CREATE PROCEDURE `sp_UpdateReceipt`(IN receiptID_Input INT(11),
    IN dateTime_Input DATETIME,
    IN customerID_Input int(11)
    )
BEGIN
    Update `Receipts` SET dateTime = dateTime_Input, customerID = customerID_Input
    WHERE receiptID = receiptID_Input;
END $$
DELIMITER ;


-- ===== sp_DeleteReceipt =====
DROP PROCEDURE IF EXISTS sp_DeleteReceipt;
DELIMITER $$
CREATE PROCEDURE `sp_DeleteReceipt`(IN r_id INT)
BEGIN
    DECLARE error_message VARCHAR(255);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    START TRANSACTION;
        DELETE FROM `Receipts` WHERE `receiptID` = r_id;
        IF ROW_COUNT() = 0 THEN
            set error_message = CONCAT('No matching record found in Receipts for id: ', r_id);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
    COMMIT;
END $$
DELIMITER ;


-- ===== sp_CreateProductReceipt =====
DROP PROCEDURE IF EXISTS sp_CreateProductReceipt;
DELIMITER $$
CREATE PROCEDURE `sp_CreateProductReceipt`(
    IN quantity INT(11),
    IN product_name VARCHAR(45),
    IN receipt_dateTime DATETIME,
    OUT productReceiptID INT(11))
BEGIN
    DECLARE rID INT;
    DECLARE pID INT;

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
    SELECT LAST_INSERT_ID() into productReceiptID;
    SELECT LAST_INSERT_ID() AS 'new_id';
END $$
DELIMITER ;


-- ===== sp_UpdateProductReceipt =====
DROP PROCEDURE IF EXISTS sp_UpdateProductReceipt;
DELIMITER $$
CREATE PROCEDURE `sp_UpdateProductReceipt`(IN productReceiptID_Input INT(11),
    IN quantity_INPUT int(11),
    IN productID_INPUT int(11),
    IN receiptID_INPUT int(11)
    )
BEGIN
    Update `ProductReceipts` SET quantity = quantity_INPUT, productID = productID_INPUT, receiptID = receiptID_INPUT
    WHERE productReceiptID = productReceiptID_Input;
END $$
DELIMITER ;


-- ===== sp_delete_productreceipts =====
DROP PROCEDURE IF EXISTS sp_delete_productreceipts;
DELIMITER $$
CREATE PROCEDURE `sp_delete_productreceipts`(
    IN p_productReceiptID INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error! ProductReceipt not deleted.' AS Result;
    END;
    START TRANSACTION;
    DELETE FROM `ProductReceipts` WHERE `productReceiptID` = p_productReceiptID;
    COMMIT;
END $$
DELIMITER ;


-- ===== sp_CreateOrder =====
DROP PROCEDURE IF EXISTS sp_CreateOrder;
DELIMITER $$
CREATE PROCEDURE `sp_CreateOrder`(
    IN date_Input DATE,
    IN quantity_Input INT(11),
    IN productName_Input VARCHAR(45),
    OUT new_id INT
)
BEGIN
    DECLARE pID INT;
    SELECT productID INTO pID
    FROM Products
    WHERE productName = productName_Input
    LIMIT 1;

    INSERT INTO `Orders` (date, quantity, productID)
    VALUES (date_Input, quantity_Input, pID);

    SET new_id = LAST_INSERT_ID();
END $$
DELIMITER ;


-- ===== sp_UpdateOrder =====
DROP PROCEDURE IF EXISTS sp_UpdateOrder;
DELIMITER $$
CREATE PROCEDURE `sp_UpdateOrder`(
    IN orderID_Input INT(11),
    IN date_Input DATE,
    IN quantity_Input INT(11),
    IN productID_Input INT(11)
)
BEGIN
    UPDATE `Orders`
    SET date = date_Input,
        quantity = quantity_Input,
        productID = productID_Input
    WHERE orderID = orderID_Input;
END $$
DELIMITER ;


-- ===== sp_DeleteCustomer =====
-- ON DELETE CASCADE also removes this customer's Receipts and their ProductReceipts
DROP PROCEDURE IF EXISTS sp_DeleteCustomer;
DELIMITER $$
CREATE PROCEDURE `sp_DeleteCustomer`(IN c_id INT)
BEGIN
    DECLARE error_message VARCHAR(255);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    START TRANSACTION;
        DELETE FROM `Customers` WHERE `customerID` = c_id;
        IF ROW_COUNT() = 0 THEN
            SET error_message = CONCAT('No matching record found in Customers for id: ', c_id);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
    COMMIT;
END $$
DELIMITER ;


-- ===== sp_DeleteManufacturer =====
-- ON DELETE CASCADE also removes its Products, and those products' Orders and ProductReceipts
DROP PROCEDURE IF EXISTS sp_DeleteManufacturer;
DELIMITER $$
CREATE PROCEDURE `sp_DeleteManufacturer`(IN m_id INT)
BEGIN
    DECLARE error_message VARCHAR(255);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    START TRANSACTION;
        DELETE FROM `Manufacturers` WHERE `manufacturerID` = m_id;
        IF ROW_COUNT() = 0 THEN
            SET error_message = CONCAT('No matching record found in Manufacturers for id: ', m_id);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
    COMMIT;
END $$
DELIMITER ;


-- ===== sp_DeleteOrder =====
-- No other table references Orders, so nothing else is deleted
DROP PROCEDURE IF EXISTS sp_DeleteOrder;
DELIMITER $$
CREATE PROCEDURE `sp_DeleteOrder`(IN o_id INT)
BEGIN
    DECLARE error_message VARCHAR(255);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    START TRANSACTION;
        DELETE FROM `Orders` WHERE `orderID` = o_id;
        IF ROW_COUNT() = 0 THEN
            SET error_message = CONCAT('No matching record found in Orders for id: ', o_id);
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;
    COMMIT;
END $$
DELIMITER ;


-- ===== sp_load_art_supplies_db =====
-- (Resets and reseeds all six tables — not nested with anything else)
DROP PROCEDURE IF EXISTS sp_load_art_supplies_db;
DELIMITER $$
CREATE PROCEDURE `sp_load_art_supplies_db`()
BEGIN

  DECLARE v_productID INT;
  DECLARE v_receiptID INT;

  SET FOREIGN_KEY_CHECKS=0;

  DROP TABLE IF EXISTS `Customers`;
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
  CREATE TABLE `Manufacturers` (
  `manufacturerID` int(11) NOT NULL AUTO_INCREMENT,
  `phoneNumber` varchar(45) NOT NULL,
  `address` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`manufacturerID`)
  );
  INSERT INTO Manufacturers (name, phoneNumber, address) VALUES
  ('Leda Art Supply', '317-943-3305', '200 49th St Seattle, WA 98105'),
  ('Tri Dee Arts', ' 360-336-6131', '113 1st st Seattle, WA 98105'),
  ('DANIEL SMITH Artist Materials','206-848-6952', '300 Greenwood Ave Seattle, WA 98105');

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
  CREATE TABLE `ProductReceipts` (
  `productReceiptID` int(11) NOT NULL AUTO_INCREMENT,
  `quantity` int(11) NOT NULL,
  `productID` int(11) NOT NULL,
  `receiptID` int(11) NOT NULL,
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