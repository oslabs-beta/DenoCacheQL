//import react
import React from 'https://esm.sh/react';
import Test from './component.tsx'
// import './static/style.css'

const test = 'some text';

const App = () => {
  return (
    <div className="app">
      <h1>`rendering app.tsx ${test}`</h1>
      <Test />
    </div>
  );
};

export default App;
