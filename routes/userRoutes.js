/*
Author: Jyoshnapriya Buddhi
Date: 11/29/2022
Description: Define user routes.
*/
const express = require('express');
const viewsController = require('../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
.get('/',viewsController.getLandingPAge);

router
.get('/login',viewsController.getLoginForm)
.post('/login',authController.login);

router
.get('/signUp',viewsController.getSignInForm)
.post('/signUp',authController.signup);


router
.get('/users', viewsController.getusers)
module.exports = router;
