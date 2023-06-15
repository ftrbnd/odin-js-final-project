import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import RouteSwitch from './RouteSwitch.tsx';
import ColorModeProvider from './utils/ColorModeContext.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ColorModeProvider>
        <RouteSwitch />
      </ColorModeProvider>
    </Provider>
  </React.StrictMode>
);
