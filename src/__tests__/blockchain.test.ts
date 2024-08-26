import Block from "../utils/Block";
import Blockchain from "../utils/BlockChain";

describe('BlockChain', () => {
    let blockchain: Blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
    });

    it('El blockchain tiene un bloque genesis?', () => {
        const [genesisBlock] = blockchain.blocks;

        expect(genesisBlock).toEqual(Block.blockGenesis);
        expect(blockchain.blocks.length).toEqual(1);
    });

    it('use Blockchain.addBlock()', () => {
        const data = '{"data": "t35t-d4t4"}';
        blockchain.addBlock(data);
        const [, lastBlock] = blockchain.blocks;

        expect(lastBlock.data).toEqual(data);
        expect(blockchain.blocks.length).toEqual(2);
    })
});