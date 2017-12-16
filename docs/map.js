

function mapDrawing(){
	

   
var val = 50,
	width = 10 * val,
	height = 12 * val,
	active = d3.select(null);

var svg = d3.select("body")
	.append( "svg" )
	.attr( "width", width )
	.attr( "height", height )	
	.on("click", stopped, true);
	//this code is to make the thing responsive, eventually.
	/*.classed("svg-container", true)
	//responsive SVG needs these 2 attributes and no width and height attr
	.attr("preserveAspectRatio", "xMinYMin meet")
	.attr("viewBox", "0 0 900 400")
	//class to make it responsive
	.classed("svg-content-responsive", true)*/
	
//console.log(d3.select("figure"))

var g = svg.append("g");

var zoom = d3.zoom() 
    .scaleExtent([1, 8])
    .on("zoom", zoomed);
  
  var jsondata;
  var coord = Array()
	d3.json("europe_map.json", function(error, data){
		jsondata = data.map;
    console.log(error)
    console.log(jsondata);
		for(i in jsondata){
			curr_Cord = Array();
			var x = jsondata[i]["x"];
			var y = jsondata[i]["y"];
			curr_Cord.push(x,y);
      coord.push(curr_Cord)
		};
    
	console.log(coord);
	
	svg.call(zoom);

	/*g.selectAll("path")
		.data(json.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style("fill","lightgrey");*/
	
	svg.selectAll("rect").data(coord)
		.enter()
		.append("rect")
		.attr("x", function(d){return d[0]*val;})
		.attr("y",function(d){return d[1]*val;})
		.attr("height", 0.95 * val)
		.attr("width", 0.95 * val)
		.style("fill","white")
		.style("cursor","pointer");

	g.selectAll("rect").on("click", clicked);
  
	});
	
//zoom and pan functions from: https://bl.ocks.org/iamkevinv/0a24e9126cd2fa6b283c6f2d774b69a2
function clicked(d) {
	//define what happens on click here.

	if (active.node() === this) return reset();
		active.classed("active", false);
		active = d3.select(this).classed("active", true);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
      translate = [width / 2 - scale * x, height / 2 - scale * y];
      
  svg.transition()
		.duration(750)
		.call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); // updated for d3 v4
		
		//call functions for displaying data.
}

function reset() {
  active.classed("active", false);
  active = d3.select(null);

  svg.transition()
      .duration(750)
      .call( zoom.transform, d3.zoomIdentity ); 
      
   //hide elements that were displayed. (or erase ???)
}

function zoomed() {
  g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
  g.attr("transform", d3.event.transform); // updated for d3 v4
}

function stopped() {
  if(d3.event.defaultPrevented){
    d3.event.stopPropagation();
  }
};
	

	
};
