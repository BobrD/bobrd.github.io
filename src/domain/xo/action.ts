import {createAction} from 'typesafe-actions';
import {$call} from 'utility-types';
import {EMessages, EStone, GameResult, TStep} from './model';

export const xoActions = {
    // saga
    playerStep: createAction('PLAYER_STEP', (x: number, y: number) => ({
        type: 'PLAYER_STEP',
        payload: {x, y},
    })),

    // actions
    step: createAction('STEP', (x, y, stone: EStone) => ({
        type: 'STEP',
        payload: {x, y, stone},
    })),

    newGame: createAction('NEW_GAME', () => ({
        type: 'NEW_GAME',
        payload: void 0,
    })),

    startGame: createAction('START_GAME', () => ({
        type: 'START_GAME',
        payload: void 0,
    })),

    randomPlayerStep: createAction('RANDOM_PLAYER_STEP', () => ({
        type: 'RANDOM_PLAYER_STEP',
        payload: void 0,
    })),

    changeSize: createAction('CHANGE_SIZE', (size: number) => ({
        type: 'CHANGE_SIZE',
        payload: size,
    })),

    changeStone: createAction('CHANGE_STONE', (stone: EStone) => ({
        type: 'CHANGE_STONE',
        payload: stone,
    })),

    showMessage: createAction('SHOW_MESSAGE', (message: EMessages) => ({
        type: 'SHOW_MESSAGE',
        payload: message,
    })),

    closeMessage: createAction('CLOSE_MESSAGE', () => ({
        type: 'CLOSE_MESSAGE',
        payload: void 0,
    })),

    gameEnded: createAction('GAME_ENDED', (gameResult: GameResult) => ({
        type: 'GAME_ENDED',
        payload: gameResult,
    })),

    showGameEnded: createAction('SHOW_GAME_ENDED', () => ({
        type: 'SHOW_GAME_ENDED',
        payload: void 0,
    })),

    closeGameEndedWindow: createAction('CLOSE_GAME_ENDED_WINDOW', () => ({
        type: 'CLOSE_GAME_ENDED_WINDOW',
        payload: void 0,
    })),

    replayFrom: createAction('REPLAY_FROM', (step: TStep) => ({
        type: 'REPLAY_FROM',
        payload: step,
    })),
};

const returnsOfActions = Object.values(xoActions).map($call);

export type TXOActions = typeof returnsOfActions[number];
