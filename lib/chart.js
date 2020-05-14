// Load Highcharts
const exporter = require("highcharts-export-server");
const Highcharts = require("highcharts");
const fs = require("fs");
const shortid = require("shortid");
const path = require("path");

function defineGraph(barArray) {
  console.log(barArray)
  var highChart = {
    type: "png",
    
    options: {
      credits: {
        enabled: false
      },
      chart: {
          type: 'heatmap',
          marginTop: 40,
          marginBottom: 80,
          plotBorderWidth: 1
      },
      title: {
        text: "Class heatmap by day"
      },
      
      xAxis: {
          categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          title: null
      },
      yAxis: {
          categories: ['8', '9', '10', '11', '12', '1', '2', '3', '4', '5', '6', '7'],
          title: null
      },

      accessibility: {
          point: {
              descriptionFormatter: function (point) {
                  var ix = point.index + 1,
                      xName = getPointCategoryName(point, 'x'),
                      yName = getPointCategoryName(point, 'y'),
                      val = point.value;
                  return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
              }
          }
      },

      colorAxis: {
          min: 0,
          minColor: '#FFFFFF'
          //maxColor: Highcharts.getOptions().colors[0]
      },

      legend: {
          align: 'right',
          layout: 'vertical',
          margin: 0,
          verticalAlign: 'top',
          y: 25,
          symbolHeight: 280
      },

      tooltip: {
          formatter: function () {
              return '<b>' + getPointCategoryName(this.point, 'x') + '</b> sold <br><b>' +
                  this.point.value + '</b> items on <br><b>' + getPointCategoryName(this.point, 'y') + '</b>';
          }
      },

      series: [
        {
          data: barArray,
          borderWidth: 1,
          name: "Class Layout by Week"
        }
      ],
      
      responsive: {
          rules: [{
              condition: {
                  maxWidth: 500
              },
              chartOptions: {
                  yAxis: {
                      labels: {
                          formatter: function () {
                              return this.value.charAt(0);
                          }
                      }
                  }
              }
          }]
      }
    }
  };

  return highChart;
}

// Presence events, hourly
function exportGraph(barArray) {

  highChart = defineGraph(barArray)

  // Perform an export
  console.log("Exporting")
  var tmpFileName = path.join("./tmp", shortid.generate() + ".png");


  //Set up a pool of PhantomJS workers
  exporter.initPool();

  return new Promise((resolve, reject) => {
    exporter.export(highChart, function(err, res) {
      if (err) {
        reject(err);
      }

      var outData = new Buffer(res.data, "base64");
      fs.writeFileSync(tmpFileName, outData);
      resolve(tmpFileName);
      exporter.killPool();
    });
  });
}

module.exports = exportGraph;