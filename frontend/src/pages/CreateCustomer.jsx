import React, { useState } from 'react';

const CreateCustomer = ({ backendURL, refreshData }) => {

    const [formData, setFormData] = useState({
        create_customer_firstName: '',
        create_customer_lastName: '',
        create_customer_email: '',
        create_customer_address: '',
        create_customer_phoneNumber: ''
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
            const response = await fetch(backendURL + '/customer/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log("Customer created successfully.");
                setStatusMessage('Customer created successfully!');
                refreshData();
            } else {
                console.error("Error creating customer.");
                setStatusMessage('Error creating customer. Please check your inputs and try again.');
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            setStatusMessage('Error connecting to the server. Please try again.');
        }
    };

    return (
        <>
        <h2>Create a Customer</h2>

        {statusMessage && <p>{statusMessage}</p>}

        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="create_customer_firstName">First Name: </label>
            <input
                type="text"
                name="create_customer_firstName"
                id="create_customer_firstName"
                value={formData.create_customer_firstName}
                onChange={handleChange}
            />

            <label htmlFor="create_customer_lastName">Last Name: </label>
            <input
                type="text"
                name="create_customer_lastName"
                id="create_customer_lastName"
                value={formData.create_customer_lastName}
                onChange={handleChange}
            />

            <label htmlFor="create_customer_email">Email: </label>
            <input
                type="email"
                name="create_customer_email"
                id="create_customer_email"
                value={formData.create_customer_email}
                onChange={handleChange}
            />

            <label htmlFor="create_customer_address">Address: </label>
            <input
                type="text"
                name="create_customer_address"
                id="create_customer_address"
                value={formData.create_customer_address}
                onChange={handleChange}
            />

            <label htmlFor="create_customer_phoneNumber">Phone Number: </label>
            <input
                type="text"
                name="create_customer_phoneNumber"
                id="create_customer_phoneNumber"
                value={formData.create_customer_phoneNumber}
                onChange={handleChange}
            />

            <input type="submit" />
        </form>
        </>
    );
};

export default CreateCustomer;
