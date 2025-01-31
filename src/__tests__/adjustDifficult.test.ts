import adjustDifficulty from "../utils/adjustDifficulty";
import Block from "../utils/Block"

describe('adjustDifficult()', () => {
    let block: Block;

    beforeEach(() => {
        block = new Block(Date.now(), undefined, '', [], 0, 3);
    });

    it('Menor dificultad para disminucion de minado de bloques', () => {
        expect(adjustDifficulty(block, block.timestamp+60000)).toEqual(block.difficulty - 1);
    });

    it('Mayor dificultad para incremento de minado de bloques', () => {
        expect(adjustDifficulty(block, block.timestamp+1000)).toEqual(block.difficulty + 1);
    });
})