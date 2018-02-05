import {EStone, move, pointToPosition, TBoard, TPoint} from '../model';

export const getStone = (board: TBoard, point: TPoint): EStone | void => {
    const size = Math.sqrt(board.length);

    if (0 <= point.y && point.y < size && 0 <= point.x && point.x < size) {
        return board[pointToPosition(size, point)];
    }

    return undefined;
};

const findCountOpenedAndClosed = (board: TBoard, point: TPoint, rule: number, direction: [number, number]) => {
    const stone = getStone(board, point);

    let cloneOfPoint = {...point} as TPoint;

    let winning = 1;

    const [x, y] = direction;

    while (stone === getStone(board, cloneOfPoint = move(x, y, cloneOfPoint)) && winning <= rule) {
        winning += 1;
    }

    let opened = 0;
    let closed = 0;

    if (winning === rule) {
        if (
            EStone.empty === getStone(board, move(winning * x, winning * y, point)) &&
            EStone.empty === getStone(board, move(x * -1, y * -1, point)) // reverse move
        ) {
            opened = 1;
        } else  {
            closed = 1;
        }
    }

    return {opened, closed};
};

const sumCheckResult = (result: {opened: number; closed: number}, prev: {opened: number; closed: number}) => ({
    opened: result.opened + prev.opened,
    closed: result.closed + prev.closed,
});

export const checkRow = (board: TBoard, rule: number, checkStone: EStone) => {
    let checkResult = {opened: 0, closed: 0};

    const size = Math.sqrt(board.length);

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const stone = getStone(board, {x, y});

            if (stone !== checkStone) {
                continue;
            }

            // right
            if (x <= size - rule) {
                checkResult = sumCheckResult(checkResult, findCountOpenedAndClosed(board, {x, y}, rule, [1, 0]));
            }

            // vertical
            if (y <= size - rule) {
                // down
                checkResult = sumCheckResult(checkResult, findCountOpenedAndClosed(board, {x, y}, rule, [0, 1]));

                // left-top
                if (x >= rule - 1) {
                    checkResult = sumCheckResult(checkResult, findCountOpenedAndClosed(board, {x, y}, rule, [-1, 1]));
                }

                // right-down
                if (x <= size - rule) {
                    checkResult = sumCheckResult(checkResult, findCountOpenedAndClosed(board, {x, y}, rule, [1, 1]));
                }
            }
        }
    }

    return checkResult;
};
