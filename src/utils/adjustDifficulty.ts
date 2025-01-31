import Block from "./Block";

const MIN_RATE = 3000;

export default function adjustDifficulty(previousBlock: Block, timestamp: number) {
    const {difficulty} = previousBlock;
    return ((previousBlock.timestamp + MIN_RATE) > timestamp) ? (difficulty + 1) : (difficulty - 1);
}