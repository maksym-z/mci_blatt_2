var currentStimulus = -1;
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var target_list = new Array(100);
var current_trial = -1;
var current_x = 0;
var current_y = 0;
var current_distance_squared = 0;
target_list.fill(5,0,20);
target_list.fill(10,20,40);
target_list.fill(20,40,60);
target_list.fill(30,60,80);
target_list.fill(50,80,100);

function shuffle(a) {
	var j, x, i;
	for (i = a.length; i; i--) {
	j = Math.floor(Math.random() * i);
	x = a[i - 1];
	a[i - 1] = a[j];
	a[j] = x;
	}
}

shuffle(target_list);

function showSimpleStimulus() {
	  current_trial++;
	  var radius = target_list[current_trial];
	  
	  var safeWidth = canvas.width - radius*2;
	  var safeHeight = canvas.height - radius*2;
	  var centerX;
	  var centerY;
	  do {
	centerX = Math.random() * safeWidth  + radius;
	centerY = Math.random() * safeHeight  + radius;
	current_distance_squared = Math.pow(centerX - current_x,2) + Math.pow(centerY - current_y,2);
	  } while (current_distance_squared < 30*30);
	  current_x = centerX;
	  current_y = centerY;
	  
	  currentStimulus = target_list[current_trial];
	  context.beginPath();
	  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	  context.fillStyle = 'green';
	  context.fill();
	  context.lineWidth = 0;
	  context.strokeStyle = '#009900';
	  context.stroke();
	  context.closePath();
	  currentExperiment.currentStimulus = 0;
	  testActive = true;
	  return true;
}

function clearSimpleStimulus() {
	context.fillStyle = "rgba(200, 200, 200, 1)";
	context.fillRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener('click',function(evt){
  var rect = canvas.getBoundingClientRect();
  var clickx = evt.clientX - rect.left;
  var clicky = evt.clientY - rect.top;
  if (Math.pow(clickx - current_x,2) + Math.pow(clicky - current_y,2) < target_list[current_trial]*target_list[current_trial])  {
	currentExperiment.index_of_difficulty = Math.log2(2*Math.sqrt(current_distance_squared)/target_list[current_trial]);
	currentExperiment.target_size = target_list[current_trial];
	currentExperiment.stopTest();
  };
},false);

function onKey(e) { 
	if (e == null) {
		e = window.event;
	}
	switch (e.which || e.charCode || e.keyCode) {
		case 32:
		// space
		if (!currentExperiment.experimentActive) {
			currentExperiment.startExperiment(); 
		} else {
		}
		break;
		case 27: // esc
		if (currentExperiment.experimentActive) {
			currentExperiment.stopExperiment();
		}
		break;
	}
}