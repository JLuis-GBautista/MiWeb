import Transaction from "../wallet/transaction"

export default class MemoryPool {
    transactions: Transaction[];

    constructor() {
        this.transactions = [];
    }

    addOrUpdate(transaction: Transaction) {
        const { input, outputs } = transaction;
        const outputTotal = outputs.reduce((total, output) => total + output.amount, 0);
        if (input?.amount !== outputTotal) throw Error(`Invalid transaction from ${input?.address}`);
        if (!Transaction.verify(transaction)) throw Error(`Invalid signature from ${input.address}`);
        const txIndex = this.transactions.findIndex(({ id }) => id === transaction.id);
        if (txIndex >= 0) this.transactions[txIndex] = transaction;
        else this.transactions.push(transaction);
    }

    find(address: string) {
        return this.transactions.find(({input}) => input?.address === address);
    }

    wipe() {
        this.transactions = [];
    }
}