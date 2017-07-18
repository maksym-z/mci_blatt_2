var controller = function() {
	this.model = new dataModel(this);
	this.view = new mapView(this);
	this.selectedSectorIndex = 0;
	this.createSector = function(owner) {
		var freeIndex = this.model.sectors.length;
		this.model.addSector(freeIndex);
		this.view.addPolygon(freeIndex);
		return freeIndex;
	}
	
	this.selectSector = function(index) {
		$("#sector_info").text(JSON.stringify(this.model.sectors[index]));
		this.selectedSectorIndex = 0;
	};

	for (var i = 0; i < voronoi_points.length; i++) {
		this.createSector(i);
	};
	
	this.createUnitContainer = function() {
		this.model.addUnitContainer(this.selectedSectorIndex);
	};
}
