const Card = require('../models/card').Card;

exports.all = (req, res, next) => {
    Card.all((err, cards) => {
        if (err) next(err);
        res.send(cards);
    });
}

exports.createOrUpdate = (req, res, next) => {
    console.log('create or update ', req.body);
    Card.createOrUpdate(req.body, (err) => {
        if (err) return next(err);
        res.send("Hello");
    });
}

function getTotal(products) {
    let total = 0;
    products.forEach(element => {
        total += element.price * element.numberUnits;
    });
    return total;
}

exports.productOfAuser = (req, res, next) => {
    
    Card.allProductsMadeByAuser(req.user.id, (err, products) => {
        if (err) {
            return next(err);
        }
        res.render('bill', {products: products, total: getTotal(products)});
    });
}


