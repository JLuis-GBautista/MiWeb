import Block from "../utils/Block";

describe('Block', () => {
    let timestamp: number;
    let previousBlock: Block;
    let hash: string;
    let data: string;

    beforeEach(() => {
        timestamp = new Date(2001, 2, 5).getTime();
        previousBlock = Block.blockGenesis;
        data = '{"data": "t35t-d4t4"}';
        hash = Block.hash(timestamp, previousBlock.hash, data);
    });

    it('comparacion de blocks', () => {
        const block = new Block(timestamp, previousBlock.hash, hash, data);

        expect(block.timestamp).toEqual(timestamp);
        expect(block.previousHash).toEqual(previousBlock.hash);
        expect(block.data).toEqual(data);
        expect(block.hash).toEqual(hash);
    });

    it('use Block.mine()', () => {
        const block = Block.mine(previousBlock, data);

        expect(block.hash.length).toEqual(64);
        expect(block.previousHash).toEqual(previousBlock.hash);
        expect(block.data).toEqual(data);
    });

    it('use Block.hash()', () => {
        const hash = Block.hash(timestamp, previousBlock.hash, data);
        const expectHash = '9efe7fc28b251cac95b99866e199b49574412e9bff8e5d97bb8a864e0afede97';

        expect(hash).toEqual(expectHash);
    });
});