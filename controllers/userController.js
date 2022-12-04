/*
Author: Jyoshnapriya Buddhi
Date: 11/29/2022
Description: Controller for users and has different functions to display home page login and signup form, create and get users.
*/
const User = require('./../models/userModel');
const APIFeatures = require('../databaseManager/loanDbContext.JS');

//render home page
exports.getLandingPAge = async (req, res) => {
  res.status(200).render('home', {title: `home page`});
};

//render signup form
exports.getSignInForm = (req, res) => {
  res.status(200).render('SignUpForm', {
    title: `get signup form`
  });
};

//render login form
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'get login form'
  });
};

//get all users
exports.getusers =   async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(User.find(), req.query) 
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const users = await features.query; //store features in the query

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (err) {
    res.status(404).json({ //display error
      status: 'fail',
      message: err
    });
  }
};