import { React } from '../deps.ts';

import Chartjs from 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
// import RenderGraph from './components/RenderGraph.tsx';

const App = () => {


  //array of all the previous query responses, use for rendering data in the table and chart
  const [queryHistory, setQueryHistory] = React.useState([]);
  const [responseData, setResponseData] = React.useState({})

  //array of times, which is passed to the RenderGraph component to chart the response times
  const [responseTimes, setResponseTimes] = React.useState([]);

  //component for rendering a line graph to visualize response times
  const RenderGraph = ({ responseTimes }) => {
    //array to store labels for the query number to display on x-axis
    let graphLabels = [];
    responseTimes.map((el, i) => {
      graphLabels.push(i + 1);
    });

    // check if the DOM element exists
    let chartStatus = Chart.getChart('myChart'); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

    //grabs the DOM element to render the chart
    const ctx = document.getElementById('myChart').getContext('2d');


    //creates the chart
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: graphLabels,
        datasets: [
          {
            label: 'Response Times',
            data: responseTimes,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            yAxisID: 'Queries',
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
      },
    });
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
        }),
      });
      //backend checks redis, then db, then returns response
      //take the response, the source of the response (cache vs server), and response time, and store it in the queryResponse object which will be added to the queryHistory array.
      const jsonResponse = await response.json();
      
      
      const resolver: string = Object.keys(jsonResponse.data)[0];
      
    
      queryResponse.response = jsonResponse.data[resolver][0];
      if (!response.headers.get('source')) {queryResponse.source = '--'} 
      else {
      queryResponse.source = response.headers.get('source');
      }
      queryResponse.time = response.headers.get('x-response-time');

      let tempArray = [...queryHistory, queryResponse];
      setQueryHistory(tempArray);
      let tempResponseTimes = [...responseTimes, queryResponse.time];
      setResponseTimes(tempResponseTimes);
    
      setResponseData(jsonResponse.data[resolver][0])
      
    } catch (error) {
      console.log('error--->', error);
    }
  };

  return (
    <>
      <React.StrictMode>
        {/* main app container */}
        {/* do we want a navbar? maybe that links to a spashpage with docs??? */}
        <nav>
          <h1>DenoCacheQL</h1>
        </nav>
        {/* page is divided into the topContainer and bottomContainer. The top container holds the query input textarea and the server response. 
        The bottom container holds the query response history, and graph.  */}
        <div className="container-fluid">
          <div className="row" id="topContainer">
            <div className="col-sm-6" id="requestForm">
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
            <div className="col-sm-6" id="results">
              <div id="queryResponse">
                <p>Response</p>
                <pre>{JSON.stringify(responseData, null, 2) }</pre>
                {/* {
for (const [key, value] of Object.entries(object1)) {
  console.log(`${key}: ${value}`);} */}
              </div>
            </div>
          </div>

          <div className="row" id="bottomContainer">
            <div className="col-sm-6 overflow-auto" id="tableContainer">
              <table className="table table-dark">
                <thead>
                  <tr>
                    <th>Query #</th>
                    <th>response</th>
                    <th id="sourceHeader">Source</th>
                    <th id="timeHeader">Response Time (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {queryHistory.map((historyItem: any, i: number) => {
                    let displayResponse = '';
                    for (const [key, value] of Object.entries(
                      historyItem.response
                    )) {
                      displayResponse += `${key}: ${value} \n`;
                    }
                    return (
                      <tr>
                        <td id="queryNumber">{i + 1}</td>
                        <td id="tableResponse">
                          {JSON.stringify(historyItem.response, null, 2)}
                        </td>
                        <td id="tableSource">{historyItem.source}</td>
                        <td id="tableTime">{historyItem.time}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="col-sm-6" id="chart-container">
              <canvas id="myChart"></canvas>
            </div>
          </div>
          <React.Suspense>
            <RenderGraph responseTimes={responseTimes} />
          </React.Suspense>
        </div>
      </React.StrictMode>
    </>
  );
};

export default App;
