


import { useState } from 'react'
import { Route, Routes} from 'react-router-dom'
import './App.css'
import Navigation from './components/Navigation'
import Customers from './pages/Customers'
import Products from './pages/Products'
import ProductReceipts from './pages/ProductReceipts'
import Receipts from './pages/Receipts'
import Orders from './pages/Orders'
import Manufacturers from './pages/Manufacturers'
import Home from './pages/Home'


// Define the backend port and URL for API requests
const backendPort = 2124;  // Use the port you assigned to the backend server, this would normally go in a .env file
//const backendURL = `http://classwork.engr.oregonstate.edu:${backendPort}`;
const backendURL = `http://localhost:${backendPort}`;

function App() {
  

  return (
    <div className = "app">
        <header>
          <Navigation/>
        </header>
        <main>
        <Routes>
        <Route path = "/" element = {<Home/>}></Route>
          <Route path = "/customers" element = {<Customers backendURL={backendURL}/>}></Route>
          <Route path = "/manufacturers" element = {<Manufacturers backendURL={backendURL}/>}></Route>
          <Route path = "/products" element = {<Products backendURL={backendURL}/>}></Route>
          <Route path = "/productreceipts" element = {<ProductReceipts backendURL={backendURL}/>}></Route>
          <Route path = "/receipts" element = {<Receipts backendURL={backendURL}/>}></Route>
          <Route path = "/orders" element = {<Orders backendURL={backendURL}/>}></Route>
        </Routes>
        </main>
    </div>
  )
}

export default App
