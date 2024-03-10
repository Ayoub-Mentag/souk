const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {clientID, clientSecret} = require('./getEnv');
const User = require('../models/user').User;
let simpleHash = require('../config/hashPass');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findByName(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: '/auth/google/redirect'
}, (accessToken, refreshToken, profile, done) => {
    // check if the use is already logged in
    const { displayName } = profile;
    if (User.findByName(displayName, (user, err) => {
        if (user) {
            done(null, user);
        }
        else {
            let newUser = {username: displayName, password: simpleHash(displayName)};
            User.create(newUser, (err) => {
                User.findByName(newUser.username, (err, user) => {
                    console.log(user);
                    done(null, user);
                })
            });
        }
    }));
}));