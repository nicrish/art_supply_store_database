
import DeleteRowButton from "./DeleteRowButton"



function EntityRow({rowObject, backendURL, refreshData, showDelete }){
    return (
        <tr>
            {Object.values(rowObject).map((value, index)=>
            (
                <td key = {index}>{value}</td>
                
            ))}
            {deleteConfig && (
                 <DeleteRowButton 
                    rowObject = {rowObject} 
                    backendURL={backendURL} 
                    refreshData={refreshData}
                    {...deleteConfig}
                   />
                )}
        </tr>
        
        
    )
}

export default EntityRow