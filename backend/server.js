// ########################################
// ########## SETUP

// Database
const db = require('./db-connector');

// Express
const express = require('express');
const app = express();

// Middleware
const cors = require('cors');
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json()); // this is needed for post requests


const PORT = 2124;

// Citation for the following endpoints:  /customers, /manufacturers, /orders, /products, /productreceipts, /receipts
// Date: 8/13/25
// Adapted from canvas: "Web Application Technology"
// Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-web-application-technology-2?module_item_id=25664612
// input our own queries and used example as template 


app.get('/customers', async (req, res) => {
    try {
        

        const query1 = `SELECT * FROM Customers;`
      
        
        const [customers] = await db.query(query1);
     
    
        res.status(200).json({ customers });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }
    
});

app.get('/manufacturers', async (req, res) => {
    try {
        
       
        const query1 = `SELECT * FROM Manufacturers;`


        const [manufacturers] = await db.query(query1);

    
        res.status(200).json({ manufacturers });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }
    
});

app.get('/orders', async (req, res) => {
    try {
        
       
        const query1 = `SELECT Orders.orderID, Orders.date, Orders.quantity, Products.Productname FROM Orders INNER JOIN Products ON Products.ProductID = Orders.ProductID;`


        const [orders] = await db.query(query1);

    
        res.status(200).json({ orders });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }
    
});

app.get('/products', async (req, res) => {
    try {
        
       
        const query1 = `SELECT Products.productID, Products.productName, Products.price, Products.sellPrice, Products.newProduct, Products.firstDateOrdered, Manufacturers.name from Products INNER JOIN Manufacturers WHERE Manufacturers.manufacturerID = Products.manufacturerID;;`
        
        const query2 = 'SELECT * FROM Manufacturers;';

        const [products] = await db.query(query1);
        console.log("Receipts fetched successfully");

        const [manufacturers] = await db.query(query2);

    
        res.status(200).json({ products, manufacturers });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }
    
});

app.get('/productreceipts', async (req, res) => {
    try {
        
       
        const query1 = `SELECT ProductReceipts.productReceiptID, Products.productName, Receipts.dateTime, ProductReceipts.quantity FROM ProductReceipts
INNER JOIN Products ON Products.productID = ProductReceipts.productID
INNER JOIN Receipts ON Receipts.receiptID = ProductReceipts.receiptID;
`

        const query2 = `SELECT * FROM Products`

        const query3 = `SELECT * FROM Receipts`


        const [productreceipts] = await db.query(query1);
        const [products] = await db.query(query2);
        const [receipts] = await db.query(query3)

    
        res.status(200).json({ productreceipts, products, receipts });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }
    
});

app.get('/receipts', async (req, res) => {
    try {
        
       
        const query1 = `SELECT Receipts.receiptID, Receipts.dateTime, Customers.firstName, Customers.lastName FROM Receipts INNER JOIN Customers ON Receipts.customerID = Customers.customerID;`
        
        const query2 = `SELECT * FROM Customers`

        const [receipts] = await db.query(query1);
        const [customers] = await db.query(query2);


        console.log(receipts);
        

    
        res.status(200).json({ receipts, customers });  // Send the results to the frontend

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }
    
});


// Citation for the following endpoints:  /productreceipts/delete, /productreceipts/create, /reset, /product/create, /product/update
// Date: 8/13/25
// Adapted from canvas: "Implementing CUD operations in your app"
// Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25664628
// input our function names and property names that relate to the data in our database

app.post('/productreceipts/delete', async function(req, res){
    try{
        let data = req.body

        console.log(data)
        const query1 = `CALL sp_delete_productreceipts(?);`
        await db.query(query1, [data.delete_receipt_id])

        console.log(`DELETE productreceipts. ID:${data.delete_receipt_id}` + 
            `Product Name: ${data.delete_product_name}`)
        
        res.status(200).json({ message: "Deleted successfully" });

    } catch(error){
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
        'An error occurred while executing the database queries.')
    }
})


app.post('/products/delete', async function(req, res){
    try{
        let data = req.body

        console.log(data)
        const query1 = `CALL sp_DeleteProduct();`
        await db.query(query1, [data.delete_product_id])

        console.log(`DELETE productreceipts. ID:${data.delete_product_id}` + 
            `Product Name: ${data.delete_product_name}`)
        
        res.status(200).json({ message: "Deleted successfully" });

    } catch(error){
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
        'An error occurred while executing the database queries.')
    }
})



app.post('/reset', async function (req, res) {
    try {
        console.log("Resetting the database...");
        const query1 = `CALL sp_load_art_supplies_db();`
        await db.query(query1);

        res.status(200).send({message: "Database reset successfully!"})
    } catch (error) {
      console.error("Error executing PL/SQL:", error);
        // Send a generic error message to the browser
      res.status(500).send("An error occurred while executing the PL/SQL.");
    }
});

app.post('/product/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        const query1 = `CALL sp_CreateProduct(?, ?, ?,
         ?, ?, ?, @new_id);`;

        // Store ID of last inserted row
        const [[[rows]]] = await db.query(query1, [
            data.create_product_productName,
            data.create_product_price,
            data.create_product_sellPrice,
            data.create_product_newProduct,
            data.create_product_firstDateOrdered,
            data.create_product_manufacturerName
        ]);

        console.log(`CREATE product. ID: ${rows.new_id} ` +
            `Name: ${data.create_product_productName}`
        );

        // Send success status to frontend
        res.status(200).json({ message: 'Product created successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/receipt/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        const query1 = `CALL sp_CreateReceipt(?, ?, ?, @new_id);`;

        // Store ID of last inserted row
        const [[[rows]]] = await db.query(query1, [
            data.create_receipt_dateTime,
            data.create_receipt_firstName,
            data.create_receipt_lastName,
        
        ]);

        console.log(`CREATE receipt. ID: ${rows.new_id} ` +
            `Name: ${data.create_receipt_dateTime}`
        );

        // Send success status to frontend
        res.status(200).json({ message: 'Receipt created successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/productreceipt/create', async function (req, res) {
    try {
        console.log("POST /productreceipt/create hit");
        console.log("Body received:", req.body);

        console.log("I am the first")
        // Parse frontend form information
        let data = req.body;


        const query1 = `CALL sp_CreateProductReceipt(?, ?, ?, @newID);`;


        console.log("→ Quantity:", req.body.create_productreceipt_quantity);
        console.log("→ Product:", req.body.create_productreceipt_productName);
        console.log("→ ReceiptDateTime:", req.body.create_productreceipt_receiptDateTime);

        

        

        const [[[rows]]] = await db.query(query1, [
            data.create_productreceipt_quantity,
            data.create_productreceipt_productName,
            data.create_productreceipt_receiptDateTime
            
        
        ]);

        console.log(`CREATE productreceipt. ID: ${rows.new_id} `)

        // Send success status to frontend
        res.status(200).json({ message: 'ProductReceipt created successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/product/update', async function (req, res) {
    try {
        // Parse frontend form information
        const data = req.body;

        if(isNaN(parseInt(data.productID))) data.productID = null
        if(isNaN(parseFloat(data.price))) data.price = null
        if(isNaN(parseFloat(data.sellPrice))) data.sellPrice = null
        if(isNaN(parseInt(data.newProduct))) data.newProduct = null
        if(isNaN(Date.parse(data.firstDateOrdered))) data.firstDateOrdered = null
        if(isNaN(parseInt(data.manufacturerID))) data.manufacturerID = null

        const query1 = `CALL sp_updateProduct(?, ?, ?,
         ?, ?, ?, ?);`;

        const query2 = `SELECT productName FROM Products WHERE productID = ?;`

        await db.query(query1, [
            data.productID,
            data.productName,
            data.price,
            data.sellPrice,
            data.newProduct,
            data.firstDateOrdered,
            data.manufacturerID
        ])

        const [[rows]] = await db.query(query2, [data.productID])
        
        console.log(`Update product. ID: ${data.productID} ` +
            `Name: ${rows.productName}`
        );

        // Send success status to frontend
        res.status(200).json({ message: 'Product created successfully' });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});


app.post('/productreceipts/update', async function (req, res) {
    try {
        // Parse frontend form information
        const data = req.body;

        if(isNaN(parseInt(data.quantity))) data.quantity = null
        if(isNaN(parseInt(data.productID))) data.productID = null
        if(isNaN(parseInt(data.productID))) data.productID = null

        const query1 = `CALL sp_UpdateProductReceipt(?, ?, ?,
         ?);`;

        const query2 = `SELECT productID, receiptID FROM ProductReceipts WHERE productReceiptID = ?;`

        await db.query(query1, [
            data.productReceiptID,
            data.quantity,
            data.productID,
            data.receiptID,
            
        ])

        const [[rows]] = await db.query(query2, [data.productReceiptID])
        
        console.log(`Update productreceipt. ID: ${data.productReceiptID} ` +
            `Name: ${rows.productID}`
        );

        // Send success status to frontend
        res.status(200).json({ message: 'ProductReceipt updated successfully' });
        
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});




app.listen(PORT, function () {
    console.log('Express started ' + PORT + '; press Ctrl-C to terminate.');
});