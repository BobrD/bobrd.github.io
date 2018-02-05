import {TXOActions, xoActions} from './action';
import {getType} from 'typesafe-actions';
import * as R from 'ramda';
import {
    changeSize,
    EGameState, putStoneToBoard, removeStepFromGrid, clearBoard,
    saveStep,
    XOState, invertStone, TStep
} from './model';

const setNextStone = R.assoc('nextStone');

const setNextStoneOnStep = R.curry(({stone}: TStep, state: XOState) => setNextStone(invertStone(stone), state));

const makeStep = (state: XOState, step: TStep) => {
    if (state.gameState === EGameState.waitStart) {
        state = R.assoc('gameState', EGameState.inProgress, state);
    }

    return R.compose(
        saveStep(step),
        putStoneToBoard(step),
        setNextStoneOnStep(step)
    )(state);
};

const newGame = R.compose(
    R.assoc('gameState', EGameState.waitStart),
    clearBoard
);

const closeGameEndedWindow = R.compose(
    newGame,
    R.assoc('showGameEnded', false),
    R.assoc('gameResult', undefined)
);

export const xoReducer = <S extends XOState>(state: S, {type, payload}: TXOActions): S => {
    switch (type) {
        case getType(xoActions.step): {
            return makeStep(state, payload);
        }

        case getType(xoActions.newGame): {
            return newGame(state);
        }

        case getType(xoActions.changeSize): {
            // game not start update grid for apply changes
            if (state.gameState === EGameState.waitStart) {
                return changeSize(state, payload);
            }

            return state;
        }

        case getType(xoActions.gameEnded): {
            return R.compose(
                R.assoc('gameResult', payload),
                R.assoc('gameState', EGameState.eneded)
            )(state);
        }

        case getType(xoActions.changeStone): {
            if (state.gameState !== EGameState.waitStart) {
                return state;
            }

            return R.compose(
                R.assoc('playerStone', payload),
                setNextStone(payload)
            )(state);
        }

        case getType(xoActions.closeGameEndedWindow): {
            return closeGameEndedWindow(state);
        }

        case getType(xoActions.replayFrom): {
            const eqToStep = R.equals(payload);

            const index = R.findIndex(eqToStep, state.steps);

            // remove bottom steps from grid
            const nextGrid = R.range(index, state.steps.length).reduce((grid, i) => (
                removeStepFromGrid(grid, state.steps[i])
            ), state.board);

            const nextSteps = R.slice(0, index, state.steps);

            return R.assoc('board', nextGrid, R.assoc('steps', nextSteps, state));
        }

        case getType(xoActions.showMessage): {
            return R.assoc('message', payload, state);
        }

        case getType(xoActions.closeMessage): {
            return R.assoc('message', void 0, state);
        }

        case getType(xoActions.showGameEnded): {
            return R.assoc('showGameEnded', true, state);
        }

        default: {
            return state;
        }
    }
};
