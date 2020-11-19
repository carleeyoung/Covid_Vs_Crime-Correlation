// import data from sqlite database on flask server
d3.json('/data').then(function(data){
  console.log(data);
  console.log(data[0][0].covid_cases);

  // collect covid_cases and population data by zip code and store in barData
  var barData = [];

  for (var i = 0; i <10; i++) {
      
      for (var j = 0; j < data[2].length; j++) {

        for (var k = 0; k <data[1].length; k++) {

          if (data[0][49-i].zipcode === data[2][j].zipcode & data[0][49-i].zipcode === data[1][k].zipcode) {
            barData.push(
                  {"zipcode": "_" + data[0][49-i].zipcode + "_", 
                  "covid_cases": data[0][49-i].covid_cases,
                  "population": data[2][j].population,
                  "crime": data[1][k].crime_cases}
                  );
          }
        }
      }
  };

  // isolate x and y variables for bar charts
  console.log(barData);
  zipcode = barData.map(({ zipcode }) => zipcode)
  console.log(zipcode);
  covid_cases = barData.map(({ covid_cases }) => covid_cases)
  console.log(covid_cases);
  population = barData.map(({ population }) => population)
  console.log(population);
  crime = barData.map(({ crime }) => crime)
  console.log(crime);

  // construct chart using plotly react
  const Plot = createPlotlyComponent(Plotly);

  ReactDOM.render(
    React.createElement(Plot, {
    
      data: [
        {
          type: 'bar',
          x: zipcode,
          y: covid_cases,
          name: 'Covid-19 Cases'
        },
        
        {type: 'bar',
          x: zipcode,
          y: crime,
          marker: {color: 'gold'},
          name: 'Crime Cases'},

        {
          type: 'scatter',
          mode: 'markers',
          x: zipcode,
          y: population,
          marker: {color: 'red',
                  symbol: 'diamond-wide-dot',
                size: 25},
          line: 'false',
          yaxis: 'y2',
          name: 'Population'
        }
      ],
      layout: {
        title: '10 Highest Covid Cases by Zipcode with Crime and Population',
        legend: {
          orientation:"h",
          yanchor:"bottom",
          y:1.05,
          xanchor:"center",
          x:0.5
          },
        autosize: false,
        width: "100%",
        height: '100%',
        xaxis: {tickangle: '0',
                title: 'Zipcode'},
        yaxis: {title: 'Covid Cases and Crime',
          range: [0, 4000]},
        yaxis2: {
          title: 'Population',
          overlaying: 'y',
          side: 'right',
          range: [0, 50000],
        barmode: 'group',
        bargap: 0.15,
        bargroupgap: 0.1
        }
      }
    }),
    document.getElementById('img2')
  );

  function renderTable(data) {
    var tableData = [];
    for (var i = 0; i <10; i++) {
        tableData.push({
                  "Zipcode": data[i].zipcode.slice(1, 6),
                  "Covid_Per_Capita": Math.round((data[i].covid_cases / data[i].population)*1000)/10 + '%',
                  "Crime_Per_Capita": Math.round((data[i].crime / data[i].population)*1000)/10 + '%'
                  })
        }; 

    var tbody = d3.select("tbody").html("");
    tableData.forEach((stat) => {
      var row = tbody.append("tr");
      Object.entries(stat).forEach(([key,value]) => {
        var cell = row.append("td");
            cell.text(value);
        // cell.text(value);
      });
      });
   }; 
   renderTable(barData);
 });