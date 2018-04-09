const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Bring in models
let Product = require('../models/product');
let Purchase = require('../models/purchase');
let User = require('../models/user');

//Overview
router.get('/overview', ensureAuthenticated, ensureMerchant, function(req, res){
  res.render('merchant/merchant_overview.ejs', {
    title: 'Overview',
    page_name: 'overview'
  });
})

//products
router.get('/products', ensureAuthenticated, ensureMerchant, function(req, res){
    Product.find({}).populate('merchant').exec(function(err, products){ //DEEP POPULATE
      res.render('merchant/merchant_products.ejs', {
        title: 'Products',
        page_name: 'products',
        products: products
      });
  });
})

//profile
router.get('/profile', ensureAuthenticated, ensureMerchant, function(req, res){
    res.render('merchant/merchant_profile.ejs', {
      title: 'Profile',
      page_name: 'profile'
    });
  })

// ADD PRODUCT -- MODALIZED

// POST NEW PRODUCT
router.post('/products/add', ensureAuthenticated, ensureMerchant, function(req,res){
	req.checkBody('name','Name is required').notEmpty();
	req.checkBody('description','Description is required').notEmpty();
	req.checkBody('type','Type is required').notEmpty();
	req.checkBody('merchant','Merchant is required').notEmpty();
	req.checkBody('price','Price is required').notEmpty();

	// Get errors
	let errors = req.validationErrors();

	if(errors){

		Product.find({}).populate('merchant').exec(function(err, products){ //DEEP POPULATE
				res.render('merchant/merchant_products.ejs', {
					title: 'Products',
					page_name: 'products',
					products: products,
					errors: errors,
					user: req.user
				});
		});
	} else {
		let product = new Product();
		product.name = req.body.name;
		product.description = req.body.description;
		product.type = req.body.type;
		product.merchant = req.body.merchant;
		product.price = req.body.price;


		product.save(function(err){
			if(err){
				console.log(err);
				return;
			} else {
				req.flash('success','Product Added')
				res.redirect('/merchants/products');
			}
		});
	}
});

// EDIT PRODUCT
router.get('/products/edit/:id', ensureAuthenticated, ensureMerchant, function(req, res){
	Product.findById(req.params.id,function(err, product){
		res.render('merchant/merchant_edit_product.ejs', {
			title: 'Edit Product',
			product:product,
			page_name: 'products'
		});
	});
});
// POST UPDATED PRODUCT
router.post('/products/edit/:id', function(req,res){
	req.checkBody('name','Name is required').notEmpty();
	req.checkBody('description','Description is required').notEmpty();
	req.checkBody('type','Type is required').notEmpty();
	req.checkBody('merchant','Merchant is required').notEmpty();
	req.checkBody('price','Price is required').notEmpty();
  
	// Get errors
	let errors = req.validationErrors();
  
	if(errors){
	  Product.findById(req.params.id,function(err, product){
			res.render('merchant/merchant_edit_product.ejs', {
				user: req.user,
				title: 'Edit Product',
				product:product,
				errors: errors,
				page_name: 'products'
			});
		});
	} else {
		let product = {};
		product.name = req.body.name;
		product.description = req.body.description;
		product.type = req.body.type;
		product.merchant = req.body.merchant;
		product.price = req.body.price;
  
		let query = {_id:req.params.id}
  
		Product.update(query, product, function(err){
		  if(err){
			console.log(err);
			return;
		  } else {
			req.flash('success', 'Product Updated');
			res.redirect('/merchants/products');
		  }
		});
	}
});

// ACCESS CONTROLS - add to any route you want to protect
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('danger', 'Please login');
		res.redirect('/users/login');
	}
}

function ensureMerchant(req, res, next){
	if(req.user.is_merchant == true) {
		return next();
	} else {
		req.flash('danger', 'Access Denied');
		res.redirect('/');
	}
}

module.exports = router;
