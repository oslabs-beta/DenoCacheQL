import React from 'https://esm.sh/react@18.2.0';
import Chartjs from 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';

const RenderGraph = ({ responseTimes }) => {
  console.log('response times data', responseTimes);
  let graphLabels = [];
  responseTimes.map((el, i) => {
    graphLabels.push(i + 1);
  });

  let chartStatus = Chart.getChart('myChart'); // <canvas> id
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }
  const ctx = document.getElementById('myChart').getContext('2d');

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
  });
};

export default RenderGraph;
