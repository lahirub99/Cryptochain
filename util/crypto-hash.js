const crypto = require('crypto');
// const hexToBinary = require('hex-to-binary');  ---> Gives a long 01011.. hash values. Implement it in mineblock function in the bloc.js file to convert in only when we are doing the difficulty check.

const cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256');

    hash.update(inputs.sort().join(' '));

    //return hexToBinary(hash.digest('hex'));
    return hash.digest('hex');
}

module.exports = cryptoHash;