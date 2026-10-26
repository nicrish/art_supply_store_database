import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import EntityRow from '../components/EntityRow';

import CreateOrder from './CreateOrder'
import UpdateOrder from './UpdateOrder'

function Orders({backendURL}){
    const [orders, setOrders] = useState([])
    const [products, setProducts] = useState([])

    const getData = async function(){
        try{
            const response = await fetch(backendURL + '/orders')
            const {orders, products} = await response.json()
            console.log(orders)

            setOrders(orders)
            setProducts(products)

        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        getData()
    }, [])

    return (
        <div className="page-layout">
            <h1>Orders</h1>
            <table>
                <thead>
                    <tr>
                        {orders.length > 0 && Object.keys(orders[0]).map((key) => (
                            <th key={key}>{key}</th>
                        ))} 
                        
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index)=>(
                       <EntityRow 
                            key={index} 
                            rowObject = {order} 
                            backendURL = {backendURL} 
                            refreshData = {getData}
                            showDelete={false}/>
                    ))}

                </tbody>
            </table>
            <CreateOrder products={products} backendURL={backendURL} refreshData={getData} />
            <UpdateOrder orders={orders} products={products} backendURL={backendURL} refreshData={getData} />
        
        
        
        </div>
        
    )

}
export default Orders