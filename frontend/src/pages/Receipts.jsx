import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import EntityRow from '../components/EntityRow';
import { header } from 'express-validator';

import ResetButton from './ResetButton';
import UpdateReceiptForm from './UpdateReceipts';
import CreateReceipt from './CreateReceipts';

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
            <CreateReceipt
                customers={customers}
                receipts ={receipts}
                backendURL={backendURL}
                refreshData={getData}
            
            />
            <UpdateReceiptForm
                customers={customers}
                receipts ={receipts}
                backendURL={backendURL}
                refreshData={getData}
            
            />
        
        </div>
        
    )

} export default Receipts