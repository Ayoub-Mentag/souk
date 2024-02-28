const User = require('../models/user').User;

module.exports = (req, res, next) => {
    const uid = req.session.uid;
    if (req.url != '/login' && !uid) {
        return res.redirect('/login');
    }
    if (req.url == '/login' && uid) {
        return res.redirect('/products');
    }
    User.getUserById(uid, (err, user) => {
        if (err) return next(err);
        req.user = res.locals.user = user;
        next();
    });
};