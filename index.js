const bodyParser = require('body-parser');
const express = require('express');
const Blockchain = require('./blockchain');
const PubSub = require('./pubsub');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

setTimeout( () => pubsub.broadcastChain(), 1000);

app.use(bodyParser.json());

app.get('/api/blocks', (req, res) => {  
    // 1st param - End point to hit to read data - > '/api/blocks', where the GET requtest is located
    // 2nd param - Call back function that needs to be fired whrn the GET request is used.
    // req - request
    // res - respond
    res.json(blockchain.chain);     // Sends the chain in JSON form
});

app.post('/api/mine', (req, res) => {
    const { data } = req.body;

    // Adds a block to the blockjain with recieved data
    blockchain.addBlock({data});

    //Gives confirmation to the requester -> Can see new data block is added to the chain
    res.redirect('/api/blocks');
})

const PORT = 33003;
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`);
})