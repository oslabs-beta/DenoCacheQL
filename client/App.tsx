//import react
import React from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0';
import RequestForm from './requestForm.tsx';

//main app container

const App = () => {
  const [loadedResults, setLoadedResults] = React.useState(true);
  const [queryInputNumber, setQueryInputNumber] = React.useState<
    string | undefined
  >(undefined);
  // const [queryResponse, setQueryResponse] = React.useState('');
  // const [responseTime, setResponseTime] = React.useState('');
  const [queryHistory, setQueryHistory] = React.useState([]);
  // let queryHistoryElements = '';

  // React.useEffect(() => {
  //   console.log('in useEffect');
  //   queryHistory.map((name: any, i: number) => {
  //     queryHistoryElements.concat('<li>' + name + '</li>');
  //   });
  //   setLoadedResults(false);
  // }, queryHistory);

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    setLoadedResults(true);
    console.dir(e);
    console.log(e.target[0].value);
    // console.log(queryInputNumber);
    const inputNumber: string | undefined = e.target[0].value;
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
      console.log('json---->', jsonResponse.data);
      console.log('getPeople---->', jsonResponse.data.getPeople[0].name);
      queryResponse = jsonResponse.data.getPeople[0].name;
      // setQueryHistory(...queryHistory, jsonResponse.data.getPeople[0]);
      // await setQueryHistory(...queryHistory, queryResponse);
      queryHistory.push(queryResponse);
      console.log('queryHistory', queryHistory);
    } catch (error) {
      console.log('error--->', error);
    }
    setLoadedResults(false);
    // setQueryHistory(...queryHistory, queryResponse);
  };

  return (
    <>
      <div className="app">
        <h1>rendering app.tsx</h1>
        <div className="requestForm">
          <form
            onSubmit={(e) => {
              handleSubmitQuery(e);
            }}
          >
            <input
              id="inputNumber"
              type="text"
              // onChange={(e) => {
              //   console.log('e --->', e);
              //   setQueryInputNumber(e.target.value);
              // }}
            />
            <button type="submit">Click Me</button>
          </form>
        </div>
      </div>
      <div className="results">
        <h1>Results container</h1>

        <ul>
          {queryHistory.map((name: any, i: number) => {
            return <li>{name}</li>;
          })}
        </ul>
      </div>
    </>
  );
};

export default App;
