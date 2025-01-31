import Block from "./Block";

const validateBlockchain = (blockchain: Block[]) => {
    const [blockGenesis, ...blocks] = blockchain;
    // Validar block genesis
    if (JSON.stringify(blockGenesis) !== JSON.stringify(Block.blockGenesis))
        throw new Error('El block genesis fue alterado');

    blocks.forEach((block, index) => {
        const {timestamp, data, hash, previousHash, nonce, difficulty} = block;
        const previousBlock = blockchain[index];
        // Validacion por previous hash y hash del bloque anterior
        if (previousHash !== previousBlock.hash)
            throw Error('El hash no esta vinculado con el bloque anterior');
        if (hash !== Block.hash(timestamp, previousHash, data, nonce, difficulty))
            throw Error('El patron del hash es incorrecto')
    });
    return true;
}
export default validateBlockchain;