//import express, express router as shown in lecture code
import {Router} from 'express';
const router = Router();
import {registerUser, loginUser} from '../data/users.js';
import userHelpers from '../helpers.js';

router.route('/').get(async (req, res) => {
  //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
  return res.json({error: 'YOU SHOULD NOT BE HERE!'});
});

router
  .route('/register')
  .get(async (req, res) => {
    try {
      return res.render('register');
    } catch (e) {
      return res.status(500).render('error', {
        error: 'GET/register',
        statusCode: 500,
        message: e instanceof TypeError ? 'Internal Server Error' : e});
    }
  })
  .post(async (req, res) => {

    try {
      const registerdUser = req.body;

      if (!registerdUser || Object.keys(registerdUser).length === 0) {
        return res.status(400).render('register', {
          error: true,
          statusCode: 400, 
          message: 'All fields must be filled'
        });
      }

      try {
        registerdUser.firstNameInput = userHelpers.nameHelper(registerdUser.firstNameInput, 'First Name');
        registerdUser.lastNameInput = userHelpers.nameHelper(registerdUser.lastNameInput, 'Last Name');
        registerdUser.emailAddressInput = userHelpers.emailHelper(registerdUser.emailAddressInput, 'Email');
        registerdUser.passwordInput = userHelpers.passwordHelper(registerdUser.passwordInput, 'Password');
        
        if (registerdUser.confirmPasswordInput !== registerdUser.passwordInput) {
          throw 'Password must match with the Input above'
        }

        registerdUser.roleInput = userHelpers.roleHelper(registerdUser.roleInput);

      } catch (e) {
        return res.status(400).render('register', {
          error: true,
          statusCode: 400,
          message: e});
      }

      const newUser = await registerUser(
        registerdUser.firstNameInput,
        registerdUser.lastNameInput,
        registerdUser.emailAddressInput,
        registerdUser.passwordInput,
        registerdUser.roleInput
      );
      
      if (newUser.insertedUser === true){
        return res.redirect('/login');
      } else {
        return res.status(500).render('register',{
          error: true,
          statusCode: 500,
          message:'User already in data base'});
      }

    } catch (e) {
      return res.status(500).render('error',{
        error: true,
        statusCode: 500,
        message: e instanceof TypeError ? 'Internal server error' : e});
    }

  });

router
  .route('/login')
  .get(async (req, res) => {
    try {
      return res.render('login');
    } catch (e) {
      return res.status(500).render('error', {
        error: 'GET/login',
        statusCode: 500,
        message: e instanceof TypeError ? 'Internal server error' : e});
    }
  })
  .post(async (req, res) => {
    try {
      const logedInUser = req.body;

      if (!logedInUser || Object.keys(logedInUser).length === 0) {
        return res.status(400).render('login', {
          error: true,
          statusCode: 400, 
          message: 'All fields must be filled'
        });
      }

    try {
      logedInUser.emailAddressInput = userHelpers.emailHelper(logedInUser.emailAddressInput, 'Email');
      logedInUser.passwordInput = userHelpers.passwordHelper(logedInUser.passwordInput, 'Password');
    } catch (e) {
      return res.status(400).render('login', {
        error: true,
        statusCode: 400,
        message: e});
    }

    const newUserLogin = await loginUser(
      logedInUser.emailAddressInput,
      logedInUser.passwordInput
    );

    if (newUserLogin === false) {
      return res.status(400).render('login', {
        error: true,
        statusCode: 400,
        message: 'Either the email address or password is invalid'});
    }

    req.session.user = newUserLogin;

    if (req.session.user.role === 'admin') {
      return res.redirect('/admin');
    } else if (req.session.user.role === 'user') {
      return res.redirect('/protected');
    }

    } catch (e) {
      return res.status(400).render('login', {
        error: true,
        statusCode: 400,
        message: e instanceof TypeError ? 'Internal Server Error' : e});
    }
  });

router.route('/protected').get(async (req, res) => {
  try{
    const user = req.session.user;

    if(user) {
      const currentTime = new Date().toUTCString();
    
      return res.render('protected', {
        firstName: user.firstName,
        lastName: user.lastName,
        currentTime,
        role: user.role,
        isAdmin: user.role === 'admin'
      });
    }
  } catch (e) {
    return res.status(500).render('error', {
      error: 'GET/protected',
      statusCode: 500,
      message: e instanceof TypeError ? 'Internal Server Error' : e});
  }
});

router.route('/admin').get(async (req, res) => {
  try{
    const user = req.session.user;

    if(user) {
      const currentTime = new Date().toUTCString();
    
      return res.render('admin', {
        firstName: user.firstName,
        lastName: user.lastName,
        currentTime,
        role: user.role,
        isAdmin: user.role === 'admin'
      });
    }
  } catch (e) {
    return res.status(500).render('error', {
      error: 'GET/admin',
      statusCode: 500,
      message: e instanceof TypeError ? 'Internal Server Error' : e});
  }
});

router.route('/error').get(async (req, res) => {
  try {
    return res.render('error');
  } catch (e) {
    return res.status(500).render('error', {
      error: 'GET/logoff',
      statusCode: 500,
      message: e instanceof TypeError ? 'Internal Server Error' : e});
  }
});

router.route('/logout').get(async (req, res) => {
  try {
    req.session.destroy();

    return res.render('logout');
  } catch (e) {
    return res.status(500).render('error', {
      error: 'GET/logoff',
      statusCode: 500,
      message: e instanceof TypeError ? 'Internal Server Error' : e});
  }
});

export default router;
