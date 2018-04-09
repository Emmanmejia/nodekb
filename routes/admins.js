const express = require('express');
const router = express.Router();
// Bring in Product model
let Product = require('../models/product');
let Purchase = require('../models/purchase');
let User = require('../models/user');

// dashboard
router.get('/dashboard', ensureAuthenticated, ensureAdmin, function(req, res){
	res.render('admin/admin_dashboard.ejs', { //ADMIN PATH
		page_name: 'dashboard'
	});
});
// ALL PRODUCTS
router.get('/products', ensureAuthenticated, ensureAdmin, function(req, res){
	Product.find({}).populate('merchant').exec(function(err, products){
		res.render('admin/admin_products.ejs', {
			products: products,
			title: 'Product List',
			page_name: 'products'
		});
	});
});
// ALL USERS
router.get('/users', ensureAuthenticated, ensureAdmin, function(req, res){
	User.find({}, function(err, users){
		res.render('admin/admin_users.ejs', {
			users: users,
			title: 'User List',
			page_name: 'users'
		});
	});
});
// ALL ORDERS
router.get('/orders', ensureAuthenticated, ensureAdmin, function(req, res){
	Purchase.find({}).populate('user_id').populate({path: 'product_id', populate: {path: 'merchant'}}).exec(function(err, purchases){
		res.render('admin/admin_orders.ejs', {
			purchases: purchases,
			title: 'Orders List',
			page_name: 'orders'
		});
	});
});
// MAILBOX
router.get('/mailbox', ensureAuthenticated, ensureAdmin, function(req, res){
	res.render('admin/admin_mailbox.ejs', {
		title: 'Mailbox',
		page_name: 'mailbox'
	});
});
// ADD PRODUCT -- MODAL
// POST NEW PRODUCT
router.post('/products/add', ensureAuthenticated, ensureAdmin, function(req,res){
	req.checkBody('name','Name is required').notEmpty();
	req.checkBody('description','Description is required').notEmpty();
	req.checkBody('type','Type is required').notEmpty();
	req.checkBody('merchant','Merchant is required').notEmpty();
	req.checkBody('price','Price is required').notEmpty();

	// Get errors
	let errors = req.validationErrors();

	if(errors){
		Product.find({}).populate('merchant').exec(function(err, products){
			res.render('admin/admin_products.ejs', {
				user: req.user,
				products: products,
				title: 'Product List',
				errors: errors,
				page_name: 'products'
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
				res.redirect('/admins/products');
			}
		});
	}
});
// EDIT PRODUCT
router.get('/products/edit/:id', ensureAuthenticated, ensureAdmin, function(req, res){
	Product.findById(req.params.id,function(err, product){
		res.render('admin/admin_edit_product.ejs', {
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
			res.render('admin/admin_edit_product.ejs', {
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
			res.redirect('/admins/products');
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

function ensureAdmin(req, res, next){
	if(req.user.is_admin == true) {
		return next();
	} else {
		req.flash('danger', 'Access Denied');
		res.redirect('/');
	}
}
module.exports = router;
