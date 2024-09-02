import Block from "../Block";
import Blockchain from "../BlockChain";

const validateBlockchain = (blockchain: Blockchain) => {
    const [blockGenesis, ...blocks] = blockchain.blocks;
    // Validar block genesis
    if (JSON.stringify(blockGenesis) !== JSON.stringify(Block.blockGenesis))
        throw new Error('El block genesis fue alterado');

    blocks.forEach((block, index) => {
        const {timestamp, data, hash, previousHash} = block;
        const previousBlock = blockchain.blocks[index];
        // Validacion por previous hash y hash del bloque anterior
        if (previousHash !== previousBlock.hash)
            throw new Error('El hash no esta vinculado con el bloque anterior');
        if (hash !== Block.hash(timestamp, previousHash, data))
            throw new Error('El patron del hash es incorrecto')
    });
    return true;
}
export default validateBlockchain;