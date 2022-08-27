import React from 'https://dev.jspm.io/react';
//import react-dom
import ReactDOM from 'https://dev.jspm.io/react-dom';
import ReactDOMServer from 'https://dev.jspm.io/react-dom/server';
import createRoot from 'https://dev.jspm.io/react-dom/client';
import App from './App.tsx';

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App tab="home" />);
