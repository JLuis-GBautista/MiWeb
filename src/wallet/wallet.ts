import ellipticProcess from '../utils/modules/elliptic';
import { ec } from "elliptic";
import SHA256Process from '../utils/modules/hash';
import { TransactionOutputInterface } from './properties.interface';
import Blockchain from '../utils/BlockChain';
import Transaction from './transaction';
import MemoryPool from '../utils/memoryPool';

const INITIAL_BALANCE = 100;

export default class Wallet {
    balance: number;
    keyPair: ec.KeyPair;
    publicKey: string;
    blockchain: Blockchain;

    constructor(blockchain: Blockchain, initialBalance = INITIAL_BALANCE) {
        this.balance = initialBalance;
        this.keyPair = ellipticProcess.createKeyPair();
        this.publicKey = this.keyPair.getPublic().encode("hex", false);
        this.blockchain = blockchain;
    }

    toString() {
        const {balance, publicKey} = this;
        return `balance: ${balance}\npublicKey: ${publicKey}`;
    }

    createTransaction(recipientAddress: string, amount: number) {
        const {blockchain: {memoryPool}} = this;
        const balance = this.calculateBalance();
        if (amount > balance) throw Error(`Amount: ${amount} exceeds current balance: ${balance}`);
        let tx = memoryPool.find(this.publicKey);
        if (tx) {
            tx.update(this, recipientAddress, amount);
        } else {
            tx = Transaction.create(this, recipientAddress, amount);
            memoryPool.addOrUpdate(tx);
        }
        return tx;
    }

    calculateBalance() {
        const { blockchain: {blocks}, publicKey} = this;
        let {balance} = this;
        const txs: Transaction[] = [];

        blocks.forEach(({data}) => {
            if (Array.isArray(data)) data.forEach((tx) => txs.push(tx));
        });

        const walletInputTxs = txs.filter((tx) => tx.input?.address === this.publicKey);
        let timestamp = 0;

        if (walletInputTxs.length > 0) {
            const recentInputTxs = walletInputTxs.sort((a,b) => a.input!.timestamp - b.input!.timestamp).pop();
            balance = recentInputTxs!.outputs.find(({address}) => address === this.publicKey)!.amount;
            timestamp = recentInputTxs!.input!.timestamp;
        }
        txs.filter(({input}) => input!.timestamp > timestamp).forEach(({outputs}) => {
            outputs.find(({address, amount}) => {
                if (address === publicKey) balance +=amount;
            });
        });
        return balance;
    }

    sign(data: TransactionOutputInterface[]) {
        return this.keyPair.sign(SHA256Process(data));
    }
}