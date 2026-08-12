import React, { useState } from 'react';



const CreateProductReceipt = ({ products, receipts, backendURL, refreshData }) => {

        const [formData, setFormData] = useState({
            create_productreceipt_quantity: '',
            create_productreceipt_productName: '',
            create_productreceipt_receiptDateTime: ''

        });

        const [statusMessage, setStatusMessage] = useState('');

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
                    setStatusMessage('Product receipt created successfully!');
                    refreshData();
                } else {
                    console.log(backendURL + '/productreceipt/create')

                    console.error("Error creating product.");
                    setStatusMessage('Error creating product receipt. Please check your inputs and try again.');
                }
            } catch (error) {
                console.error('Error during form submission:', error);
                setStatusMessage('Error connecting to the server. Please try again.');
            }
        };

    return (
        <>
        <h2>Create a Product Receipt</h2>

        {statusMessage && <p>{statusMessage}</p>}

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
