const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

// Connect to database
mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function(){
	console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
	console.log(err);
});

// Init app
const app = express();

// Bring in models
let User = require('./models/user');
let Purchase = require('./models/purchase');
let Comment = require('./models/comment');

// Load View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

// Set public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session middleware
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true,
}));

// Express Messages middleware
app.use(require('connect-flash')());
app.use(function(req, res, next){
	res.locals.messages = require('express-messages')(req, res);
	next();
});

// Express Validator middleware
app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;
		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param : formParam,
			msg : msg,
			value : value
		};
	}
}));

// Passport config
require('./config/passport')(passport);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
	res.locals.user = req.user || null;
	next();
});

// Home Route
app.get('/', function(req, res){
	res.render('index.ejs', { //GUEST PATH
		page_name: 'home',
	});
});

//Temporary Routes
	app.get('/faqs',function(req, res){
		res.render('faqs.ejs', {
			title: 'FAQs',
			page_name: 'faqs'
		});
	});

	app.get('/contact',function(req, res){
		res.render('contact.ejs', {
			title: 'Contact Us',
			page_name: 'contact'
		});
	});

	app.get('/faqs',function(req, res){
		res.render('faqs.ejs', {
			title: 'FAQs',
			page_name: 'faqs'
		});
	});

	app.get('/thankyou', ensureAuthenticated,function(req, res){
		res.render('thankyou.ejs', {
			title: 'Thank You',
			page_name: 'products'
		});
	});

	//post comment
	app.post('/thankyou', ensureAuthenticated, function(req,res){
		req.checkBody('comment','Comment is required').notEmpty();
		// Get errors
		let errors = req.validationErrors();
	
		if(errors){
				res.render('thankyou.ejs', {
					title: 'Thank You',
					page_name: 'products',
					errors: errors,
					user: req.user
				});
		} else {
	
			let newComment = new Comment();
			newComment.comment = req.body.comment;

			newComment.save(function(err){
				if(err){
					console.log(err);
					return;
				} else {
					req.flash('success', 'Comment Submitted');
					res.redirect('/thankyou');
				}
			});
		}
	});

//route files

let users = require('./routes/users');
app.use('/users', users);

let products = require('./routes/products');
app.use('/products', products);

let admins = require('./routes/admins');
app.use('/admins', admins);

let merchants = require('./routes/merchants');
app.use('/merchants', merchants);

//Start Server

app.listen(3000, function(){
	console.log('Server started on port 3000...')
});


//Access Controls
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('danger', 'Please login');
		res.redirect('/users/login');
	}
}
