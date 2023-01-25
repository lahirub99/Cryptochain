const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

//setTimeout( () => pubsub.broadcastChain(), 1000);

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

    //Update the blockchain and broadcast the updated version to other nodes
    pubsub.broadcastChain();

    //Gives confirmation to the requester -> Can see new data block is added to the chain
    res.redirect('/api/blocks');
})

app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body;

    let transaction = transactionPool.existingTransaction({
        inputAddress: wallet.publicKey
    });    
    // Making transaction dynamic
    // Assigning a previously existed transaction to the transaction variable
    
    try{
        if (transaction) {          // The transaction is defined
            transaction.update({    // Transaction already exists --> Go through update process
                senderWallet: wallet,
                recipient,
                amount
            }); 
        } else {    // The transaction is undefined
            transaction = wallet.createTransaction({ recipient, amount });
        }
        
    } catch (error) {
        return res.status(400).json({
            type: 'error',
            message: error.message
        });
    }

    transactionPool.setTransaction( transaction );

    pubsub.broadcastTransaction(transaction);

    // console.log('transactionPool', transactionPool);

    res.json({ type: 'success', transaction });
});
const syncChains = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log('replace chain on a sync with', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });
};

app.get('/api/transaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap);
});

let PEER_PORT;     // Not defined

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil( Math.random() * 1000 ); 
    // Giving a int value ranging from 3001 to 4000 to the PEER_PORT (DEFALT_PORT = 3000)
}

const PORT = PEER_PORT || DEFAULT_PORT;     // look for PEER_PORT, assign DEFAULT value if it is unavailable


app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`);

    if (PORT !== DEFAULT_PORT) {    //z
        syncChains();
    }
})