import * as React from 'react';
import styled from 'styled-components';
import {dispatchAware, WithDispatchProps} from '../hoc/DispatchAware';
import {EMessages, XOState} from '../domain/xo/model';
import {xoActions} from '../domain/xo/action';

const MessageBox = styled.div`
  color: #8b8b8b;
  position: absolute;
  bottom: 32px;
  right: 0;
  width: 300px;
  border: 1px solid #181818;
  background: #2d2d2e;
  font-weight: 300;
  font-size: 13px;
  padding: 15px;
`;

const CloseIcon = styled.div`
  right: 10px;
  top: 10px;
  color: #000;
  width: 15px;
  height: 15px;
  text-align: center;
  background: #363636;
  border-radius: 3px;
  box-shadow: inset 1px 1px 0 0 #3f3f3f;
  position: absolute;
  cursor: pointer;
  
  &:after {
   content: '✕';
  }
`;

const messages = {
    [EMessages.startGame]: 'You select "o" stone. Click "START GAME" to allow IO to make step.',
};

type Props = {
    message: string | void;
} & WithDispatchProps<XOState>;

@(dispatchAware as any)()
export class Message extends React.Component<Props> {
    render() {
        return (
            this.props.message
                ? (
                    <MessageBox onClick={this.close}>
                        <CloseIcon />
                        {messages[this.props.message]}
                    </MessageBox>
                )
                : null
        );
    }

    private close = () => this.props.dispatch(xoActions.closeMessage());
}
