const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[ this.chain.length -1 ],
            data
        });

        this.chain.push(newBlock);
    }

    replaceChain(chain) {
        if (chain.length <= this.chain.length) {    // given new chain's length is smaller than the original chain => 'when the new chain is not longer'
            console.error('The incoming chain must be longer');
            return;
        }
        
        // new chain is longer
        if (!Blockchain.isValidChain(chain)) {   //Checking for validity => if the chain is NOT valid, do not replace
            console.error('The incoming chain must be valid');
            return;
        }

        console.log('replacing chain with', chain);
        this.chain = chain;     // replacing the chain with chain given in the parameter
    }

    static isValidChain(chain) {
        if (JSON.stringify( chain[0] ) !== JSON.stringify( Block.genesis() ) ) return false; 

        for (let i =1; i<chain.length; i++) {
            const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];
            const actualLastHash = chain[i-1].hash;
            const lastDifficulty = chain[i-1].difficulty;

            if (lastHash !== actualLastHash) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
            if (hash !== validatedHash) return false;

            if ( Math.abs( lastDifficulty - difficulty) > 1 ) return false;
        }

        return true;
    }
}

module.exports = Blockchain;