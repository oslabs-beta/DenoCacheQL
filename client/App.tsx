import {
  React,
  //d34Deno,
  useEffect,
  useRef,
  createGraph,
} from '../deps.ts';
//import { Graph, Select } from "https://deno.land/x/d3_4_deno@v6.2.0.9/src/mod.js";
import * as d34Deno from 'https://deno.land/x/d3_4_deno@v6.2.0.9/src/mod.js';
//import * as d34Deno from "https://deno.land/x/d3_4_deno@v6.2.0.1/src/d3-select/mod.js";
//import * as d34Deno from "https://deno.land/x/d3_4_deno@v6.2.0/src/d3-selection/mod.js";
import { Graph } from 'https://deno.land/x/deno_chart/mod.ts';

const App = () => {
  let displayResponse;
  const [queryHistory, setQueryHistory] = React.useState([]);
  const [chartData, setChartData] = React.useState({
    dataSets: [],
  });

  const BarChart = () => {
    // const graph =  createGraph("https://deno.land/x/std/testing/asserts.ts");
    // console.log(graph.toString());

    /* The useRef Hook creates a variable that "holds on" to a value across rendering
         passes. In this case it will hold our component's SVG DOM element. It's
         initialized null and React will assign it later (see the return statement) */
    //

    const graph = new Graph({
      titleText: 'Uptime',
      xAxisText: 'Hours',
      yAxisText: 'Day',

      backgroundColor: {
        r: 0,
        g: 0,
        b: 0,
        a: 0.75,
      },

      yMax: 50,
      bar_width: 25,
      graphSegments_X: 18,

      xTextColor: 'rgba(255,255,255,1)',
      xSegmentColor: 'rgba(255,255,255,0.5)',
      yTextColor: 'rgba(255,255,255,1)',
      ySegmentColor: 'rgba(255,255,255,0.5)',

      // Verbose Logging (Optional)
      verbose: true,
    });

    // Random Bar Generation with Colors!
    const COLORS = ['#345C7D', '#F7B094', '#F5717F', '#F7B094', '#6C5B7A'];

    for (let i = 0; i < 12; i++) {
      const clr = COLORS[Math.floor(Math.random() * COLORS.length)];
      const y = Math.floor(Math.random() * 50);

      graph.add({
        val: y,
        label: (i + 1).toString(),
        color: clr,
      });
    }

    // Draw to Canvas Context & Save png image
    graph.draw();
    graph.save('image.png');
    console.log(graph);
  };

  //--------------------------------------
  const handleSubmitQuery = async (e: Event) => {
    e.preventDefault();

    const queryTextBox: string | undefined = e.target[0].value;
    let queryResponse: object = { response: null, source: null, time: null };

    // const query: string = `query getPeople($queryNumber: Int){getPeople()}`;

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
      </div>
    </>
  );
};

export default App;
