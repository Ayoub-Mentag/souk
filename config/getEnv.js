const dotenv = require('dotenv');
dotenv.config();

const { SECRET_ACCESS_TOKEN, clientID, clientSecret, cookieKey} = process.env;

module.exports =  { SECRET_ACCESS_TOKEN, clientID, clientSecret, cookieKey};