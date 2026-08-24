import React, { useState } from 'react';

const CreateManufacturer = ({ backendURL, refreshData }) => {

    const [formData, setFormData] = useState({
        create_manufacturer_name: '',
        create_manufacturer_phoneNumber: '',
        create_manufacturer_address: ''
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
            const response = await fetch(backendURL + '/manufacturer/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log("Manufacturer created successfully.");
                setStatusMessage('Manufacturer created successfully!');
                refreshData();
            } else {
                console.error("Error creating manufacturer.");
                setStatusMessage('Error creating manufacturer. Please check your inputs and try again.');
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            setStatusMessage('Error connecting to the server. Please try again.');
        }
    };

    return (
        <>
        <h2>Create a Manufacturer</h2>

        {statusMessage && <p>{statusMessage}</p>}

        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="create_manufacturer_name">Name: </label>
            <input
                type="text"
                name="create_manufacturer_name"
                id="create_manufacturer_name"
                value={formData.create_manufacturer_name}
                onChange={handleChange}
            />

            <label htmlFor="create_manufacturer_phoneNumber">Phone Number: </label>
            <input
                type="text"
                name="create_manufacturer_phoneNumber"
                id="create_manufacturer_phoneNumber"
                value={formData.create_manufacturer_phoneNumber}
                onChange={handleChange}
            />

            <label htmlFor="create_manufacturer_address">Address: </label>
            <input
                type="text"
                name="create_manufacturer_address"
                id="create_manufacturer_address"
                value={formData.create_manufacturer_address}
                onChange={handleChange}
            />

            <input type="submit" />
        </form>
        </>
    );
};

export default CreateManufacturer;
