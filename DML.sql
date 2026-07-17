-- These are some Database Manipulation queries for a partially implemented Project Website 
-- using the art_store database.
-- Your submission should contain ALL the queries required to implement ALL the
-- functionalities listed in the Project Specs.

-- get all order data with product names
SELECT Orders.orderID, Orders.date, Orders.quantity, Products.Productname FROM Orders
INNER JOIN Products ON Products.ProductID = Orders.ProductID;

-- get all customer data
SELECT * FROM `Customers`


-- get all manufacturer data
SELECT * FROM `Manufacturers`


-- get all productreceipt data with product name and receiptdatetime
SELECT ProductReceipts.productReceiptID, Products.productName, Receipts.dateTime, ProductReceipts.quantity FROM ProductReceipts
INNER JOIN Products ON Products.productID = ProductReceipts.productID
INNER JOIN Receipts ON Receipts.receiptID = ProductReceipts.receiptID;

-- get all product data with manufacturer name
SELECT Products.productID, Products.productName, Products.price, Products.sellPrice, Products.newProduct, Products.firstDateOrdered, Manufacturers.name from Products
INNER JOIN Manufacturers WHERE Manufacturers.manufacturerID = Products.manufacturerID;

-- get all Receipt data with customer name
SELECT Receipts.receiptID, Receipts.dateTime, Customers.firstName, Customers.lastName FROM `Receipts` 
Inner JOIN Customers WHERE Customers.customerID = Receipts.customerID

-- add a new receipt
INSERT INTO Receipts (dateTime, customerID) VALUES (:dateTime_Input, :customerID_dropdown_Input)

-- add a new product
INSERT INTO Products (productName, price, sellPrice, newProduct, firstDateOrdered, manufacturerID) VALUES (:productName_Input, :price_Input, :sellPrice_Input, :newProduct_Input, :firstDateOrdered_Input, :manufacturerID_dropdown_Input)

-- add a new productRecepts
INSERT INTO ProductReceipts (productID, receiptID) VALUES (:ProductID_dropdown_Input, :ReceiptID_dropdown_Input)

-- add a new customer
INSERT INTO Customers (customerID, firstName, lastName, email, address, phoneNumber) VALUES (:customerID_Input, :firstName_Input, :lastName_Input, :email_Input, :address_Input, :phoneNumber_Input)

-- add a new manufacturer
INSERT INTO Manufacturers (manufacturerID, phoneNumber, address, name) VALUES (:manufacturerID_Input, :phoneNumber_Input, :address_Input, :name_Input)

-- add a new order
INSERT INTO Orders (orderID, date, quantity, productID) VALUES (:orderID_Input, :date_Input, :quantity_Input, :ProductID_dropdown_Input)


-- update a new receipt
Update Receipts SET dateTime = :dateTime_Input, customerID = :customerID_dropdown_Input WHERE receiptId = :receipt_ID_Input


-- update a new product
Update Products SET productName = :productName_Input, price = :price_Input, sellPrice = :sellPrice_Input, newProduct = :newProduct_Input, firstDateOrdered = :firstDateOrdered_Input,  manufacturerID = :manufacturerID_dropdown_Input, WHERE productID = :product_ID_Input

-- update a new productRecepts
Update ProductReceipts SET receiptID = :ReceiptID_dropdown_Input, WHERE productReceiptIDid = :productreceipt_ID_Input;

-- update a new customer
Update Customers SET firstName = :firstName_Input, lastName = :lastName_Input, email = :email_Input, address = :address_Input, phoneNumber = :phoneNumber_Input, WHERE customerID = :customerID_Input;

-- update a new manufacturer
Update Manufacturers SET phoneNumber = :phoneNumber_Input, address = :address_Input, name = :name_Input, WHERE manufacturerID = :manufacturerID_Input

-- update a new order
Update Orders SET date = :date_Input, quantity = :quantity_Input, productID = :ProductID_dropdown_Input, WHERE orderID = :orderID_Input



-- delete a receipt
DELETE FROM Receipts WHERE receiptId = :receipt_ID_Input

-- delete a product
DELETE FROM Products WHERE productID = :product_ID_Input

-- delete a productRecepts
DELETE FROM ProductReceipts WHERE productReceiptIDid = :productreceipt_ID_Input
-- delete a customer
DELETE FROM Customers WHERE customerID = :customerID_Input 

-- delete a manufacturer
DELETE FROM Manufacturers WHERE manufacturerID = :manufacturerID_Input

-- delete a order
DELETE FROM Orders WHERE orderID = :orderID_Input

