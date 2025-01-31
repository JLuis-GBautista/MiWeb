import {v1} from 'uuid';
import Wallet from './wallet';
import { TransactionInputInterface, TransactionOutputInterface } from './properties.interface';
import ellipticProcess from '../utils/modules/elliptic';

export const REWARD = 1;

export default class Transaction {
    id: string;
    input: TransactionInputInterface | null;
    outputs: TransactionOutputInterface[];

    constructor() {
        this.id = v1();
        this.input = null;
        this.outputs = [];
    }

    static create(senderWallet: Wallet, recipientAddress: string, amount: number) {
        const {balance, publicKey} = senderWallet;

        if (amount > balance) throw Error(`Amount: ${amount} exceeds balance`);
        const transaction = new Transaction();
        transaction.outputs.push(...[
            {amount: balance - amount, address: publicKey },
            {amount, address: recipientAddress},
        ]);

        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(transaction.outputs)
        }
        return transaction;
    }

    static reward(minerWallet: Wallet, blockchainWallet: Wallet) {
        return this.create(blockchainWallet, minerWallet.publicKey, REWARD);
    }

    static verify(transaction: Transaction) {
        const { input, outputs } = transaction;
        return ellipticProcess.verifySignature(input!.address, input!.signature, outputs);
    }

    static sign(transaction: Transaction, senderWallet: Wallet) {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(transaction.outputs)
        }
    }

    update(senderWallet: Wallet, recipientAddress: string, amount: number) {
        const senderOutput = this.outputs.find((output) => output.address === senderWallet.publicKey);
        if (amount > senderOutput!.amount) throw Error(`Amount: ${amount} exceeds balance`);
        senderOutput!.amount -= amount;
        this.outputs.push({ amount, address: recipientAddress });
        this.input = Transaction.sign(this, senderWallet);

        return this;
    }
}