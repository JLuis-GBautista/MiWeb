import P2PServer from "../../p2p";
import Transaction from "../../wallet/transaction";
import Wallet from "../../wallet/wallet";
import Blockchain from "../BlockChain";
import { MESSAGE } from "../../p2p";

export default class Miner {
    blockchain: Blockchain;
    p2pService: P2PServer;
    wallet: Wallet;
    blockchainWallet: Wallet;

    constructor(blockchain: Blockchain, p2pService: P2PServer, wallet: Wallet) {
        this.blockchain = blockchain;
        this.p2pService = p2pService;
        this.wallet = wallet;
        this.blockchainWallet = new Wallet(blockchain);
    }

    mine() {
        const { blockchain: { memoryPool }, wallet, p2pService } = this;
        if (memoryPool.transactions.length === 0) throw Error("No hay transacciones por confirmar");

        memoryPool.transactions.push(Transaction.reward(wallet, this.blockchainWallet));
        const block = this.blockchain.addBlock(memoryPool.transactions);
        p2pService.sync();
        memoryPool.wipe();
        p2pService.broadcast(MESSAGE.WIPE);
        return block;
    }
}