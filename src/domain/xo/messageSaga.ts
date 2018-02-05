import {call, cancel, fork, put, take} from 'redux-saga/effects';
import {xoActions} from './action';
import {getType} from 'typesafe-actions';
import {EMessages, EStone} from './model';
import {delay} from 'redux-saga';

const handlers = {
    [getType(xoActions.changeStone)]: changeStone,
};

export function* messageSaga() {
    let prevFork;

    while (true) {
        const action = yield take('*');

        const handler = handlers[action.type];

        if (void 0 === handler) {
            continue;
        }

        if (prevFork) {
            yield cancel(prevFork);
        }

        prevFork = yield fork(showMessage, handler, action);
    }
}

function* showMessage(handler: any, action: any) {
    yield call(handler, action);

    yield delay(5000);

    yield put(xoActions.closeMessage());
}

function* changeStone(action: any) {
    if (action.payload === EStone.o) {
        yield put(xoActions.showMessage(EMessages.startGame));
    }
}
