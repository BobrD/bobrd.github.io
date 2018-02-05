import styled from 'styled-components';

export const Lockable = styled<{locked: boolean}>('div' as any)`
    ${({locked}) => locked ? 'pointer-events: none' : ''}
`;
