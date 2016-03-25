var w = $(".graph_box").width();
var h = 600;

/*console.log(w);
console.log(h);*/

var padding = 50;
var clicked = "no"
var id = -1;


//The y scale is set to linear.
var yscale = d3.scale.linear()

.range([h - padding, padding]);

//The x scale is set to linear.
var xscale = d3.scale.linear()

.range([padding, w - padding]);

//The x-axis is made using this.
var xaxis = d3.svg.axis()
    .scale(xscale)
    .orient("bottom")
    .ticks(10)
    .tickSize(padding - h);

//The y-axis is made using this.
var yaxis = d3.svg.axis()
    .scale(yscale)
    .orient("left")
    .ticks(20)
    .tickSize(-w);




//canvas selector created.
var canvas = d3.select(".graph").append("svg")
    .attr("width", w).attr("height", h);


//Adds the title to y-axis
canvas
    .append("text")
    .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("fill", "#bdc3c7")
    .attr("transform", "translate(" + (padding / 2 - 10) + "," + (h / 2) + ")rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
    .text("log(Period Derivative) [Sec/Sec] [Linear Scale]");

//Adds the title to x-axis
canvas.append("text")
    .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("fill", "#bdc3c7")
    .attr("transform", "translate(" + (w / 2) + "," + (h - (padding / 3)) + ")") // centre below axis
    .text("Period [sec] [Linear Scale]");


canvas.append("g")
    .attr("class", "axis x_axis")//Assign "axis" class
    .attr("transform", "translate(0," + (h - padding) + ")") 
    .call(xaxis);


canvas.append("g")
    .attr("class", "axis y_axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yaxis);


//Legend for the graph is made
legend = canvas.append("g")
    .attr("transform", "translate(" + (w - 290) + ",-5)")
    .style("font-size", "12px")
legend
    .append('rect')
    .attr('class', 'legend')
    .attr('height', 50)
    .attr('width', 220)
    .attr('fill', 'white')
    .style('stroke-width', 2)
    .style('stroke', 'rgba(0,0,0,0.25)')

legend.append('text')
    .attr("x", 5)
    .attr("y", 15)
    .attr('font-size', 12)
    .attr('font-family', 'Anaheim')
    .text('X Axis: Period (Sec)')
legend.append('text')
    .attr("x", 5)
    .attr("y", 30)
    .attr('font-size', 12)
    .attr('font-family', 'Anaheim')
    .text('Y Axis: log(Period Derivative) (Sec/Sec)')


legend.append('text')
    .attr('class', 'binary_title')
    .attr("x", 5)
    .attr("y", 42)
    .attr('font-size', 70)
    .attr('font-family', 'Anaheim')
    .text('.')

legend.append('text')

.attr("x", 20)
    .attr("y", 43)
    .attr('font-size', 12)
    .attr('font-family', 'Anaheim')
    .text('Binary')

legend.append('text')
    .attr("x", 90)
    .attr("y", 43)
    .attr('font-size', 12)
    .attr('font-family', 'Anaheim')
    .text('Non Binary')

legend.append('text')
    .attr("class", "nonbin")
    .attr("x", 75)
    .attr("y", 42)
    .attr('font-size', 70)
    .attr('font-family', 'Anaheim')
    .text('.')
    


//The call is made to /data/ route in flask which returns the data. 
d3.json("data", function(data) {
    dataset = data["data"];
    console.log(dataset.length);
    arr = []
    var max = dataset[0]["RMS"];
    for (i = 0; i < dataset.length; i++) {
        arr.push(dataset[i]["RMS"])
            /* console.log(dataset[i]["RMS"]);*/
    }

    //Data is sorted according to the RMS values.
    arr.sort();

    for (i = 0; i < arr.length; ++i) {
        for (j = i + 1; j < arr.length; ++j) {
            if (arr[i] > arr[j]) {
                a = arr[i];
                arr[i] = arr[j];
                arr[j] = a;
            }
        }
    }
    console.log(arr);

    data_new = []

    for (i = 0; i < arr.length; i++) {
        for (j = 0; j < dataset.length; j++) {
            if (arr[i] == dataset[j]["RMS"]) {
                data_new.push(dataset[j])
            }
        }
    }
    console.log(data_new);
    dataset = data_new;
    refreshgraph(dataset);

    var zoom = d3.behavior.zoom()
        .x(xscale)
        .y(yscale)
        .on("zoom", function() {
            update(dataset);
        });
    canvas.call(zoom);
    update(dataset);


});

//This function updates the axis when ooming in and out.
function update(dataset) {
    var circle =

        canvas.selectAll('circle').data(dataset)
    xaxis.scale(xscale);

    yaxis.scale(yscale);



    canvas.selectAll("g.x_axis").call(xaxis);
    canvas.selectAll("g.y_axis").call(yaxis);

    circle.attr("cx", function(d) {
            return xscale(d["Period"]);
        })
        .attr("cy", function(d) {
            return yscale(Math.log10(d["Period Derivative"]));
        })



}

//This function is the main function which updates addidtion and deletion of data.
function refreshgraph(dataset) {

    /*console.log(dataset);*/

    yscale.domain([d3.min(dataset, function(d) {
        return Math.log10(d["Period Derivative"]);
    }), d3.max(dataset, function(d) {
        return Math.log10(d["Period Derivative"]);
    })])


    xscale.domain([d3.min(dataset, function(d) {
        return d["Period"];
    }), d3.max(dataset, function(d) {
        return d["Period"];
    })])


    xaxis.scale(xscale);
    yaxis.scale(yscale);

    canvas.selectAll("g.x_axis").call(xaxis);
    canvas.selectAll("g.y_axis").call(yaxis);

    canvas.on("click", function() {
        var coor = d3.mouse(this);
        console.log(xscale.invert(coor[0]) + "  " + yscale.invert(coor[1]));
        dataset.push({
            "Period": xscale.invert(coor[0]),
            "periods_der": yscale.invert(coor[1])
        });
        console.log(dataset)

    })

    var r = 3;
    var nodes = canvas.selectAll("circle")
        .data(dataset);

    nodes.exit().remove();

    nodes.enter()
        .append("circle")
        .attr("fill", function(d) {
            return setcolor(d);
        })
        .transition()
        .duration(100)
        .delay(function(d, i) {
            return i * 100;
        })


    .attr("cx", function(d) {
            return xscale(d["Period"]);
        })
        .attr("cy", function(d) {
            return yscale(Math.log10(d["Period Derivative"]));
        })
        .attr("r", function() {
            r = r + 0.1;
            return r;
        });


    console.log(clicked + "starting")


    canvas.selectAll("circle").on("mouseover", handlemouseover);
    canvas.selectAll("circle").on("mouseout", handlemouseout);

    canvas.selectAll("circle").on("click", selection);

    console.log(clicked);
}

function setcolor(d) {
    /*  console.log(d["Binary"]*/
    if (d["Binary"] == "Y") {
        return "#2ecc71";
    } else {
        return "#e74c3c";
    }
}

//This helps in selection of data points which then can be deleted.
function selection(d, i) {

    
    if (clicked == "no") {
        d3.select(this).attr({
            fill: "black",
            r: 10
        });
        clicked = "yes"
        id = i
        $(".pulsar").val(d["Pulsar"]);
        $(".rms").val(d["RMS"]);
        $(".dm").val(d["DM"]);
        $(".binary").val(d["Binary"]);
        $(".period").val(d["Period"]);
        $(".periodder").val(d["Period Derivative"]);
        $(".rawprof").val(d["Raw Profiles"]);
        $(".toas").val(d["TOAs"]);

     

    } else if (clicked == "yes" && i == id) {

        d3.select(this).attr({
            fill: function(d) {
                return setcolor(d);
            },
            r: 3 + 0.1 * (i + 1)

        });
        clicked = "no"
        $(".pulsar").val(" ");
        $(".rms").val(" ");
        $(".dm").val(" ");
        $(".binary").val(" ");
        $(".period").val(" ");
        $(".periodder").val(" ");
        $(".rawprof").val(" ");
        $(".toas").val(" ");
    }
    console.log(clicked);
}


//This function is called on mousehover on a data point.
function handlemouseover(d, i) {

    if (clicked == "no") {
        d3.select(this).attr({

            /*  console.log(r);*/
            fill: "#e67e22",
            r: 10

        });
        console.log(d["RMS"]);

        $(".pulsar").html(d["Pulsar"]);
        $(".rms").html(d["RMS"]);
        $(".dm").html(d["DM"]);
        $(".binary").html(d["Binary"]);
        $(".period").html(d["Period"]);
        $(".periodder").html(d["Period Derivative"]);
        $(".rawprof").html(d["Raw Profiles"]);
        $(".toas").html(d["TOAs"]);

        $(".pulsar").val(d["Pulsar"]);
        $(".rms").val(d["RMS"]);
        $(".dm").val(d["DM"]);
        $(".binary").val(d["Binary"]);
        $(".period").val(d["Period"]);
        $(".periodder").val(d["Period Derivative"]);
        $(".rawprof").val(d["Raw Profiles"]);
        $(".toas").val(d["TOAs"]);

    }
    console.log(clicked);




}


//This function is called when mouse leaves a data point.
function handlemouseout(d, i) {

    if (clicked == "no") {

        d3.select(this).attr({
            fill: function(d) {
                return setcolor(d);
            },
            r: 3 + 0.1 * (i + 1)

        });
        console.log(clicked);
        $(".pulsar").html(" ");
        $(".rms").html(" ");
        $(".dm").html(" ");
        $(".binary").html(" ");
        $(".period").html(" ");
        $(".periodder").html(" ");
        $(".rawprof").html(" ");
        $(".toas").html(" ");

        $(".pulsar").val(" ");
        $(".rms").val(" ");
        $(".dm").val(" ");
        $(".binary").val(" ");
        $(".period").val(" ");
        $(".periodder").val(" ");
        $(".rawprof").val(" ");
        $(".toas").val(" ");

    }
    console.log(clicked);
}

