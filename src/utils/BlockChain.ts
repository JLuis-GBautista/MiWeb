import Block from "./Block";

export default class Blockchain {
    blocks: Block[];
    constructor() {
        this.blocks = [Block.blockGenesis];
    }

    addBlock(data: string) {
        const lastBlock = this.blocks[this.blocks.length - 1];
        const newBlock = Block.mine(lastBlock, data);
        this.blocks.push(newBlock);
        return newBlock;
    }
}