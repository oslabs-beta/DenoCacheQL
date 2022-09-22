//import react
import React, {
  useState,
  useEffect,
  useRef,
} from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0';
import RequestForm from './requestForm.tsx';

//main app container

const App = () => {
  const [loadedResults, setLoadedResults] = React.useState(false);
  const [queryInputNumber, setQueryInputNumber] = React.useState<
    string | undefined
  >(undefined);
  // const [queryResponse, setQueryResponse] = React.useState('');
  // const [responseTime, setResponseTime] = React.useState('');
  const [queryHistory, setQueryHistory] = React.useState([]);

  React.useEffect(() => {
    setLoadedResults(true);
  }, queryHistory);

  const handleSubmitQuery = async () => {
    console.log(queryInputNumber);
    const inputNumber: string | undefined = queryInputNumber;
    let queryResponse: string;
    // const query: string = `query getPeople($queryNumber: Int){getPeople()}`;
    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: `{
      getPeople (characterNumber: ${inputNumber}){
        name
      }
    }`,
        }),
      });
      //backend checks redis, then db, then returns response
      //set
      //take the response and push an object to queryHistory. the object will contain queryInputNumber, queryresponse, responseTime
      console.log(response);
      const jsonResponse = await response.json();
      console.log('json---->', jsonResponse.data.getPeople[0]);
      queryResponse = jsonResponse.data.getPeople[0];
      // setQueryHistory(...queryHistory, jsonResponse.data.getPeople[0]);
    } catch (error) {
      console.log('error--->', error);
    }
    // setQueryHistory(...queryHistory, queryResponse);
    // setLoadedResults(false);
  };

  return (
    <>
      <div className="app">
        <h1>rendering app.tsx</h1>
        <div className="requestForm">
          <input type="text" onChange={e => {console.log('e --->', e); setQueryInputNumber(e.target.value)}} />
          <button type="button" onClick={handleSubmitQuery}>
            Click Me
          </button>
          {/* <div className="results">
            {queryHistory.map((row, i) => {
              <div key={i}>{row}</div>;
            })}
          </div> */}
        </div>
      </div>
    </>
  );
};

export default App;
