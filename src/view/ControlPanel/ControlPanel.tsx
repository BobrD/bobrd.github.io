import * as React from 'react';
import { Flex, Box } from 'reflexbox';
import styled from 'styled-components';
import {dispatchAware, WithDispatchProps} from '../../hoc/DispatchAware';
import {EGameState, EStone, XOState} from '../../domain/xo/model';
import {SyntheticEvent} from 'react';
import {xoActions} from '../../domain/xo/action';
import {PanelButton} from '../UIComponents/Buttons';
import {NewGameButton} from './NewGameButton';

type ControlPanelProps = {
    className?: string;
    boardSize: number;
    playerStone: EStone;
    gameState: EGameState;
} & WithDispatchProps<XOState>;

const BoardSizeInput = styled.input`
  background: #282829;
  box-shadow: inset 0 1px 0 0 #303031;
  color: #9c9c9c;
  font-weight: 300;
  height: 100%;
  line-height: 28px;
  border: none;
  border-radius: 0;
  outline: 0;
  padding: 0 5px;
  width: 35px;
  text-align: center;
  font: 13px Roboto,Helvetica,Arial sans-serif;
`;

const Label = styled.div`
  text-align: center;
  text-transform: uppercase;
  font-weight: 300;
  line-height: 32px;
  font-size: 13px;
  padding: 0 10px;
  cursor: default;
  
`;

const Disableable = styled<{disable: boolean}>('div' as any)`
    ${({disable}) => disable ? `
    opacity: 0.3;
    pointer-events: none;
    ` : ''}
`;

// todo decompose
@(dispatchAware as any)()
class BaseControlPanel extends React.Component<ControlPanelProps> {
    state = {
        boardSize: this.props.boardSize,
    };

    render() {
        return (
            <Flex justify="space-between" className={this.props.className}>
                <Box>
                    <PanelButton direction="r">
                        History
                    </PanelButton>
                </Box>
                <Box auto={true}>
                    <Flex justify="space-around">
                        <Box>
                            <Disableable disable={this.props.gameState !== EGameState.waitStart}>
                                <Flex>
                                    <Box>
                                        <Label>Board size</Label>
                                    </Box>
                                    <Box>
                                        <PanelButton
                                            active={this.props.boardSize === 10}
                                            data-size={10}
                                            onClick={this.setSize}
                                        >
                                            10
                                        </PanelButton>
                                    </Box>
                                    <Box>
                                        <PanelButton
                                            direction="r"
                                            active={this.props.boardSize === 15}
                                            data-size={15}
                                            onClick={this.setSize}
                                        >
                                            15
                                        </PanelButton>
                                    </Box>
                                    <Box>
                                        <PanelButton
                                            direction="r"
                                            active={this.props.boardSize === 20}
                                            data-size={20}
                                            onClick={this.setSize}
                                        >
                                            20
                                        </PanelButton>
                                    </Box>
                                    <Box>
                                        <Label>Custom size</Label>
                                    </Box>
                                    <Box>
                                        <BoardSizeInput
                                            value={this.state.boardSize}
                                            onChange={this.changeSize}
                                        />
                                    </Box>
                                </Flex>
                            </Disableable>

                        </Box>
                        <Box>
                            <Disableable disable={this.props.gameState !== EGameState.waitStart}>
                                <Flex>
                                    <Box>
                                        <Label>
                                            Stone
                                        </Label>
                                    </Box>
                                    <Box>
                                        <PanelButton
                                            active={this.props.playerStone === EStone.x}
                                            onClick={this.changeStone}
                                            data-stone={EStone.x}
                                        >
                                            X
                                        </PanelButton>
                                    </Box>
                                    <Box>
                                        <PanelButton
                                            active={this.props.playerStone === EStone.o}
                                            direction="r"
                                            onClick={this.changeStone}
                                            data-stone={EStone.o}
                                        >
                                            0
                                        </PanelButton>
                                    </Box>
                                </Flex>
                            </Disableable>
                        </Box>
                    </Flex>
                </Box>
                <NewGameButton playerStone={this.props.playerStone} gameState={this.props.gameState} />
            </Flex>
        );
    }

    private changeSize = (e: SyntheticEvent<HTMLInputElement>) => {
        e.stopPropagation();

        let boardSize = +e.currentTarget.value;

        if (isNaN(boardSize)) {
            return;
        }

        if (boardSize > 20) {
            boardSize = 20;
        }

        this.setState({boardSize});

        if (boardSize >= 5) {
            this.props.dispatch(xoActions.changeSize(boardSize));
        }
    }

    private setSize = (e: SyntheticEvent<HTMLInputElement>) => {
        e.stopPropagation();

        this.props.dispatch(xoActions.changeSize(+e.currentTarget.dataset.size));
    }

    private changeStone = (e: SyntheticEvent<HTMLInputElement>) => {
        e.stopPropagation();

        this.props.dispatch(xoActions.changeStone(e.currentTarget.dataset.stone as EStone));
    }
}

export const ControlPanel = styled(BaseControlPanel)`
  background: #414141;
  border: 1px #181818;
  border-style: solid solid none;
  box-shadow: inset 0 1px 0 0 #565656, inset 0 -1px 0 0 #474747;
  height: 32px;
`;
