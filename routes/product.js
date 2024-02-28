const Product = require('../models/product').Product;

exports.all = (req, res, next) => {
  Product.all((err, products) => {
    if (err) next(err);
    if (req.url === "/dashboard")
      res.render('dashboard', {products: products});
    else
      res.render('index', {products: products});
  });
}

exports.create = (req, res, next) => {
  let product = req.body;
  Product.create(product, (err) => {
    if (err) next(err);
    res.redirect('/products');
  });
}

exports.update = (req, res, next) => {
  let product = req.body;
  product.id = req.params.id;
  Product.update(product, (err) => {
    if (err) next(err);
    res.redirect('/products');
  });
}


exports.delete = (req, res, next) => {
  let id = req.params.id;
  Product.delete(id, (err) => {
    if (err) next(err);
    console.log("DELETE PRODUCT");
    res.redirect('/products');
  });
}