import {call, put, select, takeEvery} from 'redux-saga/effects';
import {xoActions} from './action';
import {getType, isActionOf} from 'typesafe-actions';
import {EStone, invertStone, move, positionToPoint, TBoard, TPoint, XOState} from './model';
import {ioMakeStep} from './io/botMakeStep';
import {checkWin, WinResult} from './io/checkWin';
import {Action} from 'redux';
import * as R from 'ramda';
import {delay} from 'redux-saga';

const boardSize = (board: TBoard) => Math.sqrt(board.length);
const selectBoard = ({board}: XOState) => board;
const selectPlayerStone = ({playerStone}: XOState) => playerStone;
const selectBoardSize = R.compose(boardSize, selectBoard);

export function* watchGame() {
    yield takeEvery([
        getType(xoActions.playerStep),
        getType(xoActions.startGame),
    ], nextStepSaga);

    yield takeEvery(getType(xoActions.randomPlayerStep), randomPlayerStep);
}

const createWinPoints = ({direction, x, y, matched}: WinResult): TPoint[] => R.compose(
    R.reduce(
        points => R.append(
            (move as any)(...direction, R.last(points)),
            points
        ),
        [{x, y}]
    ),
    R.range(0)
)(matched - 1);

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

// todo refactor
function* nextStepSaga(action: Action) {
    const currentStone = (yield select(({nextStone}) => nextStone)) as EStone;

    const playerStone = yield select(selectPlayerStone);

    if (isActionOf(xoActions.startGame)(action) && playerStone === EStone.o) {
        yield call(ioMakeStepSaga);
    }

    if (isActionOf(xoActions.playerStep)(action)) {
        // prevent "fast" click
        if (currentStone !== playerStone) {
            return;
        }

        yield call(playerStepSaga, action);

        let hasCells = yield call(hasEmptyCells);

        // todo refactor remove copy-paste
        if (! hasCells) {
            yield put(xoActions.gameEnded({points: [], stone: EStone.empty}));

            yield delay(1000);

            yield put(xoActions.showGameEnded());

            return;
        }

        yield call(ioMakeStepSaga);

        hasCells = yield call(hasEmptyCells);

        // todo refactor remove copy-paste
        if (! hasCells) {
            yield put(xoActions.gameEnded({points: [], stone: EStone.empty}));

            yield delay(1000);

            yield put(xoActions.showGameEnded());

            return;
        }
    }

    const newGrid = yield select(selectBoard);

    const winResult = checkWin(newGrid);

    if (winResult) {
        const points = createWinPoints(winResult);

        yield put(xoActions.gameEnded({points, stone: currentStone}));

        // show "result"
        yield delay(2000);

        yield put(xoActions.showGameEnded());
    }
}

function* hasEmptyCells() {
    // tslint:disable
    const steps = yield select(({steps}: XOState) => steps.length);

    const allCells = (yield select(selectBoard)).length;

    return steps < allCells;
}

function* randomPlayerStep() {
    const size = yield select(selectBoardSize);

    const [x, y] = [random(0, size), random(0, size)];

    yield call(playerStepSaga, xoActions.playerStep(x, y));
}

function* playerStepSaga({payload: {x, y}}: any) {
    const playerStone = yield select(selectPlayerStone);

    // render player step
    yield put(xoActions.step(x, y, playerStone));
}

function* ioMakeStepSaga() {
    const board = yield select(selectBoard);

    const playerStone = yield select(selectPlayerStone);

    const botStep = ioMakeStep(board, playerStone);

    const botPoint = positionToPoint(botStep, Math.sqrt(board.length));

    const ioStone = invertStone(playerStone);

    // render bot step
    yield put(xoActions.step(botPoint.x, botPoint.y, ioStone));
}
