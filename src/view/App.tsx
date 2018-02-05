import * as React from 'react';
import {Board} from './Board';
import {connect} from 'react-redux';
import {EGameState, XOState} from '../domain/xo/model';
import {injectGlobal, default as styled} from 'styled-components';
import {GameEndedWindow} from './GameEnded';
import {FlexCenter} from './Flex';
import {ControlPanel} from './ControlPanel/ControlPanel';
import { Flex, Box } from 'reflexbox';
// @ts-ignore
import * as Roboto from './../assets/fonts/RobotoCondensed-Regular.ttf';
import {Message} from './Message';
import {Lockable} from './UIComponents/Lockable';

export type AppProps = {
    boardSize: number;
} & XOState;

const mapStateToProps = (state: XOState) => ({...state, boardSize: Math.sqrt(state.board.length)});

injectGlobal`
    @font-face {
        font-family: 'Roboto';
        src: url(${Roboto});
      }

  html, body {
    margin: 0;
    padding: 0;
    background: #272727;
    color: #776e65;
    font: 12px Roboto, Helvetica, Arial sans-serif;
    font-size: 18px;
    width: 100%;
    height: 100%;
}
`;

const containerStyle = {
    width: '100%',
    height: '100%',
};

const Fixed = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
`;

// @ts-ignore
@connect(mapStateToProps)
export class App extends React.Component<AppProps> {
    render() {
        return (
            <div>
                {this.props.showGameEnded ? <GameEndedWindow win={false} /> : ''}
                <Lockable locked={this.props.gameState === EGameState.eneded}>
                    <Flex column={true} justify="space-between" auto={true} style={containerStyle}>
                        <Message message={this.props.message} />

                        <Box p={32}>
                            <FlexCenter>
                                <Board grid={this.props.board} gameResult={this.props.gameResult}/>
                            </FlexCenter>
                        </Box>
                        <Fixed>
                            <ControlPanel
                                gameState={this.props.gameState}
                                boardSize={this.props.boardSize}
                                playerStone={this.props.playerStone}
                            />
                        </Fixed>
                    </Flex>
                </Lockable>
            </div>
        );
    }
}
