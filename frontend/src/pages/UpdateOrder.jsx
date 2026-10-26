import React, { useState } from 'react';

const UpdateOrder = ({ orders, products, backendURL, refreshData }) => {

    const [formData, setFormData] = useState({
        orderID: '',
        date: '',
        quantity: '',
        productID: ''
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
            const response = await fetch(backendURL + '/order/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log("Order updated successfully.");
                setStatusMessage('Order updated successfully!');
                refreshData();
            } else {
                console.error("Error updating order.");
                setStatusMessage('Error updating order. Please check your inputs and try again.');
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            setStatusMessage('Error connecting to the server. Please try again.');
        }
    };

    return (
        <>
        <h2>Update an Order</h2>

        {statusMessage && <p>{statusMessage}</p>}

        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="orderID">Order to Update: </label>
            <select
                name="orderID"
                id="orderID"
                value={formData.orderID}
                onChange={handleChange}
            >
                <option value="">Select an Order</option>
                {orders?.map((o) => (
                    <option key={o.orderID} value={o.orderID}>
                        Order - {o.orderID}: {o.productName} ({o.date})
                    </option>
                ))}
            </select>

            <label htmlFor="date">Date: </label>
            <input
                type="date"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleChange}
            />

            <label htmlFor="quantity">Quantity: </label>
            <input
                type="number"
                name="quantity"
                id="quantity"
                value={formData.quantity}
                onChange={handleChange}
            />

            <label htmlFor="productID">Product: </label>
            <select
                name="productID"
                id="productID"
                value={formData.productID}
                onChange={handleChange}
            >
                <option value="">Select a Product</option>
                {products?.map((p) => (
                    <option key={p.productID} value={p.productID}>
                        {p.productID} - {p.productName}
                    </option>
                ))}
            </select>

            <input type="submit" />
        </form>
        </>
    );
};

export default UpdateOrder;
