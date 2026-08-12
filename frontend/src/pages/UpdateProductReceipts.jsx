

import React, {useState} from 'react'

const UpdateProductReceiptForm = ({ productreceipts, products, receipts, backendURL, refreshData}) => {
    
        const [formData, setFormData] = useState({
            productReceiptID: '',
            quantity: '',
            productID: '',
            receiptID: ''

         
        })
        const [statusMessage, setStatusMessage] = useState('');
    
        const handleChange = (e) => {
            const {name, value} = e.target
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }))
        }
    
        const handleSubmit = async (e) => {
            e.preventDefault()
        
            try{
                const response = await fetch(backendURL + '/productreceipts/update', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(formData)
                })
                if(response.ok){
                    alert("Successfully updated product receipt")
                    console.log("product receipt updated successfully")
                    setStatusMessage('Product receipt updated successfully!');
                    refreshData();
                    
                }else{
                    console.error("Error updating product receipt")
                    setStatusMessage('Error updating product receipt. Please check your inputs and try again.');
                }
            }catch(error){
                console.error('Error during form submission:', error)
            }
        }
    

    return (
        <>
        <h2>Update a Product Receipt</h2>


        {statusMessage && <p>{statusMessage}</p>}


        <form className='cuForm' onSubmit={handleSubmit}>
            <label htmlFor="productReceiptID">Product Receipt to Update: </label>
            <select
                name="productReceiptID"
                id="productReceiptID"
                value ={formData.productReceiptID}
                onChange={handleChange}
            >
                <option value="">Select a Product Receipt</option>
                {productreceipts.map((pr) => (
                    <option key={pr.productReceiptID} value={pr.productReceiptID}>
                        Product Receipt - {pr.productReceiptID} {pr.productID}
                    </option>
                ))}
            </select>


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
                value ={formData.productID}
                onChange={handleChange}
            >
                <option value="">Select a Product</option>
                {products.map((p) => (
                    <option key={p.productID} value={p.productID}>
                        {p.productID} - {p.productName}
                    </option>
                ))}
            </select>

            
            <label htmlFor="receiptID">Receipt: </label>
            <select
                name="receiptID"
                id="receiptID"
                value ={formData.receiptID}
                onChange={handleChange}
            >
                <option value="">Select a Receipt</option>
                {receipts.map((r) => (
                    <option key={r.receiptID} value={r.receiptID}>
                        {r.receiptID} - {r.dateTime}
                    </option>
                ))}
            </select>

            <input type="submit" />
        </form>
        </>
    );
};

export default UpdateProductReceiptForm;