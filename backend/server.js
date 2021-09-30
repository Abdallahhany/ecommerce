const app = require('./app');
// const dotenv = require('dotenv');
const connectDB = require('./config/database');
const {v2: cloudinary} = require("cloudinary");

// Handle Uncaught Exception
process.on('uncaughtException', error => {
    console.log(`Error: ${error.stack}`)
    console.log('Shutting down the server due to Uncaught Exception');
    process.exit(1);
})


//setting up config files
if(process.env.NODE_ENV === 'PRODUCTION') require('dotenv').config({path: 'backend/config/config.env'})

// setting up cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//connecting to database
connectDB();

const server = app.listen(process.env.PORT, () => {
    console.log(`Connected To Port: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});
// Handle Unhandled Rejection
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`)
    console.log('Shutting down the server due to unhandled promise rejection')
    server.close(() => {
        process.exit(1);
    })
})