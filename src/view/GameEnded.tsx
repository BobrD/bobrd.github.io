import * as React from 'react';
import styled, {injectGlobal} from 'styled-components';
import {dispatchAware, WithDispatchProps} from '../hoc/DispatchAware';
import {XOState} from '../domain/xo/model';
import {xoActions} from '../domain/xo/action';
import {Flex, Box} from 'reflexbox';

const Blur = styled.div`
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    position: absolute;
    z-index: 1;
`;

const GameEnded = styled.div`
  color: #8b8b8b;
  padding: 20px 0;
  font-size: 30px;
`;

const TryAgain = styled.div`
    background-color: #f9b603;
    box-shadow: 1px 1px rgba(0,0,0,.18), inset 0 0 4px hsla(0,0%,100%,.45), inset 0 1px 0 #ffdc7e;
    border: 1px solid #222;
    padding: 10px;
    color: #2d2d2d;
    cursor: pointer;
    font-weight: 300;
    text-transform: uppercase;
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 140px;
    
    &:hover {
        background: #e0a403;
    }
`;

const Popup = styled.div`
  border: 1px solid #181818;
  background: #2d2d2e;
  width: 400px;
  position: fixed;
  top: 0;
  bottom: 0;
  height: 150px;
  left: 0;
  margin: auto;
  right: 0;
  text-align: center;
  
  ${injectGlobal`
    html, body {
      overflow: auto;
    }
  `}
`;

type Props = {
    win: boolean;
} & WithDispatchProps<XOState>;

@(dispatchAware as any)()
export class GameEndedWindow extends React.Component<Props> {
    render() {
        return (
            <Blur>
                <Popup>
                    <GameEnded>Game over. You {this.props.win ? 'win!' : 'lose.'}</GameEnded>
                    <TryAgain onClick={this.trayAgain}>Try again</TryAgain>
                </Popup>
            </Blur>
        );
    }

    private trayAgain = () => this.props.dispatch(xoActions.closeGameEndedWindow());
}
