var createError = require('http-errors');
var express = require('express');
require('./config/passport-setup');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var product = require('./routes/product');
var card = require('./routes/card');
var user = require('./routes/user');
const cookieSession = require('cookie-session');
const session = require('express-session');
var permission = require('./middleware/user');
const { Product } = require('./models/product');
const { check } = require('express-validator');
var app = express();
const Validate = require('./middleware/validate.js');
const authRouters = require('./routes/auth');
const {cookieKey} = require('./config/getEnv');
const passport = require('passport');

const User = require('./models/user').User;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set up session cookies
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use(permission);
app.get('/products', product.all);
app.post('/products/:id', product.update);
app.post('/products', product.create);
app.delete('/products/:id', product.delete);

// *************************User*************************
app.get('/users', user.all);

app.get('/login', (req, res) => {
  if (req.cookies["SessionID"])
    return res.redirect('/products');
  if (req.session && req.session.message) {
    res.render('login', { message: req.session.message });
    req.session = null;
  } else {
    res.render('login', {message: ""});
  }
});

app.get('/signup', (req, res) => {
  let usernameError = '';
  let passwordError = '';
  let message = '';
  if (req.session) {
    if (req.session.usernameError) {
      usernameError = req.session.usernameError;
    }
    if (req.session.passwordError) {
      passwordError = req.session.passwordError;
    }
    if (req.session.message) {
      message = req.session.message;
    }
  }
  res.render('signup', { usernameError, passwordError, message });
  req.session.destroy();
});

app.get('/logout', user.logout);
app.post('/login', user.login);

app.post('/signup',
        // check("username")
        //   .notEmpty()
        //   .isLength({ min: 8 })
        //   .withMessage("Must be at least 8 chars long"),
        // check("password")
        //   .notEmpty()
        //   .isLength({ min: 8 })
        //   .withMessage("Must be at least 8 characters")
        //   .matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]+$/)
        //   .withMessage("Must contain at least one digit, one alphabetic character, and one symbol"),
        // Validate,
        user.create);

app.put('/users', user.update);
app.delete('/users/:id', user.delete);


app.use('/auth', authRouters);
app.delete('/users/name/:name', user.deleteByName);
// ******************************************************


// *************************Admin************************

// form to add a product
app.get('/productForm', (req, res, next) => res.render('productForm', {product: {}}));
app.get('/productForm/:id', (req, res, next) => {
  Product.find(req.params.id, (err, product) => {
    if (err) next(err);
    res.render('productForm', {product: product})
  });
}
);
// ******************************************************

// *************************Card************************
app.post('/addToCard', card.createOrUpdate);
app.post('/removeFromCard', card.removeOrUpdate);

app.get('/card', card.all);

app.get('/productOfAUser', card.productOfAuser);
// *****************************************************

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
