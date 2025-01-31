import Blockchain from "../utils/BlockChain";
import validateBlockchain from "../utils/validationBlockchain";
import Transaction from "../wallet/transaction";
import Wallet from "../wallet/wallet";

describe('validateBlockchain()', () => {
    let blockchain: Blockchain;
    let transaction: Transaction;
    let wallet: Wallet;
    let transaction2: Transaction;

    beforeEach(() => {
        blockchain = new Blockchain();
        wallet = new Wallet(blockchain);
        transaction = Transaction.create(wallet, "new-address", 5);
        transaction2 = Transaction.create(wallet, "new-address2", 4);
    });

    it('Validar un bloque correcto', () => {
        blockchain.addBlock([transaction]);
        blockchain.addBlock([transaction2]);
        expect(validateBlockchain(blockchain.blocks)).toBe(true);
    });

    it('Validacion de error en el bloque genesis', () => {
        blockchain.blocks[0].data = [transaction];
        expect(() => {
            validateBlockchain(blockchain.blocks);
        }).toThrow('El block genesis fue alterado');
    });

    it('Validacion de error en la sucesion de bloques', () => {
        blockchain.addBlock([transaction]);
        blockchain.blocks[1].previousHash = 'antecesorNuevo';
        expect(() => {
            validateBlockchain(blockchain.blocks);
        }).toThrow('El hash no esta vinculado con el bloque anterior');
    });

    it('Validacion de error en la estructura del hash', () => {
        blockchain.addBlock([transaction]);
        blockchain.blocks[1].hash = 'rfjoi434';
        expect(() => {
            validateBlockchain(blockchain.blocks);
        }).toThrow('El patron del hash es incorrecto');
    });
})