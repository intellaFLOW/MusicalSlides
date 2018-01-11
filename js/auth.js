var express = require('express');
var app = express();
var bodyParser = require('body-parser'); 
var session = require('express-session');
var passport = require('passport');
var FacebookStraategy = require('passport-facebook').Strategy;

// Set middleware


app.use(bodyParser.json());
app.use(session({
    secret: 'yes',
    resave: true,
    saveUninitialized: true
}));

var FACEBOOK_APP_ID ='167810517285971',
    FACEBOOK_APP_SECRET = 'ccf600cf06aa653f06cccf3a8fc61a17';

var fbOpts = {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL : 'http://localhost:3000/auth/facebook/callback'
    
};

var fbCallback = function(accessToken, refreshToken, profile, Cb){
        console.log(accessToken, refreshToken, profile);
        Cb(null, profile);
};

passport.use(new FacebookStraategy(fbOpts, fbCallback));
 //console.log(fbOpts, fbCallback);

app.get("/", function(req, res) {
   res.sendFile(__dirname + "/../index.html");
});

app.get('/auth/facebook/', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', function(req, res){
    console.log('YES');
    // Database save
}));

app.listen(3000);