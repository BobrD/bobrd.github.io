import {
    EStone,
    generateBoard, initialXOState, pointToPosition, positionToPoint,
} from '../../../src/domain/xo/model';
import {checkWin} from '../../../src/domain/xo/io/checkWin';
import {ioMakeStep} from '../../../src/domain/xo/io/botMakeStep';

const steps = [
    {x: 3, y: 4, stone: 'x'},
    {x: 2, y: 3, stone: 'o'},
    {x: 4, y: 5, stone: 'x'},
    {x: 4, y: 4, stone: 'o'},
    {x: 5, y: 6, stone: 'x'},
    {x: 3, y: 5, stone: 'o'},
    {x: 6, y: 7, stone: 'x'},
    {x: 7, y: 8, stone: 'o'},
    {x: 7, y: 6, stone: 'x'},
    {x: 2, y: 6, stone: 'o'},
    {x: 1, y: 7, stone: 'x'},
    {x: 5, y: 3, stone: 'o'},
    {x: 5, y: 5, stone: 'x'},
    {x: 6, y: 2, stone: 'o'},
];

const board = generateBoard(20);

it('io functional test', () => {

    let botNext = false;

    steps.forEach(step => {
        if (botNext) {

            const botPos = ioMakeStep(board, EStone.x);

            expect({x: step.x, y: step.y}).toEqual(positionToPoint(botPos, 20));
        }

        board[pointToPosition(20, step)] = step.stone as EStone;

        botNext = !botNext;
    });

    expect(checkWin(board)).toEqual({direction: [-1, 1], matched: 5, x: 6, y: 2});
});
