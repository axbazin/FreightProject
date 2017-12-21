

function mapDrawing(){
	

  var config = {
    width : 1000,
    height : 700,
    padding : 70,
    projection : d3.geoMercator(),
    duration : 2000,
    key:function(d){return d.properties.ISO_A3; },
    grid : {
      ALB: { x: 5, y: 8 },
          ARM: { x: 9, y: 6 },
          AUS: { x: 9, y: 9 },
          AUT: { x: 4, y: 5 },
          AZE: { x: 9, y: 5 },
          BEL: { x: 2, y: 3 },
          BGR: { x: 7, y: 6 },
          BIH: { x: 5, y: 6 },
          BLR: { x: 6, y: 3 },
          CHE: { x: 3, y: 4 },
          CYP: { x: 8, y: 7 },
          CZE: { x: 4, y: 4 },
          DEU: { x: 4, y: 3 },
          DNK: { x: 4, y: 2 },
          ESP: { x: 1, y: 5 },
          EST: { x: 6, y: 1 },
          FIN: { x: 6, y: 0 },
          FRA: { x: 1, y: 4 },
          GBR: { x: 1, y: 2 },
          GEO: { x: 8, y: 5 },
          GRC: { x: 6, y: 8 },
          HUN: { x: 5, y: 5 },
          HRV: { x: 4, y: 6 },
          IRL: { x: 0, y: 2 },
          ISL: { x: 0, y: 0 },
          ISR: { x: 8, y: 8 },
          ITA: { x: 3, y: 5 },
          KOS: { x: 6, y: 7 },
          LTU: { x: 6, y: 2 },
          LUX: { x: 2, y: 4 },
          LVA: { x: 7, y: 2 },
          MDA: { x: 7, y: 5 },
          MKD: { x: 7, y: 7 },
          MLT: { x: 1, y: 7 },
          MNE: { x: 5, y: 7 },
          NLD: { x: 3, y: 3 },
          NOR: { x: 4, y: 0 },
          POL: { x: 5, y: 3 },
          PRT: { x: 0, y: 5 },
          ROU: { x: 6, y: 5 },
          RUS: { x: 7, y: 3 },
          SMR: { x: 2, y: 6 },
          SRB: { x: 6, y: 6 },
          SVK: { x: 5, y: 4 },
          SVN: { x: 3, y: 6 },
          SWE: { x: 5, y: 0 },
          UKR: { x: 6, y: 4 },
          TUR: { x: 8, y: 6 }
    }
  };

  var svg = d3.select('body')
    .append('svg')
    .attr('width',config.width)
    .attr('height',config.height);

  var g2r = new geo2rect.draw();

  d3.json('eurovis-countries-simplified.geojson', function(err, data){
    var geojson = geo2rect.compute(data);
    g2r.config = config;
    g2r.data = geojson;
    g2r.svg = svg.append('g');
    g2r.draw();
  });

  d3.select('#toggle').on('click', function(){
    g2r.toggle();
    g2r.draw();

  });

	
};
