import express, { Request, Response } from 'express';
import Blockchain from './utils/BlockChain';
import P2PServer, { MESSAGE } from './p2p';
import Wallet from './wallet/wallet';
import Transaction from './wallet/transaction';
import Miner from './utils/miner/miner';
// // genera los primeros 2 bloques
// const block1 = Block.mine(Block.blockGenesis, '{"midata": "data"}');
// const block2 = Block.mine(block1, '{"midata1": "data1"}');

// console.log(block2.getDataString)

const port = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 3000;
console.log(port)
const app = express();
const blockchain = new Blockchain();
const p2pService = new P2PServer(blockchain);
const wallet = new Wallet(blockchain);
const walletMiner = new Wallet(blockchain);
const miner = new Miner(blockchain, p2pService, walletMiner);

app.use(express.json());

app.get('/blocks', (_req: Request, res: Response): void => {
    res.status(200).json(blockchain.blocks);
});

app.post('/mine', (req: Request, res: Response) => {
    const { data } = req.body as { data: Transaction[] };
    const block = blockchain.addBlock(data);
    p2pService.sync();
    res.status(201).json({
        totalBlocks: blockchain.blocks.length,
        newBlock: block
    })
});

app.get('/mine/transactions', (req, res) => {
    try {
        miner.mine();
        res.redirect('/blocks');
    } catch (error) {
        res.status(400).json(error);
    }
});

app.get('/transactions', (req, res) => {
    const { memoryPool: {transactions} } = blockchain;
    res.status(200).json(transactions);
});

app.post('/transaction', (req, res) => {
    const { body: {recipient, amount }} = req;
    try {
        const tx = wallet.createTransaction(recipient, amount);
        p2pService.broadcast(MESSAGE.TX, tx);
        res.status(201).json(tx);
    } catch (error) {
        res.json({ error: error})
    }
})

app.listen(port, () => {
    console.log('El servidor esta activo en el puerto: ' + port);
    p2pService.listen();
})