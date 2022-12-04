/*
Author: Jyoshnapriya Buddhi
Date: 11/29/2022
Description: Controller for loans and has different functions to create and get loans, display user specific loans and display pages.
*/
const Loan = require('./../models/loanModel');
const APIFeatures = require('./../databaseManager/loanDbContext');

//get loanlist which are user specific
exports.loanlist =   async (req, res) => {
    try {
      // EXECUTE QUERY
      const features = new APIFeatures(Loan.find({"email":req.user.email}), req.query)//compare against email address
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const loans = await features.query; //store feautures in the query
      // res.status(200).json({// send response 200ok with length of query and loans data
      //   status: 'success',
      //   results: loans.length,
      //   data: {
      //     loans
      //   }
      // });
      console.log(req.user._id);
      res.render('loanlist', {loans})//render loanlist PUG file by passing loans attribute
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err
      });
    }
  };
  
  //retrieve all loans posted
  exports.getallloans =   async (req, res) => {
    try {
      // EXECUTE QUERY
      const features = new APIFeatures(Loan.find(), req.query) //find all loans
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const loans = await features.query; //store feature into loans 
  
      // SEND RESPONSE
      res.status(200).json({// send response 200ok with length of query and loans data
        status: 'success',
        results: loans.length,
        data: {
          loans
        }
      });
    } catch (err) {//display error
      res.status(404).json({
        status: 'fail',
        message: err
      });
    }
  };


//render create loan PUG file
exports.getloan = (req, res) => {
  res.status(200).render('createloan', {
    title: 'create new loan'
  });
};

//create a new loan and render landingPage
exports.createloan = async  (req, res) => {
    try {
  
      const newLoan = await Loan.create(req.body);//create a new loan
      // res.status(200).json({// send response 200ok with length of query and loans data
      //   status: 'success',
      //   results: newLoan.length,
      //   data: {
      //     newLoan
      //   }
      // });
      res.render('landingPage');//render landing page
    } catch (err) {
      res.status(400).json({//display error
        status: 'fail',
        message: err
      });
    }
  };
