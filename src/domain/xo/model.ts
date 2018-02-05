import * as R from 'ramda';

export enum EStone {
    x = 'x',
    o = 'o',
    empty = ' ',
}

export const invertStone = (stone: EStone) => stone === EStone.o ? EStone.x : EStone.o;

export const initialSize = 10;

export type TPoint = {x: number; y: number};

export type TStep = TPoint & {stone: EStone};

export type TBoard = EStone[];

// todo should be gte 0
export const pointToPosition = (size: number, {x, y}: TPoint) => y * size + x;

export const positionToPoint = (pos: number, size: number) => ({x: pos % size, y: pos / size | 0});

export const createEmptyElementFromStep = ({x, y}: TStep) => ({x, y, stone: EStone.empty});

export const changeSize = <S extends XOState>(s: S, size: number): S => R.assoc('board', generateBoard(size), s);

export const clearBoard = <S extends XOState>(s: S): S => R.assoc('board', generateBoard(Math.sqrt(s.board.length)), s);

export const putStoneToBoard = R.curry(<S extends XOState>(step: TStep, s: S): S => (
    R.assocPath(['board', pointToPosition(Math.sqrt(s.board.length), step)], step.stone, s)
));

export const removeStepFromGrid = (grid: TBoard, step: TStep) => (
    R.assoc(pointAsString(step), createEmptyElementFromStep(step), grid)
);

//           x  y
// right   ( 1  0 )
// left    (-1  0 )
// down    ( 0  1 )
// top     ( 0 -1 )
export const move = (xOffset: number, yOffset: number, {x, y}: TPoint) => ({x: x + xOffset, y: y + yOffset});

export const saveStep = R.curry(<S extends XOState>(step: TStep, s: S) => R.assoc('steps', R.append(step, s.steps), s));

export enum EGameState {
    waitStart = 'waitStart', // show welcome screen and wait while player select stone
    inProgress = 'inProgress', // game started when firs stone placed
    eneded = 'ended', // show result
}

export enum EMessages {
    startGame = 'startGame',
}

export type GameResult = {
    points: TPoint[];
    stone: EStone;
};

export type XOState = {
    board: TBoard;
    wait: boolean;  // wait step
    steps: TStep[];
    gameState: EGameState;
    playerStone: EStone;
    nextStone: EStone; // todo remove can be computed. using history and playerStone
    message: EMessages | void;
    disabledMessages: EMessages[];
    showGameEnded: boolean;
    gameResult: GameResult | void;
};

export const pointAsString = ({x, y}: TPoint) => `${x}:${y}`;

export const generateBoard = (size: number): TBoard => R.range(0, size * size).map(_ => EStone.empty);

export const initialXOState: XOState = {
    board: generateBoard(initialSize),
    wait: false,
    steps: [],
    gameState: EGameState.waitStart,
    playerStone: EStone.x, // set default player stone to "X"
    nextStone: EStone.x,
    message: undefined,
    disabledMessages: [],
    showGameEnded: false,
    gameResult: undefined,
};
