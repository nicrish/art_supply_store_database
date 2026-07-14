// Citation for the following function: DeleteProductForm
// Date: 8/13/25
// Adapted from canvas: "Exploration - Implementing CUD operations in your app "
// Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=25664628
// used the delete form as a template removed information props we did not need and used our own


const DeleteProductForm = ({rowObject, backendURL, refreshData }) => {
    const rowID = rowObject.productID

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = {
            delete_product_id: rowID
        }
        try {
            console.log('Backend URL:', backendURL)

            const response = await fetch(backendURL + '/products/delete', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            }) 
            if(response.ok) {
                console.log("Product deleted")
                refreshData()
            }else{
                console.error("Error during deletion")
            }
        }catch(error){
            console.error('Error during form submission:', error)
        }
    }
    return(
        <td>
            <form onSubmit = {handleSubmit}>
                <button type = 'submit'>
                    Delete
                </button>
            </form>

        </td>
    )
}

export default DeleteProductForm