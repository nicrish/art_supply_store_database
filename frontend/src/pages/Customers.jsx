import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import EntityRow from '../components/EntityRow';
import { header } from 'express-validator';

import ResetButton from './ResetButton';
import UpdateCustomer from './UpdateCustomer';
import CreateCustomer from './CreateCustomer';

function Customers({backendURL}){
    const [customers, setCustomers] = useState([])

    const getData = async function(){
        try{
            const response = await fetch(backendURL + '/customers')
            const {customers} = await response.json()
            console.log(customers)

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
            <h1>Customers</h1>
            <ResetButton backendURL={backendURL} refreshData ={getData}/>
            <table>
                <thead>
                    <tr>
                        {customers.length > 0 && Object.keys(customers[0]).map((key) => (
                            <th key={key}>{key}</th>
                        ))} 
                        
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer, index)=>(
                       <EntityRow 
                        key={index} 
                        rowObject = {customer} 
                        backendURL = {backendURL} 
                        refreshData = {getData}
                        deleteConfig={{
                            idKey: 'customerID',
                            endpoint: '/customer/delete',
                            bodyKey: 'delete_customer_id',
                            confirmMessage: 'Delete this customer?'
                        }}
                        />
                    ))}

                </tbody>
            </table>
            <CreateCustomer
                backendURL={backendURL}
                refreshData={getData}
            
            />
            <UpdateCustomer
                customers={customers}
                backendURL={backendURL}
                refreshData={getData}
            
            />
        
        
        
        </div>
        
    )

}
export default Customers