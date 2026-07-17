// Citation for the following function: Navigation
// Date: 8/13/25
// Adapted from canvas: "Exploration - Web Application Technology-React"
// Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-web-application-technology-2?module_item_id=25664612
// changed routes and names to match our databases entities


function Navigation(){
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/customers">Customers</Link>
            <Link to="/manufacturers">Manufacturers </Link>
            <Link to="/orders">Orders</Link>
            <Link to="/productreceipts">Product Receipts </Link>
            <Link to="/products">Products</Link>
            <Link to="/receipts">Receipts</Link>
            
        </nav>
    )

}

export default Navigation