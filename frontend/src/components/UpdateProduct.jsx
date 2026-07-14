// Citation for the following function: UpdateProductForm
// Date: 8/13/25
// Adapted from canvas: "Exploration - Implementing CUD operations in your app "
// Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25664628
// changed parameters/props passed in, form fields, route for fetch to match our data base attributes instead of bsg people attributes

import React, {useState} from 'react'


const UpdateProductForm = ({products, manufacturers, backendURL, refreshData }) => {
    const [formData, setFormData] = useState({
        productID: '',
        productName: '',
        price: '',
        sellPrice: '',
        newProduct: '',
        firstDateOrdered: '',
        manufacturerID: ''
    })


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
            const response = await fetch(backendURL + '/product/update', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            })
            if(response.ok){
                console.log("product updated successfully")
                refreshData()
            }else{
                console.error("Error updating product")
            }
        }catch(error){
            console.error('Error during form submission:', error)
        }
    }

    return (
        <>
            <h2>Update a Product</h2>
            <form className = 'cuForm' onSubmit = {handleSubmit}> 
            <label htmlFor='productID'>Product to Update: </label>
            <select
                name = "productID"
                id = "productID"
                value = {formData.productID}
                onChange = {handleChange}>

                    <option value="">Select a Product</option>
                    {products.map((product)=> (
                        <option key = {product.productID} value={product.productID}>
                            {product.productID}-{product.productName}
                        </option>
                    ))}

            </select>

            <label htmlFor="productName">Product Name: </label>
            <input
                type="text"
                name = "productName"
                id= "productName"
                value = {formData.productName}
                onChange = {handleChange}
            />

            <label htmlFor="price">Price: </label>
            <input
                type="number"
                name = "price"
                placeholder = "Enter dollar amount: 0.00"
                id= "price"
                value = {formData.price}
                onChange = {handleChange}
            />

            <label htmlFor="price">Sell Price: </label>
            <input
                type="number"
                name = "sellPrice"
                placeholder = "Enter dollar amount: 0.00"
                id= "sellPrice"
                value = {formData.sellPrice}
                onChange = {handleChange}
            />

            <label htmlFor="newProduct">New Product (0 or 1): </label>
            <select 
                name = "newProduct"
                id = "newProduct"
                value = {formData.newProduct}
                onChange={handleChange}
            >
                <option value = "">Select</option>
                <option value = "1">Yes</option>
                <option value = "0">No</option>
            </select>

            <label htmlFor="firstDateOrdered">First Date Ordered: </label>
            <input
                type="date"
                name = "firstDateOrdered"
                id= "firstDateOrdered"
                value = {formData.firstDateOrdered}
                onChange = {handleChange}
            />

            <label htmlFor='manufacturerID'>Manufacturer: </label>
            <select
                name = "manufacturerID"
                id = "manufacturerID"
                value = {formData.manufacturerID}
                onChange = {handleChange}>

                    <option value="">Select a Manufacturer</option>
                    {manufacturers.map((m)=> (
                        <option key = {m.manufacturerID} value={m.manufacturerID}>
                            {m.manufacturerID}-{m.name}
                        </option>
                    ))}
            </select>
            <input type="submit" />
        </form>
    </>
)}

export default UpdateProductForm