import styled from 'styled-components';

type PanelButtonProps = {
    direction?: 'l' | 'r';
    children?: any;
    className?: string;
    active?: boolean;
};

export const PanelButton = styled<PanelButtonProps>('div' as any)`
  padding: 0 10px;
  color: #a9a9a9;
  background: ${({active}) => active ? '#606060' : '#414141'};
  box-shadow: inset 0 1px 0 0 #565656, inset 0 -1px 0 0 #474747;
  ${({direction}) => direction === 'l' ? 'border-left:  1px solid #353535;' : ''}
  ${({direction}) => direction === 'r' ? 'border-right:  1px solid #353535;' : ''}
  ${({direction}) => direction === undefined
    ? 'border-right:  1px solid #353535; border-left:  1px solid #353535;'
    : ''}
  height: 100%;
  width: auto;
  text-align: center;
  text-transform: uppercase;
  font-weight: 300;
  line-height: 32px;
  font-size: 13px;
  min-width: 33px;
  
  &:hover {
    color: #b6b6b6;
    background: #515151;
  }
  
  cursor: pointer;
`;

export const YellowPanelButton = PanelButton.extend`
  color: #c79522;
  width: 93px;  
    &:hover {
    color: #c79522;
  }
`;
