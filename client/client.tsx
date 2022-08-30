import { React, ReactDOM } from '../deps.ts';

import App from './App.tsx';

// Hydrate the app and reconnect React functionality

(ReactDOM as any).hydrate(<App />, document.getElementById('root'));
