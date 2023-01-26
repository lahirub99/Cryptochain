class TransactionPool {
    constructor() {
        this.transactionMap = {};
    }

    setTransaction(transaction) {
        this.transactionMap [transaction.id] = transaction;
    }

    setMap(transactionPoolMap) {
        this.transactionPoolMap = transactionPoolMap;
        // I used tranactionPoolMap for clarification, but 'transactionMap' used in the given code.
    }

    existingTransaction({ inputAddress }) {
        // Goal is to return the transaction that exist 
        // for this input address if there's one already
        // stored in the transaction map.
        const transactions = Object.values( this. transactionMap );

        return transactions.find(
                transaction => transaction.input.address === inputAddress
            );
            // Go through the transactions and returns the 1st transaction 
            // where matching occurs in the input address.
    }
}

module.exports = TransactionPool;