const {validationResult } = require('express-validator');

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let usernameError = '', passwordError = '';
        errors.array().map((err) => {
            if (err.path == 'username')
                usernameError += '-' + err.msg;
            if (err.path == 'password') 
                passwordError += '-' + err.msg;
        });
        req.session.usernameError = usernameError;
        req.session.passwordError = passwordError;
        return res.redirect('/signup');
    }
    next();
};