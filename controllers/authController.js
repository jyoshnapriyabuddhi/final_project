/*
Author: Jyoshnapriya Buddhi
Date: 11/29/2022
Description: Controller for authorization and has different functions to create and send tokens, 
              auth for login and signup, protect the url from unauthorized access.
*/
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError= require('./../utils/appError');
const {promisify} = require('util');

//sign the request with jwt secret
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

//create send token 
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = { //cookie options
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions); //create cookie with auth headers for request

  // Remove password from output
  user.password = undefined;
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     token:token,
  //     user
  //   }});

};

//create a new user and sign the request
exports.signup = async (req, res, next) => {
  const newUser = await User.create({ //create new user with user schema defined.
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  
  createSendToken(newUser, 201, res); //sign request with token
  res.render('landingPage',{//render landingPage PUG file
    user: newUser,
    authenticated: true
  });
};

//auth for login
exports.login = async (req, res, next) => {
  const { email, password } = req.body; //get email and password from request body.

  if (!email || !password) { //check if fields are missing
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password'); //find user with specified email address
  if(!user || !(await user.correctPassword(password, user.password))){ //decode token and check password
    return next(new AppError('Incorrect email or password', 401))
}
  createSendToken(user, 200, res);
  res.render('landingPage',{ //render landingPage PUG file
    user
  })

};

//protect the url against unauthorized access 

exports.protect = async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer') //check for headers of request.
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt; //extract jwt and store in token
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id); //check the token against secret
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError('User recently changed password! Please log in again.', 401)
  //   );
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
};

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};


