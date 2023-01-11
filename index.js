const express = require('express');
const Blockchain = require('./blockchain');

const app = express();
const blockchain = new Blockchain();

app.get('/api/blocks', (req, res) => {  
    // 1st param - End point to hit to read data - > '/api/blocks', where the GET requtest is located
    // 2nd param - Call back function that needs to be fired whrn the GET request is used.
    // req - request
    // res - respond
    res.json(blockchain.chain);     // Sends the chain in JSON form
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`);
})