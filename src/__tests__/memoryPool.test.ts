import MemoryPool from "../utils/memoryPool";
import Transaction from "../wallet/transaction";
import Wallet from "../wallet/wallet";
import Blockchain from "../utils/BlockChain";

describe("MemoryPool", () => {
    let memoryPool: MemoryPool;
    let wallet: Wallet;
    let transaction: Transaction;
    let blockchain: Blockchain;

    beforeEach(() => {
        memoryPool = new MemoryPool();
        blockchain = new Blockchain();
        wallet = new Wallet(blockchain);
        transaction = Transaction.create(wallet, "random-address", 5);
        memoryPool.addOrUpdate(transaction);
    });

    it("Tiene una transaccion", () => {
        expect(memoryPool.transactions.length).toEqual(1);
    });

    it("Adiere una transaccion a la memoryPool", () => {
        const found = memoryPool.transactions.find(({id}) => id === transaction.id);
        expect(found).toEqual(transaction);
    });

    it("Actualizar una transaccion en el memoryPool", () => {
        const txOld = JSON.stringify(transaction);
        const txNew = transaction.update(wallet, "other-address", 10);

        memoryPool.addOrUpdate(txNew);

        expect(memoryPool.transactions.length).toEqual(1);

        const found = memoryPool.transactions.find(({id}) => id === transaction.id);
        expect(JSON.stringify(found)).not.toEqual(txOld);
        expect(txNew).toEqual(found);
    });

    it("Vaciar transacciones", () => {
        memoryPool.wipe();
        expect(memoryPool.transactions.length).toEqual(0);
    })
});