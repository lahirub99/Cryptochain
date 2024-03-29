const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');

describe('TransactionPool', () => {
    let transactionPool, transaction, senderWallet;

    beforeEach(() => {
        transactionPool = new TransactionPool();
        senderWallet = new Wallet(),
        transaction = new Transaction({
            senderWallet,
            recipient: 'fake-recipient',
            amount: 50
        });
    });

    describe('setTransaction()', () => {
        it('adds a transaction', () => {
            transactionPool.setTransaction( transaction );

            expect( transactionPool.transactionMap[transaction.id] )
                .toBe( transaction );
        });
    });

    describe('existingTransaction()', () => {
        it('returns an existing transaction given an input address', () => {
            transactionPool.setTransaction(transaction);

            expect(
                transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey })
            ).toBe(transaction);
        });
    });


    describe ('validTransactions()', () => {
        let validTransactions;

        beforeEach(() => {
            validTransactions = [];
            
            for (let i = 0; i<10; i++) {
                transaction = new Transaction( {
                    senderWallet,
                    recipient: 'any-recipient',
                    amount: 30
                });

                if ( i%3 === 0 ) {
                    transaction.input.amount = 999999;
                    // Invalid transaction through exceeding the balance
                } else if ( i%3 === 1 ) { 
                    transaction.input.signature = new Wallet().sign('foo');
                    // Invalid transaction through invalid signature
                } else {
                    validTransactions.push( transaction );
                    // Adding only the valid transactions to the valid transactions array
                }

                transactionPool.setTransaction( transaction );
            }
        });

        it('returns valid transactions', () => {
            expect( transactionPool.validTransactions() ).toEqual(validTransactions);
        });
    });
});