import Wallet from "../../wallet/wallet";
import Blockchain from "../../utils/BlockChain";
import Transaction from "../../wallet/transaction";

const INITIAL_BALANCE = 100;

describe('Wallet', () => {
    let blockchain: Blockchain;
    let wallet: Wallet;

    beforeEach(() => {
        blockchain = new Blockchain();
        wallet = new Wallet(blockchain);
    });

    it("Es una wallet sana", () => {
        expect(wallet.balance).toEqual(INITIAL_BALANCE);
        expect(typeof wallet.keyPair).toEqual('object');
        expect(typeof wallet.publicKey).toEqual("string");
        expect(wallet.publicKey?.length).toEqual(130);
    });

    it("sing()", () => {
        const signature = wallet.sign([{address: "aqui", amount: 10}]);
        expect(typeof signature).toEqual("object");
        expect(signature).toEqual(wallet.sign([{address: "aqui", amount: 10}]));
    });

    describe("crear transaccion", () => {
        let tx: Transaction;
        let recipientAddress: string;
        let amount: number;

        beforeEach(() => {
            recipientAddress = "random-address";
            amount = 5;
            tx = wallet.createTransaction(recipientAddress, amount);
        });

        describe("recrear una transaccion", () => {
            beforeEach(() => {
                tx = wallet.createTransaction(recipientAddress, amount);
            });

            it("El doble de amount substraido de wallet balance", () => {
                const output = tx.outputs.find(({address}) => address === wallet.publicKey);
                expect(output?.amount).toEqual(wallet.balance - (amount * 2));
            });

            it("Clonar el amount mostrado desde el receptor", () => {
                const amounts = tx.outputs.filter(({address}) => address === recipientAddress).map((output) => output.amount);
                expect(amounts).toEqual([amount, amount]);
            });
        });
    });
    describe("Calcular balance", () => {
        let addBalance: number;
        let times: number;
        let senderWallet: Wallet;

        beforeEach(() => {
            addBalance = 16;
            times = 3;
            senderWallet = new Wallet(blockchain);

            for (let i = 0; i < times; i++) {
                senderWallet.createTransaction(wallet.publicKey, addBalance);
            }

            blockchain.addBlock(blockchain.memoryPool.transactions);
        });

        it("Calcular el balance a partir de las transacciones blockchain del recipiente", () => {
            expect(wallet.calculateBalance()).toEqual(INITIAL_BALANCE + (addBalance * times));
        });

        it("Calcular el balance a partir de las transacciones blockchain del enviador", () => {
            expect(senderWallet.calculateBalance()).toEqual(INITIAL_BALANCE - (addBalance * times));
        });

        describe("El recipiente conduce una transaccion", () => {
            let subtractBalance: number;
            let recipientBalance: number;

            beforeEach(() => {
                blockchain.memoryPool.wipe();
                subtractBalance = 64;
                recipientBalance = wallet.calculateBalance();

                wallet.createTransaction(senderWallet.publicKey, addBalance);
                blockchain.addBlock(blockchain.memoryPool.transactions);
            });

            describe("El remitente envia otra transaccion al remitente", () => {
                beforeEach(() => {
                    blockchain.memoryPool.wipe();
                    senderWallet.createTransaction(wallet.publicKey, addBalance);

                    blockchain.addBlock(blockchain.memoryPool.transactions);
                });

                it("Calcular el destinatario utilizando únicamente las transacciones desde la más reciente", () => {
                    expect(wallet.calculateBalance()).toEqual(recipientBalance - subtractBalance + addBalance);
                });
            });
        });
    });
});