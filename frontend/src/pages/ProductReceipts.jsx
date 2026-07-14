// Citation for the following page/component/function: ProductReceipts
// Date: 8/13/25
// Adapted from canvas: "Exploration - Web Application Technology-React"
// Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-web-application-technology-2?module_item_id=25664612
// used bsg entity page creation as a template and filled in our table, attribute, and variable names


import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import EntityRow from '../components/EntityRow';
import { header } from 'express-validator';
import UpdateProductReceipts from './UpdateProductReceipts';
import CreateProductReceipt from './CreateProductReceipts';
import ResetButton from './ResetButton';
import UpdateProductReceiptForm from './UpdateProductReceipts';

function ProductReceipts({backendURL}){
    const [productreceipts, setProductreceipts] = useState([])
    const [products, setProducts] = useState([])
    const [receipts, setReceipts] = useState([])

    const getData = async function(){
        try{
            const response = await fetch(backendURL + '/productreceipts')
            const {productreceipts, products, receipts} = await response.json()
            console.log(productreceipts)

            setProductreceipts(productreceipts)
            setProducts(products)
            setReceipts(receipts)

        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        getData()
    }, [])

    return (
        <div className="page-layout">
            <h1>Product Receipts</h1>
            <ResetButton backendURL={backendURL} refreshData ={getData}/>
            <table>
                <thead>
                    <tr>
                        {productreceipts.length > 0 && Object.keys(productreceipts[0]).map((key) => (
                            <th>{key}</th>
                        ))} 
                        
                    </tr>
                </thead>
                <tbody>
                    {productreceipts.map((productreceipt, index)=>(
                       <EntityRow 
                        key={index} 
                        rowObject = {productreceipt} 
                        backendURL = {backendURL} 
                        refreshData= {getData}
                        showDelete={true}/>
                    ))}
                    

                </tbody>
            </table>
            <div className = "forms-wrapper">
                <UpdateProductReceiptForm 
                    productreceipts={productreceipts}
                    products = {products} 
                    receipts = {receipts}
                    backendURL={backendURL}
                    refreshData={getData}
                />
                <CreateProductReceipt
                    receipts = {receipts}
                    products = {products}
                    productreceipts={productreceipts}
                    backendURL={backendURL}
                    refreshData={getData}
                />

            </div>
            
        
        
        
        </div>
        
    )

}
export default ProductReceipts;