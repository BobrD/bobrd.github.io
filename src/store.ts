import { createStore, applyMiddleware, compose } from 'redux';
import {initialXOState, XOState} from './domain/xo/model';
import {xoReducer} from './domain/xo/reducer';
import createSagaMiddleware from 'redux-saga';
import {watchGame} from './domain/xo/gameSaga';
import { fork} from 'redux-saga/effects';
import {messageSaga} from './domain/xo/messageSaga';

const composeEnhancers = (
    process.env.NODE_ENV === 'development' &&
    window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) || compose;

const sagaMiddleware = createSagaMiddleware();

const configureStore = (initialState: XOState) => {

    const enhancer = composeEnhancers(
        applyMiddleware(sagaMiddleware)
    );

    return createStore(
        xoReducer,
        initialState,
        enhancer
    );
};

export const store = configureStore(initialXOState);

sagaMiddleware.run(function* rootSaga() {
    yield fork(watchGame);
    yield fork(messageSaga);
});
