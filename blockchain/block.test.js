const hexToBinary = require('hex-to-binary');
const Block = require('./block');   //./block' <= file
const { GENESIS_DATA, MINE_RATE } = require('../config');
const cryptoHash = require('../util/crypto-hash');

describe('Block', () => {
    const timestamp = 2000;
    const lastHash = 'foo-hash';
    const hash = 'bar-hash';
    const data = ['blockchain', 'data'];
    const nonce = 1;
    const difficulty = 1;
    // const Block = new Block({
    //     timestamp: timestamp,
    //     lastHash: lastHash,
    //     hash: hash,
    //     data: data
    // });
    const block = new Block({ timestamp, lastHash, hash, data, nonce, difficulty });

    it('has a timestamp, lastHash, hash, and data property', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    })

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();       // Code genesis block in block.js

        it('returns a Block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });

        it('retruns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });

    })

    describe('mineBlock', () => {
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const minedBlock = Block.mineBlock( { lastBlock, data });

        it('returns a Block instance', () => {
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('sets the `lastHash` to be the `hash` of the lastBlock', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the `data`', () => {
            expect(minedBlock.data).toEqual(data);
        });

        it('sets a `timestamp`', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it('creates a SHA-256 `hash` based on proper inputs', () => {
            expect(minedBlock.hash)
                .toEqual(cryptoHash(
                    minedBlock.timestamp,
                    minedBlock.nonce,    
                    minedBlock.difficulty,
                    lastBlock.hash,
                    data
                )
            );
        });

        it('sets a `hash` that matches the difficulty criteria', () => {
            expect( hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty) )
                .toEqual( '0'.repeat(minedBlock.difficulty));
        });

        it('adjusts the difficulty', () => {
            const possibleResults = [lastBlock.difficulty+1, lastBlock.difficulty-1];

            expect( possibleResults.includes(minedBlock.difficulty) ).toBe(true);
        })
    });

    describe('adjustDifficulty()', () => {
        it('raises the difficulty for a quickly mined block', () => {
            expect(Block.adjustDifficulty( {
                originalBlock: block,
                timestamp: block.timestamp + MINE_RATE - 100    
                // New blocks timestamp falls within --> (original blocks timestamp + MINE_RATE - 100)
                // original blocks timestamp + MINE_RATE => timestamp of the new block
                // by - 100 it ensures the new blocks timestamp falls quicker than the mining rate
            }))
                .toEqual( block.difficulty+1 );     // Should raise the difficulty
        });

        it('lowers the difficulty for a slowly mined block', () => {
            expect(Block.adjustDifficulty( {
                originalBlock: block,
                timestamp: block.timestamp + MINE_RATE + 100    
                // New blocks timestamp falls within --> (original blocks timestamp + MINE_RATE + 100)
                // original blocks timestamp + MINE_RATE => timestamp of the new block
                // by + 100 it ensures the new blocks timestamp falls after the mined block. ()
            }))
                .toEqual( block.difficulty-1 );     // Should lower the difficulty because mining rate is not enough
        });

        it('has a lower limit of 1', () => {
            block.difficulty = -1;
            expect( Block.adjustDifficulty({ originalBlock:block })).toEqual(1);
        } )
    })
});
//*/
/*
const Block = require('./block');

describe('Block', () => {
  const timestamp = 'a-date';
  const lastHash = 'foo-hash';
  const hash = 'bar-hash';
  const data = ['blockchain', 'data'];
  const block = new Block({ timestamp, lastHash, hash, data });

  it('has a timestamp, lastHash, hash, and a data property', () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  });
});
*/