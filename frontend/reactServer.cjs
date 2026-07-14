// Citation for the following module: reactServer.cjs
// Date: 8/13/25
// copied from canvas: "Exploration - Web Application Technology-React"
// Source URL: https://canvas.oregonstate.edu/courses/2007765/pages/exploration-web-application-technology-2?module_item_id=25664612
// copied from given source but changed port number



const express = require('express')
const path = require('path')
const app = express()
app.use(express.static(path.join(__dirname, 'dist')))

const PORT = 5356

//ROUTE HANDLERS

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// ########################################
// ########## LISTENER

app.listen(PORT, () => {
    console.log(`Server running: http://classwork.engr.oregonstate.edu:${PORT}...`);
});
