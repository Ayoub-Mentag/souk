const User = require('../models/user').User;
const crypto = require('crypto');


function simpleHash(input) {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    return hash.digest('hex');
}

exports.all = (req, res, next) => {
    User.all((err, users) => {
        res.send(users);
    });
}

exports.create = (req, res, next) => {
    console.log(req.body);
    let user = req.body;
    user.password = simpleHash(user.password);
    User.create(user, (err) => {
        if (err) next(err);
        res.redirect('/login');
    });
}

exports.login = (req, res, next) => {
    let user = req.body;
    user.password = simpleHash(user.password);
    User.find(user, (err, data) => {
        if (err) next(err);
        if (data === undefined) {
            req.session.message = "Invalid creadentials";
            res.redirect('/login');
        }
        else {
            req.session.uid = data.id;
                res.redirect('/products');
        }
    });
}

exports.logout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/login');
}

exports.update = (req, res, next) => {
    let user = req.body;
    User.update(user, (err) => {
        if (err) next(err);
        res.send('Update');
    });
}
