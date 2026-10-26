import React, { useState } from 'react';

const CreateOrder = ({ products, backendURL, refreshData }) => {

    const [formData, setFormData] = useState({
        create_order_date: '',
        create_order_quantity: '',
        create_order_productName: ''
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
        e.preventDefault();

        try {
            const response = await fetch(backendURL + '/order/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log("Order created successfully.");
                setStatusMessage('Order created successfully!');
                refreshData();
            } else {
                console.error("Error creating order.");
                setStatusMessage('Error creating order. Please check your inputs and try again.');
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            setStatusMessage('Error connecting to the server. Please try again.');
        }
    };

    return (
        <>
        <h2>Create an Order</h2>

        {statusMessage && <p>{statusMessage}</p>}

        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="create_order_date">Date: </label>
            <input
                type="date"
                name="create_order_date"
                id="create_order_date"
                value={formData.create_order_date}
                onChange={handleChange}
            />

            <label htmlFor="create_order_quantity">Quantity: </label>
            <input
                type="number"
                name="create_order_quantity"
                id="create_order_quantity"
                value={formData.create_order_quantity}
                onChange={handleChange}
            />

            <label htmlFor="create_order_productName">Select a Product:</label>
            <select
                name="create_order_productName"
                id="create_order_productName"
                onChange={handleChange}
            >
                <option value="">Select a Product</option>
                {products?.map((p, index) => (
                    <option value={p.productName} key={index}>{p.productName}</option>
                ))}
            </select>

            <input type="submit" />
        </form>
        </>
    );
};

export default CreateOrder;
