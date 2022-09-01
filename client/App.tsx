//import react
import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import RequestForm from './requestForm.tsx';

// import './static/style.css'

//main app container
const test = 'some text';
// const useIsSsr = () => {
//   // we always start off in "SSR mode", to ensure our initial browser render
//   // matches the SSR render
//   const [isSsr, setIsSsr] = React.useState(true);

//   React.useEffect(() => {
//     // `useEffect` never runs on the server, so we must be on the client if
//     // we hit this block
//     setIsSsr(false);
//   }, []);

//   return isSsr;
// };

const App = () => {
  // const isSsr = useIsSsr();
  // if (isSsr) return null;


  return (
    <>
      <div className="app">
        <h1>rendering app.tsx</h1>
        <RequestForm />
      </div>
    </>
  );
};

export default App;
