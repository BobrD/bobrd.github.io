import * as React from 'react';
import {EStone, GameResult, TBoard, XOState} from '../domain/xo/model';
import {dispatchAware, WithDispatchProps} from '../hoc/DispatchAware';
import {SyntheticEvent} from 'react';
import {xoActions} from '../domain/xo/action';
import * as R from 'ramda';
import styled from 'styled-components';
import {oSymbol, xSymbol} from './consts';
import {getStone} from '../domain/xo/io/checkRow';
import {Lockable} from './UIComponents/Lockable';

export type IGridProps = {
    grid: TBoard;
    gameResult: GameResult | undefined;
} & WithDispatchProps<XOState>;

const itemSize = 40;

const Cell = styled<{isWin: boolean; locked: boolean} & any>('div' as any)`
    box-sizing: border-box;
    width: ${itemSize}px;
    border-radius: 3px;
    display: inline-block;
    height: ${itemSize}px;
    margin: 2px;
    cursor: pointer;
    position: relative;
    background: ${({isWin, stone}) => isWin ? '#d96f54' : stone === EStone.empty ? '#d9cec1' : '#eee4da'};
    ${({locked}) => locked ? 'pointer-events: none' : ''}
`;

const Row = styled.div`
    padding: 0;
    margin: 0;
    line-height: 0;
`;

const GridWrapper = styled.div`
  float: left;
  background-color: #bbada0;
  border-radius: 6px;
  padding: 2px;
`;

const Stone = styled.div`
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    width: 100%;
    position: absolute;
    font-weight: 700;
`;

// @ts-ignore
@dispatchAware()
export class Board extends React.Component<IGridProps, any> {

    render() {
        const size = this.boardSize();

        const boardRange = R.range(0, size);

        const rows = boardRange.map(y => (
            <Row key={y}>
                {this.renderRowItems(boardRange, y)}
            </Row>
        ));

        return <GridWrapper>{rows}</GridWrapper>;
    }

    private boardSize() {
        return Math.sqrt(this.props.grid.length);
    }

    private renderRowItems(boardRange: number[], y: number) {
        return boardRange.map(x => {

            const stone = getStone(this.props.grid, {x, y});

            return (
                <Cell
                    key={x}
                    data-x={x}
                    data-y={y}
                    isWin={this.isWinCell(x, y)}
                    locked={stone !== EStone.empty}
                    onClick={this.put}
                >
                    <Stone>{stone === EStone.x ? xSymbol : stone === EStone.o ? oSymbol : ''}</Stone>
                </Cell>

            );
        });
    }

    private isWinCell = (testX, testY) => {
        if (void 0 === this.props.gameResult) {
            return false;
        }

        return -1 !== (this.props.gameResult as GameResult)
            .points
            .findIndex(({x, y}) => x === testX && y === testY)
        ;
    }

    private put = (e: SyntheticEvent<HTMLDivElement>) => {
        e.preventDefault();

        const {dataset} = e.target as any;

        this.props.dispatch(xoActions.playerStep(+dataset.x, +dataset.y));
    }
}
