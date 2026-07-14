// Citation for the following function: CreateReceiptForm
// Date: 8/13/25
// Adapted from canvas: "Exploration - Implementing CUD operations in your app "
// Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25664628
// changed parameters/props passed in, form fields, route for fetch to match our data base attributes instead of bsg people attributes


import React, { useState } from 'react';

const CreateReceiptForm = ({ customers, backendURL, refreshData }) => {
    const [formData, setFormData] = useState({
        create_receipt_dateTime: '',
        create_receipt_firstName: '',
        create_receipt_lastName: '',
        

        
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };



    // Citation for the following function: handleFirstNameChange
    // Date: 8/13/25
    // Copied from copilot:
    // Source URL: https://copilot.microsoft.com/chats/5hDxFGTiVeAx3seyxVsE6
    // queried to find out how to autopopulate last name when first name is selected
    // first gave us overcomplicated select adaptation then asked for simpler way with form

    const handleFirstNameChange = (e) => {
        const firstName = e.target.value;
        const match = customers.find(c => c.firstName === firstName) || {};
        setFormData({
          create_receipt_firstName: firstName,
          create_receipt_lastName: match.lastName || ''
        });
      };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            const response = await fetch(backendURL + '/receipt/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log("Receipt created successfully.");
                refreshData();
            } else {
                console.error("Error creating receipt.");
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <>
        <h2>Create a Receipt</h2>

        <form className='cuForm' onSubmit={handleSubmit}>
            

            <label htmlFor="create_receipt_firstName">Customer First Name: </label>
            <select
                name="create_receipt_firstName"
                id="create_receipt_firstName"
                value={formData.create_receipt_firstName}
                onChange={handleFirstNameChange}
            >
             <option value="">Select a customer first name</option>
             {customers.map(c => (
                <option key = {c.firstName} value = {c.firstName}>
                    {c.firstName}
                </option>
             ))}
             
             </select>

             {/* Citation for the following line: readOnly
                 Date: 8/13/25
                 Adapted from copilot:
                 Source URL: https://copilot.microsoft.com/chats/5hDxFGTiVeAx3seyxVsE6
                 first gave us overcomplicated select adaptation then asked for simpler way with form
                 line 102 readOnly 
            */}

             <label htmlFor='create_receipt_lastName'>Customer Last Name</label>
             <input
                id = " create_receipt_lastName"
                value = {formData.create_receipt_lastName}
                readOnly
             />
           
        
            <label htmlFor="create_receipt_dateTime">Date & Time: </label>
            <input
                type="date"
                name="create_receipt_dateTime"
                id="create_receipt_dateTime"
                value={formData.create_receipt_dateTime}
                onChange={handleChange}
            />

            <input type="submit" />


        </form>
        </>
    );
};

export default CreateReceiptForm;