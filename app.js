// app.js file - Randy Dettmer 2020/05/15

/// create function for data plotting
function getPlots(id) {
    d3.json("data/samples.json").then((sampleData) => {
    //console.log(`sampleData: ${sampleData}`);

    // collect data for bar and bubble plots
    var sdata = sampleData.samples.filter(d1 => d1.id.toString() === id)[0];
    //console.log(sdata);

    // collect sample values for bar chart with top 10 OTU values
    // reverse sample values
    var sample_values = sdata.sample_values.slice(0,10).reverse();
    //console.log(`sample_values: ${sample_values}`);
    var OTU_top = (sdata.otu_ids.slice(0,10)).reverse();
    console.log(`OTU_top: ${OTU_top}`);
    var OTU_id = OTU_top.map(data => "OTU " + data);
    console.log(`OTU_id: ${OTU_id}`);
    var labels = sdata.otu_labels.slice(0,10);
    //console.log(`labels: ${labels}`);


    /// BAR CHART AREA
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
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        }
    };
    //render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", chartBar, layout1);


    /// BUBBLE CHART AREA
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
        xaxis: {title: "OTU ID"},
        height: 600,
        width: 1000,
    };
    // creating data variable
    var chartBubble = [trace2];
    //render the plot to the div tag with id "bubble"
    Plotly.newPlot("bubble", chartBubble, Layout2, {displayModeBar: false});


    /// GAUGE CHART AREA
    // collect data for gauge
    var wdata = sampleData.metadata.filter(d1 => d1.id.toString() === id)[0];
    //console.log(wdata);
    // generate variable for the gauge value
    var washfreq = wdata.wfreq;
    //console.log(`washfreq: ${washfreq}`);
    var trace3 = [
        {
          type: "indicator",
          mode: "gauge+number+delta",
          value: parseFloat(washfreq),
          title: { text: `Weekly Washing Frequency` },
          /* although it is arbitary, I made the treshold to be five times a week 
          minimum to have an acceptable delta */ 
          delta: { reference: 5, increasing: { color: "green"}},
          gauge: {
            axis: { range: [null, 9], tickwidth: 1, tickcolor: "black" },
            bar: { color: "black" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
                { range: [0, 1], color: "#d62728" },  
                { range: [1, 2], color: "red" },
                { range: [2, 3], color: "#ff7f0e" },
                { range: [3, 4], color: "orange" },
                { range: [4, 5], color: "yellow" },
                { range: [5, 6], color: "lime" },  
                { range: [6, 7], color: "#bcbd22" },
                { range: [7, 8], color: "7C9F3C" },
                { range: [8, 9], color: "green" },
            ],

        } 
    }
];
    // apply the layout to the gauge plot     
    var layout3 = {
        //showlegend: true, 
        width: 500, 
        height: 450, 
        margin: { 
            t: 20, 
            b: 40, 
            l: 100, 
            r: 100 } 
        }  
    //render the plot to the div tag with id "gauge"
    Plotly.newPlot("gauge", trace3, layout3);  
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