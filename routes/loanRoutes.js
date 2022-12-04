/*
Author: Jyoshnapriya Buddhi
Date: 11/29/2022
Description: Define loan routes.
*/
const express = require('express');
const loanController = require('../controllers/loanController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/loanlist', authController.protect, loanController.loanlist) ;


router.get('/loan', authController.protect, loanController.getloan);
router.post('/loan',authController.protect, loanController.createloan);

router.get('/allloans', loanController.getallloans)

module.exports = router;
