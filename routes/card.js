const Card = require('../models/card').Card;

exports.all = (req, res, next) => {
    Card.all((err, cards) => {
        if (err) next(err);
        console.log(cards);
        res.send(cards);
    });
}

exports.createOrUpdate = (req, res, next) => {
    console.log(req.body);
    Card.createOrUpdate(req.body, (err) => {
        if (err) return next(err);
        res.send("Hello");
    });
}

exports.productOfAuser = (req, res, next) => {
    Card.allProductsMadeByAuser(1, (err, products) => {
        res.send(products);
    });
}