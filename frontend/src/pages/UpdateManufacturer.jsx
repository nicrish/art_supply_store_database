import React, { useState } from 'react';

const UpdateManufacturer = ({ manufacturers, backendURL, refreshData }) => {

    const [formData, setFormData] = useState({
        manufacturerID: '',
        name: '',
        phoneNumber: '',
        address: ''
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
            const response = await fetch(backendURL + '/manufacturer/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log("Manufacturer updated successfully.");
                setStatusMessage('Manufacturer updated successfully!');
                refreshData();
            } else {
                console.error("Error updating manufacturer.");
                setStatusMessage('Error updating manufacturer. Please check your inputs and try again.');
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            setStatusMessage('Error connecting to the server. Please try again.');
        }
    };

    return (
        <>
        <h2>Update a Manufacturer</h2>

        {statusMessage && <p>{statusMessage}</p>}

        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="manufacturerID">Manufacturer to Update: </label>
            <select
                name="manufacturerID"
                id="manufacturerID"
                value={formData.manufacturerID}
                onChange={handleChange}
            >
                <option value="">Select a Manufacturer</option>
                {manufacturers?.map((m) => (
                    <option key={m.manufacturerID} value={m.manufacturerID}>
                        {m.name}
                    </option>
                ))}
            </select>

            <label htmlFor="name">Name: </label>
            <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
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

            <label htmlFor="address">Address: </label>
            <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
            />

            <input type="submit" />
        </form>
        </>
    );
};

export default UpdateManufacturer;
