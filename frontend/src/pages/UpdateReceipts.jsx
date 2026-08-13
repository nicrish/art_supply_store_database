import React, { useState } from 'react';



const UpdateReceipt = ({ customers, backendURL, refreshData }) => {

        const [formData, setFormData] = useState({
            receipt_dateTime: '',
            receipt_firstName: '',
            receipt_lastName: '',
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
                const response = await fetch(backendURL + '/receipt/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)

                });

                if (response.ok) {
                    console.log("receipt updated successfully.");
                    setStatusMessage('Receipt updated successfully!');
                    refreshData();
                } else {
                    console.log(backendURL + '/receipt/update')

                    console.error("Error updating receipt.");
                    setStatusMessage('Error updating receipt. Please check your inputs and try again.');
                }
            } catch (error) {
                console.error('Error during form submission:', error);
                setStatusMessage('Error connecting to the server. Please try again.');
            }
        };

    return (
        <>
        <h2>Update a Receipt</h2>

        {statusMessage && <p>{statusMessage}</p>}

        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="receipt_dateTime">Date/Time: </label>
                <input
                    type="datetime-local"
                    name="receipt_dateTime"
                    id="receipt_dateTime"
                    value={formData.receipt_dateTime}
                    onChange = {handleChange}
                />

            <label htmlFor="receipt_firstName">Customer First Name: </label>
            <select
                name="receipt_firstName"
                id="receipt_firstName"
                onChange={handleChange}
            >
                <option value="">Select a Customer</option>
                {customers.map((c, index) => (
                    <option value={c.firstName} key={index}>{c.firstName} {c.lastName}</option>
                ))}
            </select>

            <label htmlFor="receipt_lastName">Customer Last Name: </label>
            <input
                type="text"
                name="receipt_lastName"
                id="receipt_lastName"
                value={formData.receipt_lastName}
                onChange={handleChange}
            />

            <input type="submit" />
        </form>
        </>
    );
};

export default UpdateReceipt;
