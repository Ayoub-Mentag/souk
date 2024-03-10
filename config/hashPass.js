const crypto = require('crypto');

module.exports = function simpleHash(input) {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    return hash.digest('hex');
}

