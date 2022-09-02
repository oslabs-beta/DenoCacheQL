//import react
import React, {
  useState,
  useEffect,
  useRef,
} from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0';
import RequestForm from './requestForm.tsx';

// import './static/style.css'

//main app container

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
  const [queryInputNumber, setQueryInputNumber] = React.useState('');
  // const [queryResponse, setQueryResponse] = React.useState('');
  // const [responseTime, setResponseTime] = React.useState('');
  const [queryHistory, setQueryHistory] = React.useState([]);

  const handleSubmitQuery = async () => {
    // console.log('clicked');
    // console.log(queryInputNumber.nativeEvent.data);
    const query: string = `query getPeople($queryNumber: Int){getPeople()}`;
    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          body: JSON.stringify({
            query: `{
        getPeople {
          name
        }
      }`,
            // { getPeople } queryInputNumber.nativeEvent.data})
          }),
        },
      });
      //backend checks redis, then db, then returns response
      //set
      //take the response and push an object to queryHistory. the object will contain queryInputNumber, queryresponse, responseTime
      console.log(response);
      const jsonResponse = await response.json();
      console.log('json---->', jsonResponse);
    } catch (error) {
      console.log('error--->', error);
    }
  };

  return (
    <>
      <div className="app">
        <h1>rendering app.tsx</h1>
        <div className="requestForm">
          <input type="text" onChange={setQueryInputNumber} />
          <button type="button" onClick={handleSubmitQuery}>
            Click Me
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
