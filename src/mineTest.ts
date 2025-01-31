import Blockchain from "./utils/BlockChain"

const blockchain = new Blockchain();

for (let i = 0; i < 10; i++) {
    const block = blockchain.addBlock('data '+ i.toString());
    console.log(block.getDataString);
}