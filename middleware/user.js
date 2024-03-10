const User = require('../models/user').User;
const { SECRET_ACCESS_TOKEN } = require('../config/getEnv.js');
const jwt = require('jsonwebtoken');

function decode(sessionId) {
    return new Promise((resolve, reject) => {
        jwt.verify(sessionId, SECRET_ACCESS_TOKEN, (err, decoded) => {
            if (err)
                reject();
            else {
                const { id } = decoded; // get user id from the decoded token
                resolve(id);
            }
        });
    });
}

function resolve(id, req, res, next) {
    User.getUserById(id, (err, result) => {
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

function reject(req, res) {
    req.session.message = 'session id malformed !!';
    res.setHeader('Clear-Site-Data', '"cookies"');
    res.redirect('/login');
}

module.exports =  async function permission(req, res, next) {
    if (req.url == '/signup' || req.url.search('/auth/google') != -1) {
        return next();
    }
    // check if the user is authenticated with Google
    if (req.user) {
        return next();
    }

    const token = req.headers["cookie"];
    if (token == undefined || token.search("SessionID") == -1) {
        if (req.url == '/login')
            return next();
        req.session.message = 'You need to log in';
        return res.redirect('/login');
    }

    // Get the session id
    let sessionId;
    let cookieTable = token.split(';');
    cookieTable.forEach(element => {
        if (element.search("SessionID") != -1) {
            sessionId = element.split('=')[1];
            return ;
        }
    });
    decode(sessionId)
        .then((id) => resolve(id, req, res, next))
        .catch(() => reject(req, res));
};



 // decode the sessionId;
    // jwt.verify(sessionId, SECRET_ACCESS_TOKEN, (err, decoded) => {
    //     if (err) {
    //         // if token has been altered, return a forbidden error
    //         userId = undefined;
    //         req.session.message = 'session id malformed !!';
    //         res.setHeader('Clear-Site-Data', '"cookies"');
    //         res.redirect('/login');
    //     }
    //     else {
    //         const { id } = decoded; // get user id from the decoded token
    //         userId = id;
    //         User.getUserById(userId, (err, result) => {
    //             if (err) next(err);
    //             if (result == undefined) {
    //                 req.session.message = 'The session has been expired, you need to re-login';
    //                 res.redirect('/login');
    //             } else {
    //                 req.user = res.locals.user = result;
    //                 next();
    //             }
    //         });
    //     }
    // });