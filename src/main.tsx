import {render} from 'react-dom';
import * as React from 'react';
import {App} from './view/App';
import {Provider} from 'react-redux';
import {store} from './store';
import {DispatchProvider} from './hoc/DispatchAware';

const root = document.createElement('div');

root.style.width = '100%';
root.style.height = '100%';

document.body.appendChild(root);

render(<Provider store={store}>
    <DispatchProvider dispatch={store.dispatch}>
        <App />
    </DispatchProvider>
</Provider>, root);
