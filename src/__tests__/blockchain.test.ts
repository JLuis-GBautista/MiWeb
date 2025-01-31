import Block from "../utils/Block";
import Blockchain from "../utils/BlockChain";
import Transaction from "../wallet/transaction";
import Wallet from "../wallet/wallet";

describe('BlockChain', () => {
    let blockchain: Blockchain;
    let blockchainB: Blockchain;
    let wallet: Wallet;
    let wallet2: Wallet;
    let transaction: Transaction;
    let transaction2: Transaction;

    beforeEach(() => {
        blockchain = new Blockchain();
        blockchainB = new Blockchain();     
        wallet = new Wallet(blockchain);
        wallet2 = new Wallet(blockchainB);
        transaction = Transaction.create(wallet, "new-address", 5);
        transaction2 = Transaction.create(wallet2, "new-address2", 4);
    });

    it('El blockchain tiene un bloque genesis?', () => {
        const [genesisBlock] = blockchain.blocks;

        expect(genesisBlock).toEqual(Block.blockGenesis);
        expect(blockchain.blocks.length).toEqual(1);
    });

    it('use Blockchain.addBlock()', () => {
        const data = [transaction];
        blockchain.addBlock(data);
        const [, lastBlock] = blockchain.blocks;

        expect(lastBlock.data).toEqual(data);
        expect(blockchain.blocks.length).toEqual(2);
    });

    it('use Blockchain.replace() exit case', () => {
        blockchainB.addBlock([transaction2]);
        blockchain.replace(blockchainB.blocks);
        expect(blockchain.blocks).toEqual(blockchainB.blocks);
    });

    it('use Blockchain.replace() fail longer case', () => {
        blockchain.addBlock([transaction]);
        expect(() => {
            blockchain.replace(blockchainB.blocks);
        }).toThrow('Hay un conflicto en la longitud de la cadena blockchain');
    });

    it('use Blockchain.replace() fail valid case', () => {
        blockchainB.addBlock([transaction2]);
        blockchainB.blocks[1].data = [];
        expect(() => {
            blockchain.replace(blockchainB.blocks);
        }).toThrow('Uno de los bloques esta corrupto');
    });
});