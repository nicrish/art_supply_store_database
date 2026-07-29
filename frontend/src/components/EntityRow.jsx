
import DeleteProductReceiptForm from "../pages/DeleteProductReceiptForm"



function EntityRow({rowObject, backendURL, refreshData, showDelete }){
    return (
        <tr>
            {Object.values(rowObject).map((value, index)=>
            (
                <td key = {index}>{value}</td>
                
            ))}{showDelete && (
                 <DeleteProductReceiptForm 
                    rowObject = {rowObject} 
                    backendURL={backendURL} 
                    refreshData={refreshData}
                   />
                )}
        </tr>
        
        
    )
}

export default EntityRow