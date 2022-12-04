/*
Author: Jyoshnapriya Buddhi
Date: 11/29/2022
Description: Define main driver file for the project.
*/
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const pug = require('pug');
var bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');



const userRouter = require('./routes/userRoutes');//set user routes
const loanRouter = require('./routes/loanRoutes');//set loan routes


const app = express();

//set view engine to pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cookieParser())


app.use((req, res, next) => {
  console.log('hello from middlewear');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/', userRouter);
app.use('/',loanRouter);


module.exports = app;
