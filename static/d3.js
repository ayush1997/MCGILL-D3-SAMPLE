

		var w = $(".graph_box").width();
		var h = 600;
/*    w=800;
		h = 600;*/
		console.log(w);
		console.log(h);

		var padding = 50;
		var clicked = "no"
		var id = -1;



		var yscale = d3.scale.linear()

		.range([h - padding, padding]);


		var xscale = d3.scale.linear()

		.range([padding, w - padding]);

		var xaxis = d3.svg.axis()
				.scale(xscale)
				.orient("bottom")
				.ticks(10)
				.tickSize(padding - h);

		var yaxis = d3.svg.axis()
				.scale(yscale)
				.orient("left")
				.ticks(20)
				.tickSize(-w);





		var canvas = d3.select(".graph").append("svg")
				.attr("width", w).attr("height", h);

/*canvas.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", w/2+100)
    .attr("y", h - 20)
    .text("Period [s] (Linear scale)");


canvas.append("text")
    .attr("text-anchor", "middle")  
    .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)") 
        .attr("transform", "rotate(-90)")

    .text("log(Period Derivative) [S/S] (linear scale)");*/

     canvas
     .append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("fill","#bdc3c7")
            .attr("transform", "translate("+ (padding/2-10) +","+(h/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text("log(Period Derivative) [Sec/Sec] [Linear Scale]");

        canvas.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("fill","#bdc3c7")
            .attr("transform", "translate("+ (w/2) +","+(h-(padding/3))+")")  // centre below axis
            .text("Period [sec] [Linear Scale]");
            

		canvas.append("g")
				.attr("class", "axis x_axis")
				.attr("transform", "translate(0," + (h - padding) + ")") //Assign "axis" class
				.call(xaxis);


		canvas.append("g")
				.attr("class", "axis y_axis")
				.attr("transform", "translate(" + padding + ",0)")
				.call(yaxis);


		
		legend =canvas.append("g")
						.attr("transform","translate("+(w-290)+",-5)")
						.style("font-size","12px")
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
	  	 .attr('class', 'binary')
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
     .attr("class","nonbin")
        .attr("x", 75)
        .attr("y", 42)
        .attr('font-size', 70)
        .attr('font-family', 'Anaheim')
        
        .text('.')
		/*periods_der = []
		 for (i = 0; i < dataset.length; i++) {
						periods_der.push(Math.log10(dataset[i]['x']))
				}

				console.log(periods_der);*/



		d3.json("data", function(data) {
				dataset = data["data"];
				console.log(dataset.length);
				arr = []
				var max = dataset[0]["RMS"];
				for (i = 0; i < dataset.length; i++) {
						arr.push(dataset[i]["RMS"])
				 /* console.log(dataset[i]["RMS"]);*/
				}


				arr.sort();

				   for (i = 0; i < arr.length; ++i)
    				{
        				for (j = i + 1; j < arr.length; ++j)
       								 {
							            if (arr[i] > arr[j])
							            {
							                a =  arr[i];
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
		/*function zoomed(dataset) {

			console.log("in the zoom fn");
			console.log(dataset);
				 xaxis.scale(xscale);

					yaxis.scale(yscale);

					canvas.selectAll("g.x_axis").call(xaxis);
					canvas.selectAll("g.y_axis").call(yaxis);

					 canvas.selectAll(".points")
				.data(dataset)
				.enter()
				.append("circle")
				.attr("cx", function(d) { return xscale(d["Period"]); })
				.attr("cy", function(d) { return yscale(Math.log10(d["Period Derivative"])) ;})
				.attr("r", "5px")
				.attr("fill", "black")
				

		}*/

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


				/*yscale.domain([d3.min(dataset, function(d) { return Math.log10(d["Period Derivative"]); }), d3.max(dataset, function(d) { return Math.log10(d["Period Derivative"]) ;} )]);
				xscale .domain([d3.min(dataset, function(d) { return d["Period"]; }), d3.max(dataset, function(d) { return d["Period"]; })]);
*/
				xaxis.scale(xscale);
				yaxis.scale(yscale);

				canvas.selectAll("g.x_axis").call(xaxis);
				canvas.selectAll("g.y_axis").call(yaxis);

				/*  canvas.call(zoom);  */

				/*
				canvas.call(xaxis);
				canvas.call(yaxis);
				*/
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

		function selection(d, i) {

				/*console.log(d3.select(this).style("fill"));
				 */
				/*console.log(i);*/

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

					/*  $("button special").removeClass("btn-danger");
						$("button special").addClass("btn-warning");*/


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

		/* console.log(d);
$.ajax({
	url:"/delete/"+d["Pulsar"],
	contentType: "application/json"
});

}*/


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

		/*console.log(d);
		console.log(i);
		}*/

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
		function draw_legend()
		{
			 legend
        .append('rect')
        .attr('class', 'legend')
        .attr('height', 50)
        .attr('width', 260)
        .attr('fill', 'white')
        .style('stroke-width', 2)
        .style('stroke', 'rgba(0,0,0,0.25)')

/*    legend.append('text')
        .attr("x", 5)
        .attr("y", 15)
        .attr('font-size', 12)
        .attr('font-family', 'Anaheim')
        .text('X-Axis: Period (Sec) [linear scale]')

	
		legend.append('text')
        .attr("x", 5)
        .attr("y", 30)
        .attr('font-size', 12)
        .attr('font-family', 'Anaheim')
        .text('Y-Axis: Period Deriavtive[s/s](log pd)[linear scale]')
*/
 legend
        .append("circle")
        .attr('cx', 95)
        .attr('cy', 15)
        .attr('r', 3)
        .attr("opacity", 0.75)
        .style('fill', 'black')
    legend.append('text')
        .attr("x", 5)
        .attr("y", 25)
        .attr('font-size', 12)
        .attr('font-family', 'Anaheim')
        .text('Binary')
/*    legend
        .append("circle")
        .attr('cx', 80)
        .attr('cy', 41)
        .attr('r', 3)
        .attr("opacity", 0.75)
        .style('fill', '#3D5AFE')*/
    legend.append('text')
        .attr("x", 100)
        .attr("y", 25)
        .attr('font-size', 12)
        .attr('font-family', 'Anaheim')
        .text('Non Binary')

}


