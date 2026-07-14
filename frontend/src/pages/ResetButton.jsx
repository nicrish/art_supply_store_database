// Citation for the following page/component/function: Receipts
// Date: 8/13/25
// based on canvas: "Project Step 4 Draft Version: Add RESET stored procedure (SP) and SELECTs for all entities "
// Source URL: https://canvas.oregonstate.edu/courses/2007765/assignments/10118885?module_item_id=25664632
// we looked at the example from the given assignment page and the CUD Examples page to write the fetch request

const ResetButton = ({backendURL, refreshData}) => {
   

    const handleSubmit = async (e) => {
        e.preventDefault()
     
        try {
            console.log('Backend URL:', backendURL)

            console.log(backendURL + '/reset')

            const response = await fetch(backendURL + '/reset', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
            }) 
            if(response.ok) {
                console.log("Product receipts reset")
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
            
                <button onClick = {handleSubmit}>
                    Reset Data
                </button>

        </td>
    )
}

export default ResetButton
