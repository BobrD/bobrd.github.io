import * as React from 'react';
import {pointAsString, TStep, XOState} from '../domain/xo/model';
import {dispatchAware, WithDispatchProps} from '../hoc/DispatchAware';
import {xoActions} from '../domain/xo/action';
import styled from 'styled-components';

type THistoryProps = {
    steps: TStep[];
} & WithDispatchProps<XOState>;

const HistoryItem = styled.li`
  cursor: pointer;
`;

@(dispatchAware() as any)
export class History extends React.Component<THistoryProps> {
    render() {
        return (
            <div>
                <div>History</div>
                <ul>
                    {this.props.steps.map(this.renderItem)}
                </ul>
            </div>
        );
    }

    private renderItem = (step: TStep) => (
        <HistoryItem
            key={pointAsString(step)}
            onClick={() => this.replay(step)} // todo optimize
        >
            {step.x}:{step.y}
        </HistoryItem>
    )

    private replay = (step: TStep) => this.props.dispatch(xoActions.replayFrom(step));
}
