import Block from "./utils/Block";

// genera los primeros 2 bloques
const block1 = Block.mine(Block.blockGenesis, '{"midata": "data"}');
const block2 = Block.mine(block1, '{"midata1": "data1"}');

console.log(block2.getDataString)