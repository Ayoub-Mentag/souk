const dotenv = require('dotenv');
dotenv.config();

const { SECRET_ACCESS_TOKEN } = process.env;

module.exports =  SECRET_ACCESS_TOKEN;