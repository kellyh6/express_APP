var express = require('express');
var db = require('../models');
var passport = require('../config/passportConfig'); //require entire file
var router = express.Router();

//Routes
router.get('/login', function(req,res){
	res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	successFlash: "Good job, you logged in",
	failureRedirect: '/auth/login',
	failureFlash: "Invalid Credentials"

}));

router.get('/signup', function(req,res){
	res.render('auth/signup');
});

router.post('/signup', function(req,res){
	console.log(req.body);

	db.user.findOrCreate({
		where:{email: req.body.email},
		defaults: {
			username: req.body.username,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			password: req.body.password
		}
	}).spread(function(user, wasCreated){
		if(wasCreated){
			//Goodd
			passport.authenticate('local', {
				successRedirect:'/',
				successFlash: "Account created and logged in"
			})(req,res);
		}
		else{
			//Bad
			req.flash("error", "Email already exisit");
			res.redirect('/auth/login');
		}
	}).catch(function(err){
		req.flash("error", err.message);
		res.redirect('/auth/signup');
	});
});

router.get('/logout', function(req,res){
	req.logout();
	req.flash('success', 'You are logged out');
	res.redirect('/');
});


//facebook auth
router.get('/facebook', passport.authenticate('facebook', {
	scope: ['public_profile', 'email', 'user_posts']
}));

router.get('/callback/facebook', passport.authenticate('facebook', {
	successRedirect: '/profile',
	successFlash: "You've successfully logged in via Facebook",
	failureRedirect: '/auth/login',
	failureFlash: " You tried it, but Facebook said no"
}));




//Export
module.exports = router;

