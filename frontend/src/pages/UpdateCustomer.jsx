import React, { useState } from 'react';

const UpdateCustomer = ({ customers, backendURL, refreshData }) => {

    const [formData, setFormData] = useState({
        customerID: '',
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        phoneNumber: ''
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
            const response = await fetch(backendURL + '/customer/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log("Customer updated successfully.");
                setStatusMessage('Customer updated successfully!');
                refreshData();
            } else {
                console.error("Error updating customer.");
                setStatusMessage('Error updating customer. Please check your inputs and try again.');
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            setStatusMessage('Error connecting to the server. Please try again.');
        }
    };

    return (
        <>
        <h2>Update a Customer</h2>

        {statusMessage && <p>{statusMessage}</p>}

        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="customerID">Customer to Update: </label>
            <select
                name="customerID"
                id="customerID"
                value={formData.customerID}
                onChange={handleChange}
            >
                <option value="">Select a Customer</option>
                {customers.map((c) => (
                    <option key={c.customerID} value={c.customerID}>
                        {c.firstName} {c.lastName}
                    </option>
                ))}
            </select>

            <label htmlFor="firstName">First Name: </label>
            <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
            />

            <label htmlFor="lastName">Last Name: </label>
            <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
            />

            <label htmlFor="email">Email: </label>
            <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
            />

            <label htmlFor="address">Address: </label>
            <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
            />

            <label htmlFor="phoneNumber">Phone Number: </label>
            <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
            />

            <input type="submit" />
        </form>
        </>
    );
};

export default UpdateCustomer;
