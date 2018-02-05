import * as React from 'react';
import {dispatchAware, WithDispatchProps} from '../hoc/DispatchAware';
import {XOState} from '../domain/xo/model';
import {SyntheticEvent} from 'react';
import {oSymbol, xSymbol} from './consts';
import {xoActions} from '../domain/xo/action';

type TWelcomeProps = {
    size: number;
} & WithDispatchProps<XOState>;

@(dispatchAware() as any)
export class Header extends React.Component<TWelcomeProps> {
    render() {
        return (
            <div>
                <div>Hi! Let's game.</div>
                <div>
                    <div>Grid size.</div>
                    <input type="number" value={this.props.size} onChange={this.changeSize}/>
                </div>
                <div>
                    <div>
                        Select stone <button>{xSymbol}</button><button>{oSymbol}</button>
                    </div>
                </div>
                <button onClick={this.newGame}>New game</button>
            </div>
        );
    }

    private newGame = (e: SyntheticEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        this.props.dispatch(xoActions.newGame());
    }

    private changeSize = (e: SyntheticEvent<HTMLInputElement>) => {
        e.stopPropagation();

        this.props.dispatch(xoActions.changeSize(+e.currentTarget.value));
    }
}
