var jwt = require('jwt-simple');
var moment = require('moment');
var User = require('../models/user');
var config = require('../config/config');

var userCtrl = {};
userCtrl.signUp = function(req, res){
    const {
        email,
        password,
        displayName,
        firstName,
        lastName
    } = req.body;

    req.checkBody('email','Email field is required').notEmpty();
    req.checkBody('displayName','Username field is required').notEmpty();
    req.checkBody('password','Password field is required').notEmpty();
   // req.checkBody('password2','Passwords donot match').equals(req.body.password);
    req.checkBody('firstName','Username field is required').notEmpty();
    req.checkBody('lastName','Username field is required').notEmpty();
    

    const errors = req.validationErrors();
    if (errors) {
        console.log('errors');
        res.json({
            errors: errors
        });
    } else {
        const newUser = new User({
            email: email,
            displayName: displayName,
            password: password,
            firstName: firstName,
            lastName: lastName
        });
        User.createUser(newUser, function(err, user){
            
            if (err) {
                console.log("Error saving user:",err);
                res.json({"error": "email is already registere"});
            } else {
                console.log("Created new User:", user);
                res.json({"user":user});
            }
        });
    }
}

userCtrl.login = function(req, res) {
    const {
        email,
        password
    } = req.body;

    req.checkBody('email','Email field is required').notEmpty();
    req.checkBody('password','Password field is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        res.json({
            errors: errors
        });
    } else {
        User.getUserByEmail(email, function(err, user) {
            if (!user) {
                return res.status(401).send({ message: 'Wrong email and/or password' });
            } 
            user.comparePassword(password, function(err, isMatch) {
                if (!isMatch) {
                    return res.status(401).send({ message: 'Wrong email and/or password' });
                }
                user = user.toObject();
                delete user.password;
                var token = createToken(user);
                res.send({ token: token, user: user });
            });
        });
    }
}

// Create endpoint /api/users for GET
userCtrl.getUsers = function(req, res) {
    User.find(null,'-password -__v -_id',function(err, users) {
        if (err)
        res.send(err);

        res.json(users);
    });

};

function createToken(user) {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}

function verifyToken(token) {
    jwt.verify(token,config.TOKEN_SECRET,function(err,token){
        if(err){
            // respond to request with error
        }else{
            // continue with the request
            console.log(token);
        }
    });
}

module.exports = userCtrl;