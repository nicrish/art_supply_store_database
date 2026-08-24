
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
