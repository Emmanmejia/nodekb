const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Bring in models
let Product = require('../models/product');
let Purchase = require('../models/purchase');
let User = require('../models/user');
//Register form
router.get('/register', function(req, res){
  res.render('register.ejs', {
		page_name: 'register'
	});
});
// Register Process
router.post('/register', function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('register.ejs', {
      user: req.user,
      errors:errors,
      page_name: 'register'
    });
  } else {
    let newUser = new User({
      name:name,
      email:email,
      username:username,
      password:password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success', 'You are now registered and can log in');
            res.redirect('/users/login');
          }
        });
      });
    });
  }
});
// Login form
router.get('/login', function(req, res){
  if(req.isAuthenticated()){
		res.redirect('/');
	} else {
    res.render('login.ejs', {
      page_name: 'login'
    });
  }
});
// Login Process
router.post('/login', function(req, res, next){
  if(req.isAuthenticated()){
    res.redirect('/');
	} else {
    passport.authenticate('local', {
      successRedirect:'/',
      failureRedirect:'/users/login',
      failureFlash: true
    })(req, res, next);
  }
});

// logout
router.get('/logout', function(req, res){
  if(req.isAuthenticated()){
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
	} else {
    res.redirect('/');
  }
});

//Overview
router.get('/overview', ensureAuthenticated, ensureUser, function(req, res){
  res.render('user/user_overview.ejs', {
    title: 'Overview',
    page_name: 'overview'
  });
})

//plans
router.get('/plans', ensureAuthenticated, ensureUser, function(req, res){
  Purchase.find({}).populate('user_id').populate({path: 'product_id', populate: {path: 'merchant'}}).exec(function(err, purchases){ //DEEP POPULATE
    res.render('user/user_plans.ejs', {
      purchases: purchases,
      title: 'Plans',
      page_name: 'plans'
    });
  });
})

//applications
router.get('/applications', ensureAuthenticated, ensureUser, function(req, res){
  res.render('user/user_applications.ejs', {
    title: 'Applications',
    page_name: 'applications'
  });
})

//profile
router.get('/profile', ensureAuthenticated, ensureUser, function(req, res){
  res.render('user/user_profile.ejs', {
    title: 'Profile',
    page_name: 'profile'
  });
})

//documents
router.get('/documents', ensureAuthenticated, ensureUser, function(req, res){
  res.render('user/user_documents.ejs', {
    title: 'Documents',
    page_name: 'documents'
  });
})

//notifications
router.get('/notifications', ensureAuthenticated, ensureUser, function(req, res){
  res.render('user/user_notifications.ejs', {
    title: 'Notifications',
    page_name: 'notifications'
  });
})

//Access Controls
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('danger', 'Please login');
		res.redirect('/users/login');
	}
}

function ensureUser(req, res, next){
	if((req.user.is_merchant == false) && (req.user.is_admin == false)) {
		return next();
	} else {
		req.flash('danger', 'Access Denied');
		res.redirect('/');
	}
}

module.exports = router;
