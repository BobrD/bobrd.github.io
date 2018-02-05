import {EGameState, EStone, XOState} from '../../domain/xo/model';
import {YellowPanelButton} from '../UIComponents/Buttons';
import * as React from 'react';
import {xoActions} from '../../domain/xo/action';
import {dispatchAware, WithDispatchProps} from '../../hoc/DispatchAware';
import {SyntheticEvent} from 'react';

type Props = {
    gameState: EGameState;
    playerStone: EStone;
} & WithDispatchProps<XOState>;

@(dispatchAware as any)()
export class NewGameButton extends React.Component<Props> {
    render() {
        return (
            <YellowPanelButton direction="l" onClick={this.handleClick}>
                {this.text()}
            </YellowPanelButton>
        );
    }

    private text = () => {
        if (this.props.gameState === EGameState.waitStart && this.props.playerStone === EStone.x) {
            return 'put random';
        } else if (this.props.gameState === EGameState.waitStart) {
            return 'start game';
        }

        return 'new game';
    }

    private handleClick = (e: SyntheticEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (this.props.gameState === EGameState.waitStart && this.props.playerStone === EStone.x) {
            this.props.dispatch(xoActions.randomPlayerStep());
        } else if (this.props.gameState === EGameState.waitStart) {
            this.props.dispatch(xoActions.startGame());
        } else {
            this.props.dispatch(xoActions.newGame());
        }
    }
}
