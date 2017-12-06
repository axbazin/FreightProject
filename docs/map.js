

function mapDrawing(){
	

var width = 900,
	height = 400,
	active = d3.select(null);

var svg = d3.select("figure")
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
	
console.log(d3.select("figure"))

var g = svg.append("g");

var projection = d3.geoConicConformal().center([15, 50]).scale(600);


var path = d3.geoPath()
			 .projection(projection);

var wanted = ["Belgium","Bulgaria","Czech Republic","Denmark","Germany","Estonia","Ireland","Greece","Spain","France","Croatia","Italy","Cyprus","Latvia","Lithuania","Luxembourg","Hungary","Netherlands","Austria","Poland","Romania","Slovenia","Slovakia","Finland","Sweden","United Kingdom","Liechtenstein","Norway","Switzerland","Serbia","Portugal","The former Yugoslav Republic of Macedonia","Albania","Bosnia and Herzegovina","Montenegro"];
console.log(wanted.length)

var zoom = d3.zoom() 
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

d3.json("europe.geojson", function(json) {
  console.log(json.features.length)
  var true_map = [];
  var country_centers = []
  for(i in json.features){
	   var country_name = json.features[i].properties.NAME
	   //console.log(country_name);
		
	   if(wanted.includes(country_name)){
		 //console.log(country_name);
		 true_map.push(json.features[i]);
	   //}else{
	   //  console.log(country_name)
	   }
	   var coord =json.features[i].geometry.coordinates[0]
	   
	   var x = d3.mean(coord, function(c){return c[0];});
		 var y = d3.mean(coord, function(c){return c[1];});
	   
	   country_centers.push({name : country_name,
						 coord : [x,y]});
	   
   }
  console.log(true_map.length);
  json.features = true_map;
 // console.log(country_centers)
  //console.log(json.features)
	
	
	svg.call(zoom);

	g.selectAll("path")
		.data(json.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style("fill","lightgrey");
		
	
	g.selectAll("circle")
		.attr("class","bubble")
		.data(json.features)
		.enter()
		.append("circle")
		.attr("r",10)
			.attr("transform", function(d) {return "translate(" + path.centroid(d) + ")"; })
			.attr("r", 10)
		.style("fill","black")
		.style("cursor","pointer");
	
	g.selectAll("circle").on("click", clicked);
  
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
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}
	
};
