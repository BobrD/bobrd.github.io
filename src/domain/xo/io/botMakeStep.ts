import {EStone, invertStone, TBoard} from '../model';
import {checkRow} from './checkRow';

const getResult = (board: TBoard, stone: EStone) => {
    const result = {};

    for (let rule = 2; rule <= 6; rule++) {
        const {opened, closed} = checkRow(board, rule, stone);

        result[`o${rule}`] = opened;
        result[`c${rule}`] = closed;
    }

    return result;
};

const createBoardCopy = (board: TBoard, position: number, stone: EStone) => {
    const copy = new Array(board.length);

    // the fastest way
    for (let i = 0, l = board.length; i < l; i++) {
        copy[i] = board[i];
    }

    copy[position] = stone;

    return copy;
};

const defense = (board: TBoard, me: EStone, enemy: EStone) => {
    let bestResult = null;
    let bestPos = 0;
    let moveResult = null;

    for (let position = 0; position < board.length; position++) {
        if (board[position] !== EStone.empty) {
            continue;
        }

        let result = getResult(createBoardCopy(board, position, enemy), enemy);

        if (bestResult == null) {
            bestPos = position;
            bestResult = result;
            moveResult = getResult(createBoardCopy(board, position, me), me);
        } else {
            const betterThan = isBetter(result, bestResult);

            if (null === betterThan) {
                // get the best of two
                result = getResult(createBoardCopy(board, position, me), me);

                if (isBetter(result, moveResult)) {
                    bestPos = position;
                    moveResult = result;
                }
            } else if (betterThan) {
                bestPos = position;
                bestResult = result;
            }
        }
    }

    return {bestResult, bestPos};
};

const offense = (board: TBoard, me: EStone, bestResult) => {
    const countBefore3 = checkRow(board, 3, me);
    const countBefore4 = checkRow(board, 4, me);

    let bestPos = null;

    for (let position = 0; position < board.length; position++) {
        if (board[position] !== EStone.empty) {
            continue;
        }

        const boardClone = createBoardCopy(board, position, me);

        if (bestResult.o4 === 0) {
            let checkResult = checkRow(boardClone, 4, me);

            if (checkResult.closed - countBefore4.closed > 0) {
                bestPos = position;
            }

            checkResult = checkRow(boardClone, 3, me);

            if (checkResult.opened - countBefore3.opened > 0) {
                bestPos = position;
            }
        }

        if (checkRow(boardClone, 4, me).opened > 0) {
            bestPos = position;

            break;
        }
    }

    return bestPos;
};

export const isBetter = (x, y): boolean | null => {
    if (x.o5 + x.c5 === y.o5 + y.c5) {
        if (x.o4 === y.o4) {
            if (x.o3 === y.o3) {
                if (x.o2 === y.o2) {
                    if (x.c4 === y.c4) {
                        if (x.c3 === y.c3) {
                            if (x.c2 === y.c2) {
                                return null;
                            } else {
                                return x.c2 > y.c2;
                            }
                        } else {
                            return x.c3 > y.c3;
                        }
                    } else {
                        return x.c4 > y.c4;
                    }
                } else {
                    return x.o2 > y.o2;
                }
            } else {
                return x.o3 > y.o3;
            }
        } else {
            return x.o4 > y.o4;
        }
    } else {
        return x.o5 + x.c5 > y.o5 + y.c5;
    }
};

const winMove = (board: TBoard, me: EStone) => {
    for (let position = 0; position < board.length; position++) {
        const stone = board[position];

        if (stone !== EStone.empty) {
            continue;
        }

        const {opened, closed} = checkRow(createBoardCopy(board, position, me), 5, me);

        if (opened + closed > 0) {
            return position;
        }
    }

    return null;
};

export const ioMakeStep = (board: TBoard, player: EStone): number => {
    const me = invertStone(player);

    /* tslint:disable */
    let {bestPos, bestResult} = defense(board, me, player);

    if (bestResult.o5 + bestResult.c5 === 0) {
        const newBestPos = offense(board, me, bestResult);

        if (null !== newBestPos) {
            bestPos = newBestPos;
        }
    }

    const winPos = winMove(board, me);

    if (null !== winPos) {
        bestPos = winPos;
    }

    if (board[bestPos] !== EStone.empty) {
        /* tslint:disable */
        console.error('superposition! = ' + bestPos + ' = ' + board[bestPos]);
    }

    return bestPos;
};
