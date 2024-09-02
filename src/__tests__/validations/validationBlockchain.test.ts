import Blockchain from "../../utils/BlockChain";
import validateBlockchain from "../../utils/validations/validationBlockchain";

describe('validateBlockchain()', () => {
    let blockchain: Blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
    });

    it('Validar un bloque correcto', () => {
        blockchain.addBlock('{"data": "t35t-d4t4"}');
        blockchain.addBlock('{"data2": "t35t-d4t5"}');
        expect(validateBlockchain(blockchain)).toBe(true);
    });

    it('Validacion de error en el bloque genesis', () => {
        blockchain.blocks[0].data = 'hola';
        expect(() => {
            validateBlockchain(blockchain);
        }).toThrow('El block genesis fue alterado');
    });

    it('Validacion de error en la sucesion de bloques', () => {
        blockchain.addBlock('{"data": "t35t-d4t4"}');
        blockchain.blocks[1].previousHash = 'antecesorNuevo';
        expect(() => {
            validateBlockchain(blockchain);
        }).toThrow('El hash no esta vinculado con el bloque anterior');
    });

    it('Validacion de error en la estructura del hash', () => {
        blockchain.addBlock('{"data": "t35t-d4t4"}');
        blockchain.blocks[1].hash = 'rfjoi434';
        expect(() => {
            validateBlockchain(blockchain);
        }).toThrow('El patron del hash es incorrecto');
    });
})