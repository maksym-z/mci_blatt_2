var dataModel = function(myController) {

	this.controller = myController;
	
	var sector = function(index) {
		this.index = index;
		this.owner = 0;
		this.unitContainer = new unitContainer();
	}
	
	var vehicle = function(classname, x, y) {
		this.classname = classname;
		this.x = x;
		this.y = y;
	}
	
	this.addSector = function(freeIndex) {
		var newSector = new sector(freeIndex);
		newSector.owner = sector_owners[freeIndex];
		this.sectors.push(newSector);
	}
	
	this.addUnitContainer = function(sector) {
		this.unitContainers.push(new unitContainer(sector));
	}
	
	this.sectors = [];
	this.unitContainers = [];
}
