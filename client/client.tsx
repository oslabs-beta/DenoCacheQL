
import React from 'https://esm.sh/react@18.2.0';
import { ReactDOM } from '../deps.ts';
import  App  from './App.tsx';

// const root = (ReactDOM as any).hydrate(
//     <App />,
//     document.getElementById('root')
// );
// export default root;
if (typeof document !== 'undefined') {
ReactDOM.hydrate(<App />, document.getElementById('root'));
}