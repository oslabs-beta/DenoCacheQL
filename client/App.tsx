import {
  React,
  ReactDOM,
  //d34Deno,
} from '../deps.ts';

import Chartjs from 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';


const App = () => {
  let displayResponse;
  const [queryHistory, setQueryHistory] = React.useState([]);

  const RenderGraph = () => {
    const ctx = document.getElementById('myChart');
    
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      },
    });
    // const myChart = new Chart(ctx, {
    //   type: 'bar',
    //   data: {
    //     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    //     datasets: [
    //       {
    //         label: '# of Votes',
    //         data: [12, 19, 3, 5, 2, 3],
    //         backgroundColor: [
    //           'rgba(255, 99, 132, 0.2)',
    //           'rgba(54, 162, 235, 0.2)',
    //           'rgba(255, 206, 86, 0.2)',
    //           'rgba(75, 192, 192, 0.2)',
    //           'rgba(153, 102, 255, 0.2)',
    //           'rgba(255, 159, 64, 0.2)',
    //         ],
    //         borderColor: [
    //           'rgba(255, 99, 132, 1)',
    //           'rgba(54, 162, 235, 1)',
    //           'rgba(255, 206, 86, 1)',
    //           'rgba(75, 192, 192, 1)',
    //           'rgba(153, 102, 255, 1)',
    //           'rgba(255, 159, 64, 1)',
    //         ],
    //         borderWidth: 1,
    //       },
    //     ],
    //   },
    //   options: {
    //     scales: {
    //       y: {
    //         beginAtZero: true,
    //       },
    //     },
    //   },
    // });

    // return (
    //   <>

    //     <div id="graph">This should be a picture of a graph!</div>
    //   </>
    // );
  };

  //--------------------------------------
  const handleSubmitQuery = async (e: Event) => {
    e.preventDefault();

    const queryTextBox: string | undefined = e.target[0].value;
    let queryResponse: object = { response: null, source: null, time: null };

    //submit request, sending user's query in the request body
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
      //take the response, the source of the response (cache vs server), and response time, and store it in the queryResponse object which will be added to the queryHistory array.
      const jsonResponse = await response.json();
      displayResponse = jsonResponse.data.getPeople[0];
      console.log(displayResponse);
      queryResponse.response = jsonResponse.data.getPeople[0];
      queryResponse.source = response.headers.get('source');
      queryResponse.time = response.headers.get('x-response-time');

      let tempArray = [...queryHistory, queryResponse];
      setQueryHistory(tempArray);
    } catch (error) {
      console.log('error--->', error);
    }
  };

  return (
    <>
      {/* main app container */}
      {/* do we want a navbar? maybe that links to a spashpage with docs??? */}
      <nav>
        <h1>DenoCacheQL</h1>
      </nav>
      {/* page is divided into the topContainer and bottomContainer. The top container holds the query input textarea and the server response. 
        The bottom container holds the query response history, and graph.  */}

      <div className="container-fluid" id="topContainer">
        <div id="requestForm">
          <form
            onSubmit={(e) => {
              handleSubmitQuery(e);
            }}
          >
            <textarea
              className="form-control"
              id="query_text_box"
              placeholder="Query { }"
            />
            <button className="btn" type="submit">
              Submit Query
            </button>
          </form>
        </div>
        <div id="results">
          <div id="queryResponse">
            <p>Response</p>
            {JSON.stringify(queryHistory[queryHistory.length - 1])}
          </div>
        </div>
      </div>
      <div id="bottomContainer">
        <table className="table table-dark">
          <thead>
            <tr>
              <th>response</th>
              <th id="sourceHeader">source</th>
              <th id="timeHeader">response time</th>
            </tr>
          </thead>
          <tbody>
            {queryHistory.map((historyItem: any, i: number) => {
              return (
                <tr>
                  <td id="tableResponse">
                    {JSON.stringify(historyItem.response)}
                  </td>
                  <td id="tableSource">{historyItem.source}</td>
                  <td id="tableTime">{historyItem.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <React.Suspense>
          <RenderGraph />
        </React.Suspense>
      </div>
    </>
  );
};

export default App;
