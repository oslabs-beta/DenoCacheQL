
import React from 'https://esm.sh/react';
import { ReactDOM } from '../deps.ts';
import  App  from './App.tsx';

// const root = (ReactDOM as any).hydrate(
//     <App />,
//     document.getElementById('root')
// );
// export default root;
export default ReactDOM.hydrate(<App />, document.getElementById('root'));