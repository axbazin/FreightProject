(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.geo2rect = global.geo2rect || {})));
}(this, function (exports) { 'use strict';

	var trans_data = { 
			AD: { ISO3: "AND", name: "Andorra"},// not on geo map 
			AL: { ISO3: "ALB", name: "Albania"},
			AT: { ISO3: "AUT", name: "Austria"},
			BE: { ISO3: "BEL", name: "Belgium"},
			BG: { ISO3: "BGR", name: "Bulgaria"},
			CH: { ISO3: "CHE", name: "Switzerland"},
			CZ: { ISO3: "CZE", name: "Czech Republic"},
			DE: { ISO3: "DEU", name: "Germany"},
			DK: { ISO3: "DNK", name: "Denmark"},
			EE: { ISO3: "EST", name: "Estonia"},
			EL: { ISO3: "GRC", name: "Greece"},
			ES: { ISO3: "ESP", name: "Spain"},
			FI: { ISO3: "FIN", name: "Finland"},
			FR: { ISO3: "FRA", name: "France"},
			HR: { ISO3: "HRV", name: "Croatia"},
			HU: { ISO3: "HUN", name: "Hungary"},
			IE: { ISO3: "IRL", name: "Ireland"},
			IT: { ISO3: "ITA", name: "Italy"},
			LI: { ISO3: "LIE", name: "Liechtenstein"},// not on geo map 
			LT: { ISO3: "LTU", name: "Lithuania"},
			LU: { ISO3: "LUX", name: "Luxembourg"},
			LV: { ISO3: "LVA", name: "Latvia"},
			NL: { ISO3: "NLD", name: "Netherlands"},
			NO: { ISO3: "NOR", name: "Norway"},
			PL: { ISO3: "POL", name: "Poland"},
			PT: { ISO3: "PRT", name: "Portugal"},
			RO: { ISO3: "ROU", name: "Romania"},
			SE: { ISO3: "SWE", name: "Sweden"},
			SI: { ISO3: "SVN", name: "Slovenia"},
			SK: { ISO3: "SVK", name: "Slovakia"},
			UK: { ISO3: "GBK", name: "United Kingdom"},
			UA: { ISO3: "UKR", name:"Ukraine"},
			XX: { ISO3: "ISL", name: "Iceland"},
			XY: { ISO3: "BLR", name: "Belarus"},
			KO: { ISO3: "KOS", name: "Kosovo"},
			RS: { ISO3: "SRB", name: "Serbia"},
			ME: { ISO3: "MNE", name: "Montenegro"},
			BA: { ISO3: "BIH", name: "Bosnia"},
			MK: { ISO3: "MKD", name: "Macedonia"},
			MD: { ISO3: "MDA", name: "Moldova"}
		};



	function compute (data) {

		data.features.forEach(function (d, di) {
			//Preserve original coordinates
			d.geometry["ocoordinates"] = d.geometry.coordinates;

			//As we can only transform one polygon into a rectangle, we need to get rid of holes and small additional polygons (islands and stuff)
			if (d.geometry.type === "MultiPolygon") {
				//choose the largest polygon
				d.geometry.coordinates = largestPoly(d.geometry);
				d.geometry.type = "Polygon";
			}

			//Getting rid of holes
			if (d.geometry.coordinates.length > 1) {
				//We are too lazy to calculate if poly is clockwise or counter-clockwise, so we again just keep the largest poly
				d.geometry.coordinates = largestPoly(d.geometry);
			}

			var b = turf.bbox(d);
			d.geometry["centroid"] = [(b[2] - b[0]) / 2 + b[0], (b[1] - b[3]) / 2 + b[3]];

			//Not supported geometries (length<4) we simply duplicate the first point
			//TODO: the new points could be evenly distributed between the existing points
			//TODO: but this only for triangles anyway, anything with (length<3) is actually an error
			if (d.geometry.coordinates[0].length < 4) {
				while (d.geometry.coordinates[0].length < 4) {
					d.geometry.coordinates[0].push(d.geometry.coordinates[0][0]);
				}
			}

			var geom = d.geometry.coordinates[0],
					corners = [];

			//Moving through the four corners of the rectangle we find the closest point on the polygon line, making sure the next point is always after the last

			var _loop = function _loop(i) {

				var corner = void 0,
						dist = Number.MAX_VALUE,
						pc = void 0;

				switch (i) {
					case 0:
						pc = [b[0], b[3]];
						break;
					case 1:
						pc = [b[2], b[3]];
						break;
					case 2:
						pc = [b[2], b[1]];
						break;
					case 3:
						pc = [b[0], b[1]];
						break;
				}

				geom.forEach(function (dd, ddi) {
					var t_dist = Math.abs(Math.sqrt(Math.pow(pc[0] - dd[0], 2) + Math.pow(pc[1] - dd[1], 2)));
					if (t_dist < dist && (ddi < corners[0] || ddi > corners[corners.length - 1] || corners.length === 0)) {
						dist = t_dist;
						corner = ddi;
					}
				});

				if (corners.length >= 1) {
					//Counting the points already used up
					var pointCount = 0;
					if (corners.length >= 2) {
						for (var _j = 1; _j < corners.length; _j++) {
							var _c3 = corners[_j],
									_c4 = corners[_j - 1],
									_numPoints2 = void 0;

							if (_c4 < _c3) {
								_numPoints2 = _c3 - _c4;
							} else {
								_numPoints2 = _c3 + (geom.length - _c4);
							}

							pointCount += _numPoints2;
						}
					}

					//get numpoints for new potential point
					var _c = corners[corners.length - 1],
							_c2 = corner,
							_numPoints = void 0;

					if (_c < _c2) {
						_numPoints = _c2 - _c;
					} else {
						_numPoints = _c2 + (geom.length - _c);
					}

					//If there are not enough points left to finish the rectangle go step back
					if (geom.length - _numPoints - pointCount < 4 - i) {
						corner -= 4 - i;
						if (corner < 0) {
							corner += geom.length;
						}
					}
				}

				corners.push(corner);
			};

			for (var i = 0; i < 4; i++) {
				_loop(i);
			}

			//NOTE: to myself Outer rings are counter clockwise

			//Finding the closest point to each corner

			var ngeom = {};

			for (var i = 0; i < 4; i++) {
				var p1 = void 0,
						p2 = void 0,
						ox = void 0,
						oy = void 0;
				switch (i) {
					case 0:
						ox = 0;oy = 0;
						p1 = [b[0], b[3]];
						p2 = [b[2], b[3]];
						break;
					case 1:
						ox = 1;oy = 0;
						p1 = [b[2], b[3]];
						p2 = [b[2], b[1]];
						break;
					case 2:
						ox = 1;oy = 1;
						p1 = [b[2], b[1]];
						p2 = [b[0], b[1]];
						break;
					case 3:
						ox = 0;oy = 1;
						p1 = [b[0], b[1]];
						p2 = [b[0], b[3]];
						break;
				}

				var x = p2[0] - p1[0],
						y = p2[1] - p1[1];

				if (x != 0) {
					x = x / Math.abs(x);
				}
				if (y != 0) {
					y = y / Math.abs(y);
				}

				y *= -1;

				var c1 = corners[i],
						c2 = i === corners.length - 1 ? corners[0] : corners[i + 1],
						numPoints = void 0;

				if (c1 < c2) {
					numPoints = c2 - c1;
				} else {
					numPoints = c2 + (geom.length - c1);
				}

				for (var j = 0; j < numPoints; j++) {
					var tp = c1 + j;
					if (tp > geom.length - 1) {
						tp -= geom.length;
					}
					ngeom[tp] = {
						c: d.geometry.centroid,
						x: ox + x / numPoints * j,
						y: oy + y / numPoints * j
					};
				}
			}

			d.geometry['qcoordinates'] = [];

			//Okey, i have no clue why the first point is broken (i=0 > i=1)
			for (var _i = 1; _i < geom.length; _i++) {
				if (_i === geom.length - 1) {
					d.geometry.qcoordinates.push(ngeom[0]);
				} else {
					d.geometry.qcoordinates.push(ngeom[_i]);
				}
			}
		});

		//polys: d.geometry object (GeoJSON)
		function largestPoly(geom) {
			var size = -Number.MAX_VALUE,
					poly = null;

			//We will select the largest polygon from the multipolygon (this has worked out so far, for your project you might need to reconsider or just provide (single) polygons in the first place)
			for (var c = 0; c < geom.coordinates.length; c++) {
				//we are using turf.js area function
				//if you don't want to include the full turf library, turf is build in modular fashion, npm install turf-area
				var tsize = turf.area({
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'Polygon',
						coordinates: geom.type === 'MultiPolygon' ? [geom.coordinates[c][0]] : [geom.coordinates[c]]
					}
				});

				if (tsize > size) {
					size = tsize;
					poly = c;
				}
			}

			return [geom.type === 'MultiPolygon' ? geom.coordinates[poly][0] : geom.coordinates[poly]];
		}

		return data;
	};

	var asyncGenerator = function () {
		function AwaitValue(value) {
			this.value = value;
		}

		function AsyncGenerator(gen) {
			var front, back;

			function send(key, arg) {
				return new Promise(function (resolve, reject) {
					var request = {
						key: key,
						arg: arg,
						resolve: resolve,
						reject: reject,
						next: null
					};

					if (back) {
						back = back.next = request;
					} else {
						front = back = request;
						resume(key, arg);
					}
				});
			}

			function resume(key, arg) {
				try {
					var result = gen[key](arg);
					var value = result.value;

					if (value instanceof AwaitValue) {
						Promise.resolve(value.value).then(function (arg) {
							resume("next", arg);
						}, function (arg) {
							resume("throw", arg);
						});
					} else {
						settle(result.done ? "return" : "normal", result.value);
					}
				} catch (err) {
					settle("throw", err);
				}
			}

			function settle(type, value) {
				switch (type) {
					case "return":
						front.resolve({
							value: value,
							done: true
						});
						break;

					case "throw":
						front.reject(value);
						break;

					default:
						front.resolve({
							value: value,
							done: false
						});
						break;
				}

				front = front.next;

				if (front) {
					resume(front.key, front.arg);
				} else {
					back = null;
				}
			}

			this._invoke = send;

			if (typeof gen.return !== "function") {
				this.return = undefined;
			}
		}

		if (typeof Symbol === "function" && Symbol.asyncIterator) {
			AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
				return this;
			};
		}

		AsyncGenerator.prototype.next = function (arg) {
			return this._invoke("next", arg);
		};

		AsyncGenerator.prototype.throw = function (arg) {
			return this._invoke("throw", arg);
		};

		AsyncGenerator.prototype.return = function (arg) {
			return this._invoke("return", arg);
		};

		return {
			wrap: function (fn) {
				return function () {
					return new AsyncGenerator(fn.apply(this, arguments));
				};
			},
			await: function (value) {
				return new AwaitValue(value);
			}
		};
	}();

	var classCallCheck = function (instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	};

	var createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	var draw = function () {
		function draw() {
			classCallCheck(this, draw);

			this._data = null;
			this._svg = null;
			this._col_size = 1;
			this._row_size = 1;
			this._cols = 1;
			this._rows = 1;
			this._init = false;
			this._mode = 'geo';
			this._rPath = d3.line();
			this._path = d3.geoPath();
			this._config = {
				width: null,
				height: null,
				padding: 20,
				key: null,
				projection: d3.geoMercator(),
				grid: null,
				duration: 500
			};
		}

		createClass(draw, [{
			key: "update",
			value: function update() {
				var _this2 = this;

				if (this._data !== null && this._config.width !== null && this._config.height !== null) {
					(function () {
						var init_zoom = 200;

						_this2._config.projection
							//ML: Overrule autocenter
							//.center(d3.geoCentroid(_this2._data))
							.center([20,50])
							.scale(init_zoom)
							.translate([_this2._config.width / 2, _this2._config.height / 2]);
							//console.log(d3.geoCentroid(_this2._data));

						_this2._path.projection(_this2._config.projection);

						//Calculate optimal zoom

						var bounds = _this2._path.bounds(_this2._data),
								dx = bounds[1][0] - bounds[0][0],
								dy = bounds[1][1] - bounds[0][1],
								scale = Math.max(1, 0.9 / Math.max(dx / (_this2._config.width - 2 * _this2._config.padding), dy / (_this2._config.height - 2 * _this2._config.padding)));

						//ML: overrule autocalculated scale (Russia is too big)
						//_this2._config.projection.scale(scale * init_zoom);
						_this2._config.projection.scale(600);
						//console.log(scale*init_zoom);

						_this2._data.features.forEach(function (f) {
							f.geometry.qcoordinates.forEach(function (d) {
								var pc = _this2._config.projection(d.c);
								d["pc"] = pc;
							});
						});

						var _this = _this2;

						_this2._rPath.x(function (d) {
							return (d.x - 0.5) * _this._col_size + d.pc[0];
						}).y(function (d) {
							return (d.y - 0.5) * _this._row_size + d.pc[1];
						});
					})();
				}

				this._init = true;
			}
		}, {
			key: "draw",
			value: function draw() {
				var _this3 = this;

				if (this._init) {
					(function () {
						
						//var clicked = false;
						
						var _this = _this3;
						var myPath = _this3._svg.selectAll("path").data(_this3._data.features);
						var tPath = _this3._svg.selectAll("path").data(_this3._data.features);
						tPath.exit();
						tPath.enter().append("path").attr("id",function(d){return _this.config.key(d);}).attr('class', function (d) {
							//return 'country';
							return 'id-' + _this.config.key(d);
						});
			
						var tooltip = d3.select('body').append('div')
									.attr('class', 'hidden tooltip');
			
						_this3._svg.selectAll("path").on("mousemove", function(){
								//console.log("... my old friend ...");
								var mouse = d3.mouse(d3.select('svg').node()).map(function(d) {
									return parseInt(d);
								});
								tooltip.classed('hidden', false)
									.attr('style', 'left:' + (mouse[0]) +
										  'px; top:' + (mouse[1]) + 'px')
									.html(getName(this.id));
							}).on("mouseout",function(){
									tooltip.classed("hidden",true);
								}).transition().duration(_this3._config.duration).attr('transform', function (d) {
							var tx = 0,
									ty = 0;
							if (_this.mode != 'geo') {
								var g = _this.config.grid[_this.config.key(d)];
								var pc = _this.config.projection(d.geometry.centroid);
								tx = g.ox - pc[0];
								ty = g.oy - pc[1];
							}
							return 'translate(' + tx + ',' + ty + ')';
						}).attr('d', function (d, i) {
							if (_this._mode === 'geo') {
								return _this._path(d);
							} else {
								return _this._rPath(d.geometry.qcoordinates) + "Z";
							}
						}).attr('id', function(d){return d.properties.ISO_A3;})//Ajout Adelme.
						.attr("fill","#f0f0f0")
						.on("end",function(d){
								var rectClass = document.getElementsByClassName(d.properties.ISO_A3 + "_smallrect");
								var square = document.getElementById(d.properties.ISO_A3);
								var posview = document.getElementById("view").getBoundingClientRect();
								var pos = square.getBoundingClientRect();
								if(_this3._mode === "rect"){
									var cou = 0;
									var tGrid = _this3.config.grid
									for(var key in tGrid){
										
										rectClass[cou].style.visibility = "visible";
										rectClass[cou].setAttribute("x", (pos.x - posview.x) + ((pos.width / 8) * tGrid[key].x));
										rectClass[cou].setAttribute("y", (pos.y - posview.y) + ((pos.height / 8) * tGrid[key].y));
										rectClass[cou].setAttribute("width", pos.width / 8);
										rectClass[cou].setAttribute("height", pos.height / 8);
										rectClass[cou].setAttribute("id", d.properties.ISO_A3 + "-" + key);
										
										if( d.properties.ISO_A3 == key){
											rectClass[cou].style.fill = "#333333";
										}
										if(!CheckTrans(trans_data, key)){
											rectClass[cou].style.fill = "#bdbdbd";
										}
										cou++;
									}
									
								}
							})
						.on("start", function(d){
							let rectClass = document.getElementsByClassName(d.properties.ISO_A3 + "_smallrect");
								if(_this3._mode === 'geo'){
									for(var curr = 0; curr < rectClass.length;curr++){
										rectClass[curr].style.visibility = "hidden";
									}
								}
							});
					
							var mygrid = _this3.config.grid;
							for(var key in mygrid){
								
								myPath.enter()
									.append("rect")
									.attr("class",key + "_smallrect")
									.attr("x", 0)
									.attr("y", 0)
									.attr("width",100)
									.attr("height",100)
									.attr("fill","#bdbdbd")
									.style("opacity","0.5")
									.style("visibility","visible")
									.on("mousemove", function(){
										//console.log("... my old friend ...");
										//console.log(this.id.split('-'));
										var mouse = d3.mouse(d3.select('svg').node()).map(function(d) {
											return parseInt(d);
										});
										tooltip.classed('hidden', false)
											.attr('style', 'left:' + (mouse[0]) +
												  'px; top:' + (mouse[1]) + 'px')
											.html(getName(this.id.split('-')[0]));
									})
									.on("mouseout",function(){
										tooltip.classed("hidden",true);
									});
							}
					})();
				} else {
					console.error('You must run update() first.');
				}
			}
		}, {
			key: "toggle",
			value: function toggle() {
				if (this._mode == 'geo') {
					this._mode = 'rect';
				} else {
					this._mode = 'geo';
				}
			}
		}, {
			key: "data",
			get: function get() {
				return this._data;
			},
			set: function set(d) {
				if (d) {
					this._data = d;
					this.update();
				}
			}
		}, {
			key: "mode",
			get: function get() {
				return this._mode;
			},
			set: function set(m) {
				if (m) {
					this._mode = m;
				}
			}
		}, {
			key: "svg",
			get: function get() {
				return this._svg;
			},
			set: function set(s) {
				if (s) {
					this._svg = s;
					this.update();
				}
			}
		}, {
			key: "config",
			get: function get() {
				return this._config;
			},
			set: function set(c) {
				if (c) {
					for (var key in this._config) {
						if (this._config[key] === null && !(key in c)) {
							console.error('The config object must provide ' + key);
						} else if (key in c) {
							this._config[key] = c[key];
						}
					}

					var _g = this._config.grid;
					for (var _key in _g) {
						if (_g[_key].x + 1 > this._cols) {
							this._cols = _g[_key].x + 1;
						}
						if (_g[_key].y + 1 > this._rows) {
							this._rows = _g[_key].y + 1;
						}
					}

					this._col_size = (this._config.width - this._config.padding * 2) / this._rows;
					this._row_size = (this._config.height - this._config.padding * 2) / this._cols;

					if (this._col_size < this._row_size) {
						this._row_size = this._col_size;
					} else {
						this._col_size = this._row_size;
					}

					for (var _g in this._config.grid) {
						this._config.grid[_g]['ox'] = this._config.width / 2 - this._cols / 2 * this._col_size + this._config.grid[_g].x * this._col_size + this._col_size / 2;
						this._config.grid[_g]['oy'] = this._config.height / 2 - this._rows / 2 * this._row_size + this._config.grid[_g].y * this._row_size + this._row_size / 2;
					}

					this.update();
				}
			}
		}]);
		return draw;
	}();

	exports.compute = compute;
	exports.draw = draw;

	Object.defineProperty(exports, '__esModule', { value: true });
	
	function getName( iso3){
		//console.log("... here I come...");
		//console.log(iso3);
		for(let c in trans_data){
			if(trans_data[c].ISO3 === iso3){
				return trans_data[c].name;
			}
		}
		return "No Data";
	}
	
	function CheckTrans(trans_data, iso3){
		for(let c in trans_data){
			if(trans_data[c].ISO3 === iso3){
				return true;
			}
		}
		return false // if we reach this point, iso3 isn't in trans_data.
	};
	
}));
