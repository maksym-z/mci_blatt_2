var unit = function(classname, commander) {
	this.classname = classname;
	this.commander = commander;
	this.selected = false;
	if (commander!=null) {
	  this.subordinationLevel = commander.subordinationLevel+1;
	} else {
	   this.subordinationLevel = 0;
	}
}

var SELECT_DESELECT = 0;
var SELECT_SELECT = 1;
var SELECT_DO_NOTHING = 2;

var unitContainer = function(currentSectorIndex) {
	this.subUnitContainers = [];
	this.units = [];
	this.vehicles = [];
	this.sectorIndex = currentSectorIndex;
	
	
	/**
		returns a list of units
	*/
	this.traversePreOrder = function(select, subordinationLevel) {
		list = [];
		for (var i=0; i < this.units.length; i++) {
			currentUnit = this.units[i];
			currentUnit.subordinationLevel=subordinationLevel;
			if (select == SELECT_SELECT) {
			    currentUnit.selected = true;
			} else if (select == SELECT_DESELECT) {
			    currentUnit.selected = false;
			}
			list.push(currentUnit);
		};
		for (var i=0; i< this.subUnitContainers.length; i++) {
		    list.push(this.subUnitContainers[i].traversePreOrder(select, subordinationLevel+1));
		}
		return list;
	};
}

