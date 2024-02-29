const User = require('../models/user').User;

exports.permission = (req, res, next) => {
    const uid = req.session.uid;
    if (!uid) {
        if (req.url != '/signup' && req.url != '/login') {
            return res.render('login', {message: ''});
        }
        return next();
    }

    // he is already login
    if (req.url == '/login') {
        return res.redirect('/products');
    }
    User.getUserById(uid, (err, user) => {
        if (err) return next(err);
        req.user = res.locals.user = user;
        if (req.user.username != 'admin' && req.url != '/products' && req.url != '/logout')
            return res.redirect('/products');
        next();
    });
};