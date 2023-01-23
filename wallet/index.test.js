const Wallet = require('./index');
const { verifySignature } = require('../util');

describe ('Wallet', () => {
    let wallet;

    beforeEach(() => {
        wallet = new Wallet;
    });

    it('has a `balance`', () => {
        expect(wallet).toHaveProperty('balance');
    });

    it('has a `publicKey`', () => {
        /* Test for wallet public key:-
        console.log(wallet.publicKey);      
        // => Gives
        // the X and Y values in the Elliptic before encoding
        // Hex code after encoding */

        expect(wallet).toHaveProperty('publicKey');
    });

    describe('siging data', () => {
        const data = 'foobar';

        it('verifies a signature', () => {
            expect(
                verifySignature( {
                    publicKey: wallet.publicKey,
                    data,
                    signature: wallet.sign(data)
                })
            ).toBe(true);
        });

        it('does not verify an invalid signature', () => {
            expect(
                verifySignature( {
                    publicKey: wallet.publicKey,
                    data,
                    signature: new Wallet().sign(data)
                })
            ).toBe(false);
        });
    
    });
});