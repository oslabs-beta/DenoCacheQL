
import React from 'https://esm.sh/react@18.2.0';
import { ReactDOM } from '../deps.ts';

import  App  from './App.tsx';
//'https://esm.sh/v92/@types/react-dom@^18/index';
// const root = (ReactDOM as any).hydrate(
//     <App />,
//     document.getElementById('root')
// );
// export default root;
// const root = document.getElementById("root")
// let renderMethod
// if (root && root.innerHTML !== "") {
//   renderMethod = hydrate
// } else {
//   renderMethod = render
// }
// renderMethod(<App />, document.getElementById('root'));
const el = document.getElementById('root');
if (el) {
ReactDOM.hydrate(<App />, el);
}