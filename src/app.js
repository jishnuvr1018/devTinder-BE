const express = require("express");
const app = express();

app.use((req, res) => {
    res.send("Hello Server")  
})

app.listen(7777, () => {
    console.log("Server running on port 7777.....")
})