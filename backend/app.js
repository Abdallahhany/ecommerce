const express = require('express');
const app = express();
const errorMiddleware = require('./middelwares/errors');
const cookieParser = require('cookie-parser');
// const dotenv = require('dotenv');
//setting up config files
if(process.env.NODE_ENV === 'PRODUCTION') require('dotenv').config({path: 'backend/config/config.env'})
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const path = require("path");




app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());
app.use(fileUpload());




//import all routes
const products = require('./routes/product_routes');
const auth = require('./routes/auth_routes');
const order = require('./routes/order_routes');
const payment = require('./routes/payment_routes');


// Product Route
app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1', order);
app.use('/api/v1', payment);

if(process.env.NODE_ENV === 'PRODUCTION'){
    app.use(express.static(path.join(__dirname,'../frontend/build')));

    app.get('*',(req, res) => {
        res.sendFile(path.resolve(__dirname,'../frontend/build/index.html'))
    })
}


// Middleware to error
app.use(errorMiddleware);

module.exports = app;