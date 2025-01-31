import Block from "../utils/Block";
import Transaction from "../wallet/transaction";

describe('Block', () => {
    let timestamp: number;
    let previousBlock: Block;
    let hash: string;
    let data: Transaction[];
    let difficulty: number;
    let nonce: number;

    beforeEach(() => {
        timestamp = new Date(2001, 2, 5).getTime();
        previousBlock = Block.blockGenesis;
        data = [];
        hash = Block.hash(timestamp, previousBlock.hash, data, 0, 3);
        difficulty = 3;
        nonce = 192;
    });

    it('comparacion de blocks', () => {
        const block = new Block(timestamp, previousBlock.hash, hash, data, nonce, difficulty);

        expect(block.timestamp).toEqual(timestamp);
        expect(block.previousHash).toEqual(previousBlock.hash);
        expect(block.data).toEqual(data);
        expect(block.hash).toEqual(hash);
        expect(block.nonce).toEqual(nonce);
    });

    it('use Block.mine()', () => {
        const block = Block.mine(previousBlock, data);
        expect(block.nonce).not.toEqual(0);
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
        expect(block.hash.length).toEqual(64);
        expect(block.previousHash).toEqual(previousBlock.hash);
        expect(block.data).toEqual(data);
    });

    it('use Block.hash()', () => {
        const hash = Block.hash(timestamp, previousBlock.hash, data, nonce, difficulty);
        const expectHash = 'f8ba8e579754c2590c470d3e1a73b4ce41b861843e1e678a9fb10ec504a82775';

        expect(hash).toEqual(expectHash);
    });
});