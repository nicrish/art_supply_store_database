// Citation for the following page/component/function: Receipts
// Date: 8/13/25
// Adapted from canvas: "Exploration - Web Application Technology-React"
// Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-web-application-technology-2?module_item_id=25664612
// used bsg entity page creation as a template and filled in our table, attribute, and variable names


import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import EntityRow from '../components/EntityRow';
import { header } from 'express-validator';
import CreateReceiptForm from '../components/CreateReceipt';
import ResetButton from './ResetButton';

function Receipts({backendURL}){
    const [receipts, setReceipts] = useState([])
    const [customers, setCustomers] = useState([])

    const getData = async function(){
        try{
            const response = await fetch(backendURL + '/receipts')
            const {receipts, customers} = await response.json()
            console.log(receipts)

            setReceipts(receipts)
            setCustomers(customers)


        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        getData()
    }, [])

    return (
        <div className="page-layout">
            <h1>Receipts</h1>
            <ResetButton backendURL={backendURL} refreshData ={getData}/>
            <table>
                <thead>
                    <tr>
                        {receipts.length > 0 && Object.keys(receipts[0]).map((key) => (
                            <th>{key}</th>
                    
                        ))} 
                        
                    </tr>
                </thead>
                <tbody>
                    {receipts.map((receipt, index)=>(
                       <EntityRow 
                            key={index} 
                            rowObject = {receipt} 
                            backendURL = {backendURL} 
                            refreshData = {getData}
                            showDelete={false}/>
                    ))}

                </tbody>
            </table>
            <CreateReceiptForm
                customers={customers}
                receipts ={receipts}
                backendURL={backendURL}
                refreshData={getData}
            
            />
        
        </div>
        
    )

} export default Receipts