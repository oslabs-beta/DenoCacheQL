//import react
import React from 'https://esm.sh/react';
import RequestForm from './requestForm.tsx';

// import './static/style.css'

//main app container
const test = 'some text';

const App = () => {
  return (
    <div className="app">
      <h1>rendering app.tsx {test}</h1>
      <RequestForm />
    </div>
  );
};

export default App;
