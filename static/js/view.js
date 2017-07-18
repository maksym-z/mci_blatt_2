var mapView = function(myController) {
	this.controller = myController;
	var myModel = myController.model;
	
	var SCALE = 0.05;
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");

	var ownerColors = ["green","blue"];
	var ownerColorsHighlighted = ["lightgreen","lightblue"];
	
	var polygon = function(index) {
		this.index = index;
		$("#debug").text(voronoi_points[index]);
		this.x = voronoi_points[index][0]*SCALE;
		this.y = voronoi_points[index][1]*SCALE;
		this.ridges = [];
		$("#debug").text(myModel.sectors);
		this.owner = myModel.sectors[index].owner;
		
		for (var i = 0; i < voronoi_ridge_points.length; i++) {
			$("p").text([voronoi_ridge_vertices[i][0]]);
			if ([voronoi_ridge_vertices[i][0]]!=-1 && [voronoi_ridge_vertices[i][1]]!=-1) {
				var x1 = voronoi_vertices[voronoi_ridge_vertices[i][0]][0];
				var y1 = voronoi_vertices[voronoi_ridge_vertices[i][0]][1];
				var x2 = voronoi_vertices[voronoi_ridge_vertices[i][1]][0];
				var y2 = voronoi_vertices[voronoi_ridge_vertices[i][1]][1];
				if (voronoi_ridge_points[i][0] == this.index) {
					this.ridges.push(new ridge(i,voronoi_ridge_points[i][1],x1,y1,x2,y2));
				} else if (voronoi_ridge_points[i][1] == this.index) {
					this.ridges.push(new ridge(i,voronoi_ridge_points[i][0],x1,y1,x2,y2));
				};
			};
		};
		
		this.highlight = function (highlight) {
			ctx.beginPath();
			var len = this.ridges.length;
			for (var i = 0; i < len; i++) {
				ctx.moveTo(this.ridges[i].x1*SCALE, this.ridges[i].y1*SCALE);
				ctx.lineTo(this.ridges[i].x2*SCALE, this.ridges[i].y2*SCALE);
			};
			if (highlight) {
				ctx.strokeStyle = ownerColorsHighlighted[this.owner];
			} else {	
				ctx.strokeStyle = ownerColors[this.owner];
			};
			ctx.closePath();
			ctx.stroke();
			highlightedPolygon = this;
		};
	};
	
	ridge = function(ridge_index, neighbor, x1, y1, x2, y2) {
		this.ridge_index = ridge_index;
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		this.neighbor = neighbor;
	};

	ctx.beginPath();

	for (var i=0; i <  voronoi_ridge_vertices.length;i++) {
		pnt1 = voronoi_ridge_vertices[i][0];
		pnt2 = voronoi_ridge_vertices[i][1];
		if (pnt1 != -1 && pnt2 != -1) {
			ctx.moveTo(voronoi_vertices[pnt1][0]*SCALE, voronoi_vertices[pnt1][1]*SCALE);
			ctx.lineTo(voronoi_vertices[pnt2][0]*SCALE, voronoi_vertices[pnt2][1]*SCALE);
		};
	};

	this.findPolygon = function (x,y){
		var dmin = 10000000;
		var return_polygon_index;
		for (var i = 0; i < voronoi_points.length; i++) {
			var newdist = Math.pow(voronoi_points[i][0]*SCALE-x, 2) + Math.pow((voronoi_points[i][1]*SCALE-y),2);
			if (newdist < dmin && newdist > 0) {
				return_polygon_index = i;
				dmin = newdist;
			};
		};
		//$("#debug").text(dmin);
		//ctx.strokeStyle = "black";
		//ctx.moveTo(x,y);
		//ctx.lineTo(voronoi_points[return_polygon_index][0]*SCALE,voronoi_points[return_polygon_index][1]*SCALE);
		//ctx.stroke();
		return this.polygons[return_polygon_index];
	};
	
	this.onMouseMove = function(pageX, pageY) {
		var x = pageX - c.offsetLeft;
		var	y = pageY - c.offsetTop;
		//ctx.lineTo(x, y);
		//ctx.stroke();
		if (this.highlightedPolygon) {
			this.highlightedPolygon.highlight(false);
		};
		var targetedPolygon = this.findPolygon(x, y);
		
		if (targetedPolygon)  {
			targetedPolygon.highlight(true);
			this.highlightedPolygon = targetedPolygon;
		};
	};

	this.polygons = [];
	this.addPolygon = function(index) {
		newPolygon = new polygon(index);
		this.polygons.push(newPolygon);
	};
	this.highlightedPolygon = this.polygons[0];
	
	this.onMouseClick = function() {
		$("#debug").text(this.highlightedPolygon.index);
		if (this.highlightedPolygon) {
			myController.selectSector(this.highlightedPolygon.index);
		};
	};
	
	this.listUnits = function(uc, windowID) {
		result = "<form>";
		result += "</form>";
		$(windowID).html(result);
	};
};
