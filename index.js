//Requried and Global vars
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('./config/passportConfig'); 
var isLoggedIn = require('./middleware/islogin');
require ('dotenv').config();
var db = require('./models');
var app = express();
var request = require('request');
var async = require('async');
var personalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

var personality_insights = new personalityInsightsV3({
  username: '18f2434f-a326-449e-9f89-33ab867b0b11',
  password: 'Ej8l7jySrwBx',
  version_date: '2016-10-20'
});

//Set and Use Statements
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'));
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());//comes after the session
app.use(passport.session());
app.use(function(req,res,next){//middleware
	res.locals.currentUser = req.user;
	res.locals.alerts = req.flash();
	next();
});

//Routes
app.get('/', function(req,res) {
	res.render('home');
});

app.get('/profile', isLoggedIn,function(req,res){
//getting data from facebook
	var facebookArr;
	var url =  "https://graph.facebook.com/v2.8/me/posts?limit=1000&access_token=" + req.user.facebookToken;
	request(url, function(error, response, body){
		var postData = JSON.parse(body);
		var arr = [];

		postData.data.forEach(function(post){
			if(post.message){
				arr.push(post.message);
				facebookArr = arr.join(' ');
			}
		});
// console.log(facebookArr);

//Sending Facebook data to Watson
		var params = {
			text: facebookArr,
			consumption_preferences: true,
			raw_scores:true,
			headers: {
				'accept-language': 'en',
				'accept': 'application/json'
			}
		}
//getting Watson results
		personality_insights.profile(params, function(error, response) {
	 		if (error){
	    		console.log('Error:', error);
	  		} else {

	  		db.watson.create({
	  			where:{
	  				result: facebookArr
	  			}
	  		}).then(function(){
	  			res.render('profile', {watsonData: response})
	  			console.log(response);
	  			});
			}
	  	}); 
	});
});

//Controllers
app.use("/auth", require('./controllers/auth'))


//Listen
app.listen(process.env.PORT || 3000);










