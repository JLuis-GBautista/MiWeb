import Blockchain from "../../utils/BlockChain";
import Transaction, { REWARD } from "../../wallet/transaction";
import Wallet from "../../wallet/wallet";

describe('Transaction', () => {
    let wallet: Wallet;
    let transaction: Transaction;
    let amount: number;
    let recipientAddress: string;
    let blockchain: Blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
        wallet = new Wallet(blockchain);
        recipientAddress = "recipient";
        amount = 5;
        transaction = Transaction.create(wallet, recipientAddress, amount);
    });

    it('Salida de dinero extraida de la wallet balance', () => {
        const output = transaction.outputs.find(({address}) => address === wallet.publicKey);
        expect(output?.amount).toEqual(wallet.balance - amount);
    });

    it('Salida de dinero aderido a un recipiente', () => {
        const output = transaction.outputs.find(({address}) => address === recipientAddress);
        expect(output?.amount).toEqual(amount);
    });

    describe("Transaccion con dinero mayor al disponible", () => {
        beforeEach(() => {
            amount = 500;
            transaction;
        });

        it("No has creado una transaccion", () => {
            expect(() => {
                transaction = Transaction.create(wallet, recipientAddress, amount);
            }).toThrow(`Amount: ${amount} exceeds balance`);
        });
    });

    it("input balance test wallet", () => {
        expect(transaction.input?.amount).toEqual(wallet.balance);
    });

    it("comprobando direccion del emitente de la transaccion", () => {
        expect(transaction.input?.address).toEqual(wallet.publicKey);
    });

    it("La firma de la wallet pertenece a la wallet", () => {
        expect(typeof transaction.input?.signature).toEqual("object");
        expect(transaction.input?.signature).toEqual(wallet.sign(transaction.outputs));
    });

    it("Validar una validacion de transaccion", () => {
        expect(Transaction.verify(transaction)).toBe(true);
    });

    it("Invalidar una transaccion corrupta", () => {
        transaction.outputs[0].amount = 500;
        expect(Transaction.verify(transaction)).toBe(false);
    });

    describe("actualizando una transaccion", () => {
        let nextAmount: number;
        let nextRecipient: string;

        beforeEach(() => {
            nextAmount = 3;
            nextRecipient = "next-address";
            transaction.update(wallet, nextRecipient, nextAmount)
        });

        it("extraer el siguiente amount desde la wallet emitente", () => {
            const output = transaction.outputs.find(({address}) => address === wallet.publicKey);
            expect(output?.amount).toEqual(wallet.balance - amount - nextAmount);
        });

        it("Mostrar un amount para el siguiente recipiente", () => {
            const output = transaction.outputs.find(({address}) => address === nextRecipient);
            expect(output?.amount).toEqual(nextAmount);
        });
    });

    describe("crear transaccion reward", () => {
        let blockchain: Blockchain;
        let wallet: Wallet;
        let blockchainWallet: Wallet;
        let transaction: Transaction;

        beforeEach(() => {
            blockchain = new Blockchain();
            wallet = new Wallet(blockchain);
            blockchainWallet = new Wallet(blockchain);
            transaction =Transaction.reward(wallet, blockchainWallet);
        });

        it("Premiar los miner wallets", () => {
            expect(transaction.outputs.length).toEqual(2);

            let output = transaction.outputs.find(({ address }) => address === wallet.publicKey);
            expect(output?.amount).toEqual(REWARD);

            output = transaction.outputs.find(({ address }) => address === blockchainWallet.publicKey);
            expect(output?.amount).toEqual(blockchainWallet.balance - REWARD);
        });
    });
});