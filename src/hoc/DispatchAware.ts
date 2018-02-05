import {Dispatch} from 'react-redux';
import * as React from 'react';
import * as PropTypes from 'prop-types';

export type WithDispatch<S> = {
    dispatch: Dispatch<S>;
};

export type WithDispatchProps<S> = Partial<WithDispatch<S>>;

export class DispatchProvider<T, S> extends React.Component<WithDispatch<T>> {
    static childContextTypes = {
        dispatch: PropTypes.func,
    };

    getChildContext(): WithDispatch<S> {
        return { dispatch: this.props.dispatch };
    }

    render() {
        return React.Children.only(this.props.children);
    }
}

export const dispatchAware = <P, S>() => (WrappedComponent: React.ComponentType<P>) => (
    // tslint:disable-next-line
    class extends React.Component<P & WithDispatch<S>> {
        static contextTypes = {
            dispatch: PropTypes.func,
        };

        context: WithDispatch<S>;

        render() {
            return React.createElement(WrappedComponent, {...this.props as any, ...{dispatch: this.context.dispatch}});
        }
    }
);
