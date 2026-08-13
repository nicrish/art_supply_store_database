import React, { useState } from 'react';



const CreateReceipt = ({ customers, backendURL, refreshData }) => {

        const [formData, setFormData] = useState({
            create_receipt_dateTime: '',
            create_receipt_firstName: '',
            create_receipt_lastName: '',
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
                const response = await fetch(backendURL + '/receipt/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)

                });

                if (response.ok) {
                    console.log("receipt created successfully.");
                    setStatusMessage('Receipt created successfully!');
                    refreshData();
                } else {
                    console.log(backendURL + '/receipt/create')

                    console.error("Error creating receipt.");
                    setStatusMessage('Error creating receipt. Please check your inputs and try again.');
                }
            } catch (error) {
                console.error('Error during form submission:', error);
                setStatusMessage('Error connecting to the server. Please try again.');
            }
        };

    return (
        <>
        <h2>Create a Receipt</h2>

        {statusMessage && <p>{statusMessage}</p>}

        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="create_receipt_dateTime">Date/Time: </label>
                <input
                    type="datetime-local"
                    name="create_receipt_dateTime"
                    id="create_receipt_dateTime"
                    value={formData.create_receipt_dateTime}
                    onChange = {handleChange}
                />

            <label htmlFor="create_receipt_firstName">Customer First Name: </label>
            <select
                name="create_receipt_firstName"
                id="create_receipt_firstName"
                onChange={handleChange}
            >
                <option value="">Select a Customer</option>
                {customers.map((c, index) => (
                    <option value={c.firstName} key={index}>{c.firstName} {c.lastName}</option>
                ))}
            </select>

            <label htmlFor="create_receipt_lastName">Customer Last Name: </label>
            <input
                type="text"
                name="create_receipt_lastName"
                id="create_receipt_lastName"
                value={formData.create_receipt_lastName}
                onChange={handleChange}
            />

            <input type="submit" />
        </form>
        </>
    );
};

export default CreateReceipt;
