const User = require('../models/user').User;
const SECRET_ACCESS_TOKEN = require('../config/getEnv.js');
const jwt = require('jsonwebtoken');


module.exports =  async function decode(accessToken) {
    let id = await jwt.verify(accessToken, SECRET_ACCESS_TOKEN, async (err, decoded) => {
                if (err) {
                    // if token has been altered, return a forbidden error
                    return (undefined);
                    // return res
                    //     .status(401)
                    //     .json({ message: "This session has expired. Please login" });
                }
            
                const { id } = decoded; // get user id from the decoded token
                return id;
    });
    return id;
}

module.exports =  async function permission(req, res, next) {
    let userId;
    if (req.url == '/signup') {
        return next();
    }
    const token = req.headers["cookie"];
    if (token == undefined || token.search("SessionID") == -1) {
        if (req.url == '/login')
            return next();
        req.session.message = 'You need to log in';
        return res.redirect('/login');
    }

    // decode the sessionId;
    let sessionId;
    let cookieTable = token.split(';');
    cookieTable.forEach(element => {
        if (element.search("SessionID") != -1) {
            sessionId = element.split('=')[1];
            return ;
        }
    });
    jwt.verify(sessionId, SECRET_ACCESS_TOKEN, async (err, decoded) => {
        if (err) {
            console.log("Hello error");
            // if token has been altered, return a forbidden error
            userId = undefined;
            req.session.message = 'session id malformed !!';
            res.setHeader('Clear-Site-Data', '"cookies"');
            res.redirect('/login');
        }
        else {
            const { id } = decoded; // get user id from the decoded token
            userId = id;
            User.getUserById(userId, (err, result) => {
                if (err) next(err);
                if (result == undefined) {
                    req.session.message = 'The session has been expired, you need to re-login';
                    res.redirect('/login');
                } else {
                    req.user = res.locals.user = result;
                    next();
                }
            });
        }
    });

};