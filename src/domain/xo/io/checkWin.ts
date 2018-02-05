import {EStone, TBoard, TPoint, move} from '../model';
import {getStone} from './checkRow';

const check = (moveDirection: [number, number], board: TBoard, point: TPoint, stone: EStone): number => {
    let matched = 0;

    while (true) {
        point = (move as any)(...moveDirection, point);

        const nextStone = getStone(board, point);

        if (undefined === nextStone || nextStone !== stone) {
            break;
        }

        matched++;
    }

    return matched;
};

const checkDirections: Array<[number, number]> = [[1, 0], [0, 1], [-1, 1], [1, 1]];

export type WinResult = {
    x: number;
    y: number;
    matched: number;
    direction: [number, number];
};

export const checkWin = (board: TBoard, gameRule: number = 5): WinResult | false => {

    const size = Math.sqrt(board.length);

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const stone = getStone(board, {x, y}) as EStone;

            if (EStone.empty === stone) {
                continue;
            }

            for (const direction of checkDirections) {
                const matched = check(direction, board, {x, y}, stone) + 1;

                if (matched >= gameRule) {
                    return {x, y, matched, direction};
                }
            }
        }
    }

    return false;
};
