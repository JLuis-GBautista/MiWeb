import { SHA256 } from 'crypto-js';
import adjustDifficulty from './adjustDifficulty';
import SHA256Process from './modules/hash';
import Transaction from '../wallet/transaction';

export default class Block {
    public timestamp: number = 0;
    public previousHash:string | undefined = '';
    public hash: string = '';
    public data: Transaction[];
    public nonce: number = 0;
    public difficulty: number;

    constructor(timestamp: number, previousHash: string | undefined, hash: string, data: Transaction[], nonce: number, difficulty: number) {
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }
    // Primer bloque de la cadena
    public static get blockGenesis() {
        const timestamp = new Date(2000, 2, 5).getTime();
        return new this(timestamp, undefined, 'fkjdkdfslg', [], 0, 3);
    }
    // Ejemplo simple para emular la mineria de blockchain
    public static mine(previousBlock: Block, data: Transaction[]) {
        const DIFFICULTY: number = 3;
        const {hash: previousHash } = previousBlock;
        let hash: string;
        let nonce: number = 0;
        let timestamp: number;
        let difficulty: number;
        do {
            timestamp = Date.now();
            nonce += 1;
            difficulty = adjustDifficulty(previousBlock, timestamp);
            hash = this.hash(timestamp, previousHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
        
        return new this(timestamp, previousHash, hash, data, nonce, difficulty);
    }
    public static hash(timestamp: number, previousHash: string, data: Transaction[], nonce: number, difficulty: number) {
        return SHA256Process(`${timestamp}${previousHash}${data}${nonce}${difficulty}`);
    }
    public get getDataString() {
        const {timestamp, data, hash, previousHash, nonce, difficulty} = this;
        return `timestamp: ${timestamp}\nprevious: ${previousHash}\nhash: ${hash}\ndata: ${data}\nnonce: ${nonce}\ndifficulty: ${difficulty}`;
    }
}