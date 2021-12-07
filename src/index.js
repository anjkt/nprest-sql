require("dotenv").config();

//Import Packages
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');

//Importing-ErrorHandler
const handleErrors = require('./api/middlewares/error/handleErrors');

//Initialize Express
const app = express();

//import Route - Views 
const router = require("./api/routes/routes");

//middlewares 
// 1. Cross Origin 
app.use(cors({
    origin: 'http://testwebsite.com',
    credentials: true
}));

// 2. Json Parser 
app.use(express.json());

// 3. Cookie Parser 
app.use(cookieParser());

// 4. Router 
app.use("/api/v1/", router);

//HealthCheck Route
app.use("/health", (req, res) => {
    res.send("API Running");
});

// 5. ErrorHandler 
app.use(handleErrors);

//Server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log("server up and running on PORT :", port);
});