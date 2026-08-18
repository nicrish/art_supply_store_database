import React, { useState } from 'react';

const UpdateReceiptForm = ({ receipts, customers, backendURL, refreshData }) => {

    const [formData, setFormData] = useState({
        receiptID: '',
        dateTime: '',
        customerID: '',
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
            // datetime-local gives "YYYY-MM-DDTHH:MM" — convert to MySQL DATETIME format
            const submissionData = {
                ...formData,
                dateTime: formData.dateTime
                    ? formData.dateTime.replace('T', ' ') + ':00'
                    : formData.dateTime
            };

            console.log(submissionData);

            const response = await fetch(backendURL + '/receipt/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData)
            });

            if (response.ok) {
                console.log("Receipt updated successfully.");
                setStatusMessage('Receipt updated successfully!');
                refreshData();
            } else {
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
            <label htmlFor="receiptID">Receipt to Update: </label>
            <select
                name="receiptID"
                id="receiptID"
                value={formData.receiptID}
                onChange={handleChange}
            >
                <option value="">Select a Receipt</option>
                {receipts.map((r) => (
                    <option key={r.receiptID} value={r.receiptID}>
                        Receipt - {r.receiptID}: {r.firstName} {r.lastName} ({r.dateTime})
                    </option>
                ))}
            </select>

            <label htmlFor="dateTime">Date/Time: </label>
            <input
                type="datetime-local"
                name="dateTime"
                id="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
            />

            <label htmlFor="customerID">Customer: </label>
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

            <input type="submit" />
        </form>
        </>
    );
};

export default UpdateReceiptForm;
