const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const TOKEN_SECRET = 'sakjgkd47hdks4362n2974ndsjkdAh437djhd4';

// authentication for routes
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // check json web token exists & is verified
    if(token) {
        jwt.verify(token, TOKEN_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/');
            } else {
                req.user = decodedToken;
                next();
            }
        });
    } else {
        res.redirect('/');
    }
};

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token) {
        jwt.verify(token, TOKEN_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next()
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = {
    requireAuth,
    checkUser
}