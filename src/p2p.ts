import webSocket from 'ws';
import Blockchain from './utils/BlockChain';
import Block from './utils/Block';
import Transaction from './wallet/transaction';

const P2P_PORT = process.env.P2P_PORT ? parseInt(process.env.P2P_PORT) : 5000;
const PEERS = process.env.PEERS || '';

export const MESSAGE = { BLOCKS: 'blocks', TX: 'transaction', WIPE: 'wipe_memory_pool' };

export default class P2PServer {
    blockchain: Blockchain;
    sockets: webSocket[];

    constructor(blockchain: Blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
    }

    listen() {
        const server = new webSocket.Server({port: P2P_PORT});
        const peers = PEERS.length !== 0 ? PEERS.trim().split(',') : [];
        console.log(peers)
        server.on('connection', (socket) => this.onConnection(socket));

        peers.forEach(peer => {
            console.log(peer)
            const socket = new webSocket(peer);
            socket.on('open', () => this.onConnection(socket));
            socket.on('error', (error) => {
                console.error(`[ws:error] No se pudo conectar a ${peer}: ${error}`);
              });
          
              socket.on('close', () => {
                console.warn(`[ws:close] Conexión cerrada con ${peer}`);
              });
        })
        console.log(`service P2P: ${P2P_PORT} listening...`)
    }

    onConnection(socket: webSocket) {
        const { blockchain } = this;
        console.log('[ws:socket] connected');
        this.sockets.push(socket);
        socket.on('message', message => {
            const { type, value }: { type: string, value: Block[] | Transaction} = JSON.parse(message.toString());
            try {
                if (type === MESSAGE.BLOCKS) blockchain.replace(value as Block[]);
                else if (type === MESSAGE.TX) blockchain.memoryPool.addOrUpdate(value as Transaction);
                else if (type === MESSAGE.WIPE) blockchain.memoryPool.wipe();
            } catch (error) {
                console.log(`[ws:message]: error ${error}`);
                throw Error(`${error}`);
            }
        });
        socket.send(JSON.stringify({type: MESSAGE.BLOCKS, value: blockchain.blocks}));
    }

    sync() {
        const { blockchain: {blocks} } = this;
        this.broadcast(MESSAGE.BLOCKS, blocks)
    }

    broadcast(type: string, value?: Block[] | Transaction) {
        console.log(`[ws:broadcast]: ${type}...`);
        const message = JSON.stringify({type, value});
        this.sockets.forEach(socket => socket.send(message));
    }
}