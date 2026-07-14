// Citation for the following function: Customers
// Date: 8/13/25
// Adapted from canvas: "Exploration - Web Application Technology-React"
// Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-web-application-technology-2?module_item_id=25664612
// used bsg entity page creation as a template and filled in our table, attribute, and variable names


import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import EntityRow from '../components/EntityRow';
import { header } from 'express-validator';

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
            <table>
                <thead>
                    <tr>
                        {customers.length > 0 && Object.keys(customers[0]).map((key) => (
                            <th>{key}</th>
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
                        showDelete={false}/>
                    ))}

                </tbody>
            </table>
        
        
        
        </div>
        
    )

}
export default Customers