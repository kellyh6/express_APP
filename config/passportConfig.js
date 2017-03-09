var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var db = require('../models');
require('dotenv').config();


passport.serializeUser(function(user,cb){
	cb(null, user.id);
});

passport.deserializeUser(function(id, cb){
	db.personality.findById(id)
	.then(function(user){
		cb(null, user);
	})
	.catch(cb);	
});

passport.use(new localStrategy({
	usernameField: 'email',
	passwordField: 'password'
}, function(email, password, cb) {
	db.personality.findOne({
		where:{email: email}
	}).then(function(user){
		if(!user || !user.isValidPassword(password)){
			cb(null, false);
		}
		else {
			cb(null, user);
		}
	}).catch(cb);
}));


passport.use(new facebookStrategy({
	clientID: process.env.FACEBOOK_APP_ID,
	clientSecret: process.env.FACEBOOK_SECRET,
	callbackURL: process.env.BASE_URL + "auth/callback/facebook",
	profileFields: ['id', 'email', 'displayName', 'feed','posts'],
	enableProof: true
}, function(accessToken, refreshToken, profile, cb){
	//see if you can get the email
	var email = profile.emails ? profile.emails[0].value : null;

	// see if user exists in our database
	db.personality.findOne({
		where: {email: email}
	}).then(function(existingUser) {
	//This user has logged in before!
	if(existingUser && email){
		//if non-null user was found  and fb profile loaded okay
		existingUser.updateAttributes({
			facebookId: profile.id,
			facebookToken: accessToken
			}).then(function(updatedUser){
				cb(null, updatedUser);
			}).catch(cb);
		} else {
			// they're new - need to create an entry for new user
			db.personality.findOrCreate({
				where: {facebookId: profile.id},
				defaults: {
					facebookToken: accessToken,
					email: email,
					firstName: profile.displayName.split(" ")[0],
					lastName: profile.displayName.split(" ")[1],
					userName: profile.displayName,
					// feed: feed
				}
			}).spread(function(user, wasCreated){

			if(wasCreated){
				//they were new, we created an account
				cb(null, user);
			}
			else {
				//They were not new - update token
				user.facebookToken = accessToken;
				user.save().then(function(){
					cb(null, user);
				}).catch(cb);
			}
		}).catch(cb);
		}	
	})
}));

module.exports = passport;
