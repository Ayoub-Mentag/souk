const User = require('../models/user').User;
const jwt = require('jsonwebtoken');
const SECRET_ACCESS_TOKEN = require('../config/getEnv.js');
const { Console } = require('console');
let simpleHash = require('../config/hashPass');


exports.all = (req, res, next) => {
    User.all((err, users) => {
        res.send(users);
    });
}

exports.create = (req, res, next) => {
    let user = req.body;

    User.findByName(user.username, (err, data) => {
        if (err) next(err);
        if (data) {
            req.session.message = 'The username is already taken by another user';
            return res.redirect('/signup');
        } else {
            user.password = simpleHash(user.password);
            User.create(user, (err) => {
                if (err) next(err);
                res.redirect('/login');
            });
        }
    });
}

exports.login = (req, res, next) => {
    let user = req.body;
    user.password = simpleHash(user.password);
    User.find(user, async (err, data) => {
        if (err) next(err);
        if (data === undefined) {
            req.session.message = "Invalid creadentials";
            res.redirect('/login');
        }
        else {
            let options = {
                maxAge: 20 * 60 * 1000, // would expire in 20 minutes
                httpOnly: true, // The cookie is only accessible by the web server
                // sameSite: "None",
                secure: true,
            };
            const token = User.generateAccessJWT(data.id); // generate session token for user
            res.cookie("SessionID", token, options); // set the token to response header, so that the client sends it back on each subsequent request
            res.redirect('/products');
        }
    });
}

exports.logout = (req, res, next) => {
    req.session = null;
    res.setHeader('Clear-Site-Data', '"cookies"');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.redirect('/login');
}

exports.update = (req, res, next) => {
    let user = req.body;
    User.update(user, (err) => {
        if (err) next(err);
        res.send('Update');
    });
}


exports.delete = (req, res, next) => {
    let id = req.params.id;
    if (id) {
        User.delete(id, (err, data) => {
            if (err) next(err);
            res.send('Deleted');
        });
    }
    else {
        res.send('Id is required');
    }
}

exports.deleteByName = (req, res, next) => {
    let name = req.params.name;
    if (name) {
        User.deleteByName(name, (err, data) => {
            if (err) next(err);
            res.send('Deleted');
        });
    }
    else {
        res.send('Id is required');
    }
}