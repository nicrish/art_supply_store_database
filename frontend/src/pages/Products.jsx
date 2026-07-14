// Citation for the following page/component/function: Products
// Date: 8/13/25
// Adapted from canvas: "Exploration - Web Application Technology-React"
// Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-web-application-technology-2?module_item_id=25664612
// used bsg entity page creation as a template and filled in our table, attribute, and variable names



import { useState, useEffect } from 'react';  // Importing useState for managing state in the component
import EntityRow from '../components/EntityRow';
import { header } from 'express-validator';
import CreateProductForm from '../components/CreateProduct';
import UpdateProductForm from '../components/UpdateProduct';
import DeleteProductForm from './DeleteProductForm'
import ResetButton from './ResetButton';

function Products({backendURL}){
    const [products, setProducts] = useState([])
    const [manufacturers, setManufacturers] = useState([])

    const getData = async function(){
        try{
            const response = await fetch(backendURL + '/products')
            const {products, manufacturers} = await response.json()
            console.log(products)

            setProducts(products)
            setManufacturers(manufacturers)

        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        getData()
    }, [])

    return (
        <div className="page-layout">
            <h1>Products</h1>
            <ResetButton backendURL={backendURL} refreshData ={getData}/>
            <table>
                <thead>
                    <tr>
                        {products.length > 0 && Object.keys(products[0]).map((key) => (
                            <th>{key}</th>
                        ))} 
                        
                    </tr>
                </thead>
                <tbody>
                    {products.map((products, index)=>(
                       <EntityRow 
                            key={index} 
                            rowObject = {products} 
                            backendURL = {backendURL} 
                            refreshData = {getData}
                            showDelete={false}/>
                    ))}

                </tbody>
            </table>
            <CreateProductForm 
                    manufacturers={manufacturers}
                    products ={products}
                    backendURL={backendURL}
                    refreshData={getData}/>
            <UpdateProductForm
                manufacturers={manufacturers}
                products ={products}
                backendURL={backendURL}
                refreshData={getData}
            />
        
        
        
        </div>
        
    )

}
export default Products