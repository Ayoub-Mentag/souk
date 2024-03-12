const express = require('express')
const app     = express();


function middleware(req, res, next) {
    console.log("Hello I am a middleware")
    // next(new Error('Eroro'));
    next();
}

function errorHandler(err, req, res, next) {
    res.send('There is an error');
}

app.listen(8000);

app.use(middleware);

app.use(errorHandler);

app.get('/', (req, res, next) => {
    res.send('<h1>Hello world</h1>');
});
