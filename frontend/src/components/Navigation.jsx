// Citation for the following function: Navigation
// Date: 8/13/25
// Adapted from canvas: "Exploration - Web Application Technology-React"
// Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-web-application-technology-2?module_item_id=25664612
// changed routes and names to match our databases entities


function Navigation(){
    return (
        <nav>
            <a href="/">Home</a>
            <a href="/customers">Customers</a>
            <a href="/manufacturers">Manufacturers </a>
            <a href="/orders">Orders</a>
            <a href="/productreceipts">Product Receipts </a>
            <a href="/products">Products</a>
            <a href="/receipts">Receipts</a>
            
        </nav>
    )

}

export default Navigation