// app.js file - Randy Dettmer 2020/05/11


/// create function for data plotting - not working
function getPlots(id) {
    d3.json("data/samples.json").then((sampleData) => {
    //console.log(`sampleData: ${sampleData}`);
    
    // collect data for gauge
    var washfreq = sampleData.metadata.filter(d1 => d1.wfreq);
    //console.log(`washfreq: ${washfreq}`);

    // collect data for bar and bubble plots
    var sdata = sampleData.samples.filter(d2 => d2.id.toString() === id)[0];
    //console.log(sdata);


    // collect sample values for bar chart with top 10 OTU values
    // reverse sample values
    var sample_values = sdata.sample_values.slice(0,10).reverse();
    //console.log(`sample_values: ${sample_values}`);


    var OTU_top = (sdata.otu_ids.slice(0,10)).reverse();
    //console.log(`OTU_top: ${OTU_top}`);
    var OTU_id = OTU_top.map(data => "OTU" + data);
    //console.log(`OTU_id: ${OTU_id}`);
    
    var labels = sdata.otu_labels.slice(0,10);
    //console.log(`labels: ${labels}`);


    // BAR CHART
    var trace1 = {
        x: sample_values,
        y: OTU_id,
        text: labels,
        marker: {
            color: 'rgb (142, 124, 195)'},
        type: "bar",
        orientation: "h"
    };

    // create data variable for bar plot
    var chartBar = [trace1];

    // apply the group bar mode to the layout
    var layout1 = {
        title: "OTU top Ten",
        yaxis: {
            tickmode: "linear",
        },
        //showlegend: false,
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        }
    };

    //render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", chartBar, layout1, {displayMode: false});
    
    /// BUBBLE CHART
    var trace2 = {
        x: sdata.otu_ids,
        y: sdata.sample_values,
        mode: "markers",
        marker: {
            size: sdata.sample_values,
            color: sdata.otu_ids,
            //sizemode: 'area', - makes circles very very small
            colorscale: "Blackbody"
        },
        text: sdata.otu_labels,
    };

    // apply the layout to the bubble plot
    var Layout2 = {
        margin: {t: 0},
        hovermode: "closests",
        xaxis: {title: "OTU ID"},
        height: 600,
        width: 1000,
        //showlegend: true
    };

    // creating data variable
    var chartBubble = [trace2];

    //render the plot to the div tag with id "bubble"
    Plotly.newPlot("bubble", chartBubble, Layout2, {displayModeBar: false});

    /*
    // render example plot - bubble
    Plotly.newPlot('myDiv', data, layout);

    // hover event to show data - - - - - need above too
    myPlot.on('plotly_hover', function(data){
    var infotext = data.points.map(function(d){
      return (d.data.name+': x= '+d.x+', y= '+d.y.toPrecision(3));
    });

    hoverInfo.innerHTML = infotext.join('<br/>');
    })
    .on('plotly_unhover', function(data){
    hoverInfo.innerHTML = '';
    });

    */

    // GAUGE CHART
    var trace3 = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(washfreq),
          title: { text: `Weekly Washing Frequency` },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [null, 9] },
            steps: [
              { range: [0, 1], color: "red" },
              { range: [1, 2], color: "#d62728" },
              { range: [2, 3], color: "orange" },
              { range: [3, 4], color: "#ff7f0e" },
              { range: [4, 5], color: "yellow" },
              { range: [5, 6], color: "#bcbd22" },
              { range: [6, 7], color: "lime" },
              { range: [7, 8], color: "7C9F3C" },
              { range: [8, 9], color: "green" },
            ]} 
        }
            ];
      
    // apply the layout to the gauge plot     
    var layout3 = {
        showlegend: true, 
        width: 500, 
        height: 450, 
        margin: { 
            t: 20, 
            b: 40, 
            l: 100, 
            r: 100 } 
        }

    // create data variable - this method doesn't work with gauges
    //var chartGauge = [trace3];    

    //render the plot to the div tag with id "gauge"
    Plotly.newPlot("gauge", trace3, layout3, {displayMode: false});  
});
}

// create the function to get the requested data for demographic info panel
function getData(id) {
	///test
	d3.json("data/samples.json").then((importedData) => {
    //console.log(`importedData: ${importedData}`);
    // collect metadata for demographic info panel
    var metadata = importedData.metadata;
    // filter metadata by id
    var result = metadata.filter(meta => meta.id.toString() === id)[0];
    //console.log(`var result: ${result}`);
    // select Demographic Info panel
    var demographicInfo = d3.select("#sample-metadata");
    // next clear panel
    demographicInfo.html("");
    // collect deographic data for the id and add to the panel
        Object.entries(result).forEach((key) => {
        //- .bold()? no - assinging "h5" value makes font larger "h6" is too big
        demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
	});
}

// create function for change event
function optionChanged(id) {
    //update and build new plots with new data selected
    getPlots(id);
    getData(id);
}

/// create the function for the initial data rendering
function init() {
	//select dropdown menu
    var dropdown = d3.select("#selDataset");
    // read the data
    d3.json("data/samples.json").then((ImportedData) => {
        //console.log(`ImportedData: ${ImportedData}`);
        // get the id data to the dropdown menu
        ImportedData.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });
    // call the functions to display the data and the plots to the page
    getPlots(ImportedData.names[0]);
    getData(ImportedData.names[0]);
    });
}

//initialize the dashboard
init();