import { SHA256 } from 'crypto-js';

export default class Block {
    public timestamp: number = 0;
    public previousHash:string | undefined = '';
    public hash: string = '';
    public data: string = '';
    constructor(timestamp: number, previousHash: string | undefined, hash: string, data: string) {
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = hash;
        this.data = data;
    }
    // Primer bloque de la cadena
    public static get blockGenesis() {
        const timestamp = new Date(2000, 2, 5).getTime();
        return new this(timestamp, undefined, 'fkjdkdfslg', '{"midataG": "midataG"}');
    }
    // Ejemplo simple para emular la mineria de blockchain
    public static mine(previousBlock: Block, data: string) {
        const timestamp = Date.now();
        const {hash: previousHash } = previousBlock;
        const hash = this.hash(timestamp, previousHash,data);
        return new this(timestamp, previousHash, hash, data);
    }
    public static hash(timestamp: number, previousHash: string, data: string) {
        return SHA256(`${timestamp}${previousHash}${data}`).toString();
    }
    public get getDataString() {
        const {timestamp,data,hash,previousHash} = this;
        return `timestamp: ${timestamp}\nprevious: ${previousHash}\nhash: ${hash}\ndata: ${data}`;
    }
}