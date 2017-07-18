var unit = function(classname, commander) {
	this.classname = classname;
	this.commander = commander;
	this.selected = false;
	this.subordinationLevel = 0;
}

var unitContainer = function(currentSectorIndex) {
	this.subUnitContainers = [];
	this.units = [];
	this.vehicles = [];
	this.sectorIndex = currentSectorIndex;
	
	
	/**
		returns a list of units
	*/
	this.traversePreOrder = function(list, select, subordinationLevel) {
		for (var i=0; i < this.units.length; i++) {
			currentUnit = this.units[i];
			list.push(currentUnit);
		};
	};
}

