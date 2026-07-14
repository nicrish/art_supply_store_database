// Citation for the following function: CreateProductReceipt
// Date: 8/13/25
// Adapted from canvas: "Exploration - Implementing CUD operations in your app "
// Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25664628
// changed passed props, form fields, and endpoint for fetch call but used example as a template


import React, { useState } from 'react';



const CreateProductReceipt = ({ products, receipts, backendURL, refreshData }) => {
    
        const [formData, setFormData] = useState({
            create_productreceipt_quantity: '',
            create_productreceipt_productName: '',
            create_productreceipt_receiptDateTime: ''
            
        });
    
        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        };
    
        const handleSubmit = async (e) => {
            e.preventDefault(); // Prevent default form submission
    
            try {
                console.log(formData)
                const response = await fetch(backendURL + '/productreceipt/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
               
                });
    
                if (response.ok) {
                    console.log("Product created successfully.");
                    refreshData();
                } else {
                    console.log(backendURL + '/productreceipt/create')
            
                    console.error("Error creating product.");
                }
            } catch (error) {
                console.error('Error during form submission:', error);
            }
        };

    return (
        <>
        <h2>Create a Product Receipt</h2>

        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="create_productreceipt_quantity">Quantity: </label>
                <input
                    type="number"
                    name="create_productreceipt_quantity"
                    id="create_productreceipt_quantity"
                    value={formData.create_productreceipt_quantity}
                    onChange = {handleChange}
                />
            <label htmlFor="create_productreceipt_productName">Select a Product:</label>
            <select
                name="create_productreceipt_productName"
                id="create_productreceipt_productName"
                onChange={handleChange}
            >
                <option value="">Select a Product</option>
                {products.map((p, index) => (
                    <option value={p.productName} key={index}>{p.productName}</option>
                ))}
            </select>
            <label htmlFor="create_productreceipt_receiptDateTime">Date: </label>
            <select
                name="create_productreceipt_receiptDateTime"
                id="create_productreceipt_receiptDateTime"
                onChange = {handleChange}
            >
                <option value="">Select a Date</option>
                <option value="NULL">&lt; None &gt;</option>
                {receipts.map((r, index) => (
                    <option value={r.dateTime} key={index}>{r.dateTime}</option>
                ))}
            </select>

    

            <input type="submit" />
        </form>
        </>
    );
};

export default CreateProductReceipt;