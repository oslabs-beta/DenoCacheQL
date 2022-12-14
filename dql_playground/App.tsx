import { React } from '../deps.ts';
import { AppProps } from '../src/types.ts';
import { queryResponse } from '../src/types.ts';
import { latency } from '../src/types.ts';
import Chartjs from 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';

const App = () => {
  //array of all the previous query responses, use for rendering data in the table and chart
  const [queryHistory, setQueryHistory] = React.useState<queryResponse[]>([]);
  const [responseData, setResponseData] = React.useState({});

  //array of times, which is passed to the RenderGraph component to chart the response times
  const [responseTimes, setResponseTimes] = React.useState<latency>([]);

  //component for rendering a line graph to visualize response times
  const RenderGraph = ({ responseTimes }: AppProps) => {
    //array to store labels for the query number to display on x-axis
    const graphLabels: number[] = [];
    responseTimes.map((el: string, i: number) => {
      graphLabels.push(i + 1);
    });

    // check if the DOM element exists
    const chartStatus = Chart.getChart('myChart'); // <canvas> id
    if (chartStatus != undefined) {
      chartStatus.destroy();
    }

    //grabs the DOM element to render the chart
    const canvaEl = document.getElementById('myChart') as HTMLCanvasElement;

    const ctx: CanvasRenderingContext2D = canvaEl.getContext('2d')!;

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
  const handleSubmitQuery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const queryTextBox: string | undefined = target[0].value;
    let variableTextBox: string | undefined= target[1].value;
    const queryResponse: queryResponse = {};
    console.log('target', target)
    //submit request, sending user's query in the request body
    if (variableTextBox === '') {
      variableTextBox = undefined;
    }
    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },

        body: JSON.stringify({
          query: queryTextBox,
          variables: variableTextBox
        })
      });
      //backend checks redis, then db, then returns response
      //take the response, the source of the response (cache vs server), and response time, and store it in the queryResponse object which will be added to the queryHistory array.
      const jsonResponse = await response.json();
      const resolver: string = Object.keys(jsonResponse.data)[0];

      //if the response headers includes a source, it is returning from either the database or the cache (hardcoded on the backend). If the headers includes 'source', it is a query. If the headers does not include 'source', it is not a query, so store the response object.
      if (!response.headers.get('source')) {
        queryResponse.response = jsonResponse.data;
        queryResponse.source = '--';
      } else {
        //if the headers includes 'source' sent from the backend, it is a query, so store the response, accessing the resolver and the response data (returned as an array) stored at index 0.
        queryResponse.response = jsonResponse.data[resolver][0];
        queryResponse.source = response.headers.get('source');
      }

      queryResponse.time = response.headers.get('x-response-time');
      const tempArray = [...queryHistory, queryResponse];
      setQueryHistory(tempArray);
      const tempResponseTimes: Array<string | null> = [
        ...responseTimes,
        queryResponse.time,
      ];
      setResponseTimes(tempResponseTimes);

      //update the responseData variable to display in the response area according to whether or not it is a result of a query. If the response is sent back with a 'source' (either cache or databse), then it is a query.
      response.headers.get('source')
        ? setResponseData(jsonResponse.data[resolver][0])
        : setResponseData(jsonResponse.data);
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
                <textarea
                  className="form-control"
                  id="variables_text_box"
                  placeholder="Variables { }"
                />
                <button className="btn" type="submit">
                  Submit Query
                </button>
              </form>
            </div>
            <div className="col-sm-6" id="results">
              <div id="queryResponse">
                <p>Response</p>
                <pre>{JSON.stringify(responseData, null, 2)}</pre>
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
                    <th id="sourceHeader">source</th>
                    <th id="timeHeader">response time (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {queryHistory.map((historyItem: queryResponse, i: number) => {
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
