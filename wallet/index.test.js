const Wallet = require('./index');

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
});