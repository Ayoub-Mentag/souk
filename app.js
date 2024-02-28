var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var product = require('./routes/product');
var user = require('./routes/user');
const session = require('express-session');
var auth_user = require('./middleware/user');
const { Product } = require('./models/product');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use(auth_user);
app.get('/products', product.all);
app.post('/products/:id', product.update);;
app.post('/products', product.create);
app.delete('/products/:id', product.delete);;

// *************************User*************************
app.get('/users', user.all);

app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => {
  if (req.session && req.session.message) {
    res.render('login', { message: req.session.message });
    req.session.destroy();
  } else {
    res.render('login', {message: ""});
  }
});


app.get('/signup', (req, res) => res.render('signup'));
app.get('/logout', user.logout);
app.post('/login', user.login);
app.post('/signup', user.create);
app.put('/users', user.update);
// ******************************************************


// *************************Admin************************
app.get('/dashboard', product.all);

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
