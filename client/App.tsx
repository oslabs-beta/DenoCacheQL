//import react
import React from 'https://esm.sh/react@18.2.0';
// import {
//   chart,
//   getRelativePosition,
// } from 'https://www.jsdelivr.com/package/npm/chart.js?path=dist';
// import { Line } from 'https://github.com/reactchartjs/react-chartjs-2';
//main app container
import { Chart as ChartJS } from 'https://cdn.skypack.dev/chart.js';
//import chartJsImage from 'https://cdn.skypack.dev/chart.js-image';

// import Line from 'https://cdn.skypack.dev/chart.js';
const App = () => {
  // const [responseTime, setResponseTime] = React.useState('');
  const [queryHistory, setQueryHistory] = React.useState([]);

  //--------------------------------------
  const handleSubmitQuery = async (e) => {
    e.preventDefault();

    const queryTextBox: string | undefined = e.target[0].value;

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
          query: queryTextBox,
          //       query: `{
          //   getPeople (characterNumber: ${queryTextBox}){
          //     name
          //   }
          // }`,
        }),
      });
      //backend checks redis, then db, then returns response
      //set
      //take the response and push an object to queryHistory. the object will contain queryqueryTextBox, queryresponse, responseTime
      console.log(response);
      const jsonResponse = await response.json();
      console.log('json---->', jsonResponse);
      console.log('headers ----', response.headers);
      console.log('getPeople---->', jsonResponse.data.getPeople[0]);
      queryResponse = JSON.stringify(jsonResponse.data.getPeople[0]);
      let tempArray = [...queryHistory, queryResponse];
      setQueryHistory(tempArray);
      console.log('queryHistory', queryHistory);
    } catch (error) {
      console.log('error--->', error);
    }
  };

  return (
    <>
      <div className="app">
        <h1>rendering app.tsx</h1>
        <div className="topContainer">
          <div className="requestForm">
            <form
              onSubmit={(e) => {
                handleSubmitQuery(e);
              }}
            >
              <textarea id="query_text_box" />
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
      </div>
      <div className="bottomContainer">
        <h1>display response table and vizualizer here</h1>
      </div>
    </>
  );
};

export default App;