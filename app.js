require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { log, error } = require('console');
const Joi=require('joi');
const nodemailer=require('nodemailer');

const app = express();
app.use(bodyParser.json());

// Establish the data
const db = require('./config/database');

// Establish the data
const AdminRoute= require('./routes/AdminRoute');
app.use('/api/User_Details',AdminRoute);
app.use('/api/Category',AdminRoute);
app.use('/api/Sub_Category',AdminRoute);
app.use('/api/Product',AdminRoute);
app.use('/api',AdminRoute)

    const port = process.env.PORT;
app.listen(port, (error) => {
    if (error) 
    
    {
    console.log("Error....dddd!!!!");
    }

    else 
    {
        console.log("Started....!!!! 8091");

    }
});