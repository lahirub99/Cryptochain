const hexToBinary = require("hex-to-binary");
const { GENESIS_DATA, MINE_RATE } = require("../config");
const { cryptoHash } = require("../util");

class Block {
    constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
         this.timestamp = timestamp;
         this.lastHash = lastHash;
         this.hash = hash;
         this.data = data;
         this.nonce = nonce;
         this.difficulty = difficulty;
    }

    static genesis() {
        return new this(GENESIS_DATA);  // this == Block (this refers to the class)
    }

    static mineBlock({ lastBlock, data }) {
        const lastHash = lastBlock.hash;
        let hash, timestamp;        
        let { difficulty } = lastBlock;   //local static difficulty variable -> then  converted into a dynamic variable in order to implenent the adjustable difficult 
        let nonce = 0;                      //local dynamic nonce variable   

        do {
            nonce ++;   // increment the nonce
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp })
            hash = cryptoHash(timestamp, lastHash, data, difficulty, nonce);

        } while ( hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty) );    // Repeat the loop until no. of starting zeros unmatches the no. of required zeros 
        
        return new this({ timestamp, lastHash, data, difficulty, nonce, hash });
    }

    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock;

        if (difficulty < 1) return 1;

        if( (timestamp - originalBlock.timestamp) > MINE_RATE ) 
            return difficulty - 1;
        
        return difficulty + 1;
        // Why isn't this need a funtionality to return the same level of difficulty?
        // Prolly because the occurance of mining time and the block adding time is very rare. 
    } 
}

//console.log('BLOCK1:', block1);
module.exports = Block;

/*
const block1 = new Block({
    data: 'abc',
    timestamp: '01/01/01',
    lastHash: 'lasthash',
    hash: 'hash'
});

*/
/*
class Block {
    constructor({ timestamp, lastHash, hash, data }) {
      this.timestamp = timestamp;
      this.lastHash = lastHash;
      this.hash = hash;
      this.data = data;
    }
  }
  
  module.exports = Block;
  */