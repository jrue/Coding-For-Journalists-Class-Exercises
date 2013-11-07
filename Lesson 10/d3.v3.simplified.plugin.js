/**
 * D3 Simplified Plugin
 *
 * This is a small plugin I wrote for my students to create some of the more 
 * basic charts in D3 without having to understand the complexities of D3. 
 *
 * By Jeremy Rue based on examples on D3js.org, most written by https://github.com/mbostock
 */

//needed for bubble charts
d3.format(",d");

var D3Simplified = {};

D3Simplified.DonutChart = function(){

	/**
	 * Create a donut chart (pie chart with the center missing)
	 *
	 * @param {data} array of objects with name/value keys for this chart
	 * @param {elm} string of the element's css selector where this chart will go
	 * @param {text} array of TWO strings for description inside donut. Each item is a new line of text.
	 * @param {size} object with with and height keys
	 * @param {label} string || undefined show labels on arcs
	 * @param {colorRange} array || undefined of hex colors for use in the chart slices
	 */
	this.createChart = function(data, elm, size, text, label, colorRange){

		this.width      = size.width  || 400;
		this.height     = size.height || 400;
		this.radius     = Math.min(this.width, this.height) / 2;
		this.domain     = [];
		this.colorRange = colorRange || ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];
		
		for(var i=0; i < this.colorRange.length; ++i){
			this.domain.push(i);
		}

		var color = d3.scale.ordinal()
			.domain(this.domain)
			.range(this.colorRange);

		var arc = d3.svg.arc()
			.innerRadius(this.radius - 10)
			.outerRadius(this.radius - 25);

		this.pie = d3.layout.pie()
			.sort(null)
			.value(function(d){return d.value;});

		this.svg = d3.select(elm)
			.append("svg")
			.attr("width", '100%')
			.attr("height", '100%')
			.attr("preserveAspectRatio", "xMidYMin")
			.attr("viewBox",'0,0,'+ size.width + ','+ size.height)
			.append("g")
			.attr("transform", "translate(" + this.width/2 + "," + this.height/2 + ")");

		this.path = this.svg.selectAll('path')
			.data(this.pie(data))
			.enter()
			.append("path")
			.attr("class", function(d, i) { return "color" + i })
			.style("fill", function(d){ return color(d.data.name);})
			.attr("d", arc)
			.each(function(d) { this._current = d; });
		
		if(typeof text === 'boolean'){
			var legend = this.svg.selectAll("svg").data(data)
				.enter()
				.append("g")
				.attr("transform", function(d, i) { return "translate(-20," + i * 12 + ")"; });
				
			legend.append("rect")
				.attr("x", 0)
				.attr("y", -10)
				.attr("width", 10)
				.attr("height", 10)
				.style("fill", function(d){ return color(d.name);});
			
			//legend.data(data).enter()
			legend.append("text")
				.attr("transform", function(d, i) { return "translate(0," + i + ")"; })
				.attr("x", 15)
				.attr("y", -5)
				.style("font-size", "10px")
				.attr("dy", ".35em")
				.text(function(d) { return d.name; });
		}
		
		if(typeof label === 'string'){
			this.svg.append("foreignObject")
				.attr("x", -(this.width/2))
				.attr("y", this.height/2 - 25)
				.attr("width", this.width)
				.attr("height", "20")
				.style("text-anchor", "middle")
				.style("font-size", "10px")
				.append("xhtml:p")
				.attr("xmlns", "http://www.w3.org/1999/xhtml")
				.text(label);
		}
			
		if(typeof text === 'object'){

			if(text.length < 2) 
				text.push('');

			this.svg.append("text")
				.attr("x", 0)
				.attr("y", -3)
				.style("text-anchor", "middle")
				.style("font-size", "11px")
				.attr("width", this.width/4 + "px")
				.text(text[0])
				.append("tspan")
				.attr("y", 12)
				.attr("x", 0)
				.text(text[1]);
		};
		
		/**
		 * Run this method to change data of chart. Save the instance in a variable first.
		 *
		 * @param {nD} array of objects containing new data in name/value keys
		 */
		this.changeData = function(nD){
			var path = this.path.data(this.pie(nD))
				.attr("d", arc)
				.transition().duration(750).attrTween("d", arcTween);
		}

		//private function
		function arcTween(a) {
			var i = d3.interpolate(this._current, a);
			this._current = i(0);
			return function(t) {
				return arc(i(t));
			};
		}

		return this;
	}

	return this;
};

D3Simplified.Legend = function(){
	
	function classes(root) {
		var classes = [];

		function recurse(name, node) {
			if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
			else classes.push(node.name);
		}

		recurse(null, root);
		return classes;
	}

	/**
	 * Draw legend graph
	 *
	 * @param {data} array of objects with name/value pair. We will only use names
	 * @param {elm} string of the element where the legend will appear
	 * @param {size} object the size of this graph, use width/height keys
	 * @param {colorRange} array || undefined of colors for legend
	 * @param {textSize} string || undefined size of text in pixels
	 */
	this.drawLegend = function(data, elm, size, colorRange, textSize){
		var width   = size.width || 300,
			height  = size.height || 300,
			radius  = Math.min(width, height) / 2,
			domain  = [],
			pallet  = colorRange || ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"],
			txtSize = textSize   || '10px';
		
		for(var i=0; i<pallet.length; ++i){
			domain.push(i);
		}
	
		var color = d3.scale.ordinal()
			.domain(domain).range(pallet);

		var legend = d3.select(elm)
			.append("svg")
			.attr("class", "legend")
			.attr("width", '100%')
			.attr("height", '100%')
			.attr("preserveAspectRatio", "xMidYMin")
			.attr("viewBox",'0,0,'+ size.width + ','+ size.height)
			.selectAll("g")
			.data(data)
			.enter().append("g")
			.attr("transform", function(d, i) { return "translate(20," + i * 12 + ")"; });

		legend.append("rect")
			.attr("width", 10)
			.attr("height", 10)
			.style("fill", function(d) { return color(d.name);});

		legend.append("text")
			.attr("x", 15)
			.attr("y", 5)
			.attr("font-size", txtSize)
			.attr("dy", ".35em")
			.text(function(d) { return d.name; });
	}

	return this;
};

D3Simplified.BubbleChart = function(){

	var diameter;

	/**
	 * Create a bubble chart
	 * 
	 * @param {datas} array of objects with name/value keys
	 * @param {elm} string the element which to put this chart
	 * @param {size} object with width/height keys 
	 * @param {pallet} array | undefined of hex codes for the bubble colors
	 */
	this.createChart = function(data, elm, size, pallet) {
		
		pallet = pallet || ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];
		size = size || {width:400, height:400};
		var domain = [],
			sorted = [];
		
		data = data.sort(function(a, b){ return b.value - a.value});
		
		
		for(var i=0; i<data.length; ++i){
			domain.push(data[i].value);
		}
		
		var diameter = Math.min(size.width, size.height),
		 	color  = d3.scale.ordinal().domain(domain).range(pallet);

		var bubble = d3.layout.pack()
			.sort(null)
			.size([size.width, size.height])
			.padding(1.5);

		var svg = d3.select(elm).append("svg")
			.attr("width", '100%')
			.attr("height", '100%')
			.attr("preserveAspectRatio", "xMidYMin")
			.attr("viewBox",'0,0,'+ size.width + ','+ size.height)
			.attr("class", "bubble");

		nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

		var circles = svg.selectAll("circle")
			.data(nodes, function(d){return d.name;})
			.enter().append("circle")
			.attr("r", 0)
			.style("fill", function(d) { return color(d.value); })
			.attr("cx", function(d){ return d.x;})
			.attr("cy", function(d){ return d.y;})
			.attr("class", "node");

		circles.transition()
			.duration(1000)
			.attr("r", function(d) { return d.r; })
			.each('end', function(){ display_text();});
		
		function display_text() {
			var text = svg
				.selectAll(".text")
				.data(nodes, function(d){return d.name;});

			text.enter().append("text")
				.attr("class", "text")
				.style("font-size", "10px")
				.attr("x", function(d) { return d.x; })
				.attr("y", function(d) { return d.y; })
				.attr("dy", ".3em")
				.attr("text-anchor", "middle")
				.text(function(d) { return d.name.substring(0, d.r / 3); });
		}

		function hide_text() {
			var text = svg.selectAll(".text").remove();
		}
		
		this.changeData = function(newData){
			hide_text();
			nodes = bubble.nodes({children:newData}).filter(function(d) { return !d.children; });
			circles = circles.data(nodes);
			circles.transition().duration(1000)
			.attr("r", function(d){ return d.r;})
			.attr("cx", function(d){ return d.x;})
			.attr("cy", function(d){ return d.y;})
			.each('end', function(){ display_text();});
		}
	}

	d3.select(self.frameElement).style("height", diameter + "px");

	return this;
};