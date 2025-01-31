import Block from "./Block";
import validateBlockchain from "./validationBlockchain";
import MemoryPool from "./memoryPool";
import Transaction from "../wallet/transaction";

export default class Blockchain {
    blocks: Block[];
    memoryPool: MemoryPool;
    constructor() {
        this.blocks = [Block.blockGenesis];
        this.memoryPool = new MemoryPool();
    }

    addBlock(data: Transaction[]) {
        const lastBlock = this.blocks[this.blocks.length - 1];
        const newBlock = Block.mine(lastBlock, data);
        this.blocks.push(newBlock);
        return newBlock;
    }

    replace(newBlocks: Block[]) {
        if (newBlocks.length < this.blocks.length) throw Error('Hay un conflicto en la longitud de la cadena blockchain');
        try {
            validateBlockchain(newBlocks);
            console.log("aqui");
        } catch (error) {
            throw Error('Uno de los bloques esta corrupto');
        }
        this.blocks = newBlocks;
        return this.blocks;
    }
}