// Citation for the following function: EntityRow
// Date: 8/13/25
// Adapted from canvas: "Exploration - Web Application Technology-React"
// Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-web-application-technology-2?module_item_id=25664612
// used source code as a template filled in our own props showDelete is our own prop created to display delete button only for entities
// that we have delete enpoints for other entities still receive this prop but for those with no delete endpoint it is set to false

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