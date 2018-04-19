const express = require('express');
const router = express.Router();
// Bring in Product model
let Product = require('../models/product');
let Purchase = require('../models/purchase');
let User = require('../models/user');
// ALL PRODUCTS
router.get('/', function(req, res){
	Product.find({}).populate('merchant').exec(function(err, products){
		res.render('products.ejs', {
			products: products,
			title: 'Products',
			page_name: 'products'
		});
	});
})
// VIEW SINGLE PRODUCT
router.get('/:id',function(req, res){
	Product.findById(req.params.id).populate('merchant').exec(function(err, product){
		res.render('product.ejs', {
			product:product,
			page_name: 'products'
		});
	});
});
// CHECKOUT PRODUCT
router.get('/purchase/:id', ensureAuthenticated, ensureUser, function(req, res){
	Product.findById(req.params.id,function(err, product){
		res.render('purchase_product.ejs', {
			title: 'Checkout Form',
			product:product,
			page_name: 'products'
		});
	});
});
// POST TO PURCHASES DB
router.post('/purchase/:id', ensureAuthenticated, ensureUser, function(req,res){
	req.checkBody('user_id','User is required').notEmpty();
	req.checkBody('product_id','Product is required').notEmpty();
	req.checkBody('price','Price is required').notEmpty();
	req.checkBody('payment','Payment is required').notEmpty();

	// Get errors
	let errors = req.validationErrors();

	if(errors){
		Product.findById(req.params.id,function(err, product){
			  res.render('purchase_product.ejs', {
				  user: req.user,
				  title: 'Checkout Form',
				  product:product,
				  errors: errors
			  })
		  })
	} else {

		let purchase = new Purchase();
		purchase.user_id = req.body.user_id;
		purchase.product_id = req.body.product_id;
		purchase.price = req.body.price;
		purchase.payment = req.body.payment;

		purchase.save(function(err){
			if(err){
				console.log(err);
				return;
			} else {
				Product.update({_id:req.body.product_id}, {$push: {purchases: req.body.product_id}}, function(err){
					if(err){
					  console.log(err);
					  return;
					} else {
					  console.log("Updated product");
					}
				});
				User.update({_id:req.body.user_id}, {$push: {purchases: req.body.user_id}}, function(err){
					if(err){
					  console.log(err);
					  return;
					} else {
					  console.log("Updated User");
					}
				});
				//Purchase.find({}).populate('user_id').populate({path: 'product_id', populate: {path: 'merchant'}}).exec(function(err, purchases){
						req.flash('success', 'Successfuly Purchased');
						res.redirect('/thankyou');
				//});
			}
		});
	}
});

// DELETE PRODUCT
router.delete('/:id', ensureAuthenticated, ensureMerchantOrAdmin, function(req, res){
	let query = {_id:req.params.id}

	Product.findById(req.params.id, function(err, product){
		Product.remove(query, function(err){
			if(err){
				console.log(err);
			}
			res.send('Success');
		});
	});
});
// Approve PRODUCT
router.post('/approve/:id', ensureAuthenticated, ensureAdmin, function(req, res){
	let query = {_id:req.params.id}

	Product.findById(req.params.id, function(err, product){
		Product.update(query, { $set: {"is_approved":true}}, function(err){
			if(err){
				console.log(err);
			}
			res.send('Success');
		});
	});
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

function ensureUser(req, res, next){
	if((req.user.is_merchant == false) && (req.user.is_admin == false)) {
		return next();
	} else {
		req.flash('danger', 'Access Denied');
		res.redirect('/');
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

function ensureMerchant(req, res, next){
	if(req.user.is_merchant == true) {
		return next();
	} else {
		req.flash('danger', 'Access Denied');
		res.redirect('/');
	}
}

function ensureMerchantOrAdmin(req, res, next){
	if((req.user.is_merchant == true) || (req.user.is_admin == true)) {
		return next();
	} else {
		req.flash('danger', 'Access Denied');
		res.redirect('/');
	}
}


module.exports = router;
