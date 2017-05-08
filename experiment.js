var testActive = false;
var stimulusType = 0;
/**
This function incapsulates (more or less) the functionality required for all experiments, and allows expanding it to more than 2 stimuli.
*/
function experiment(id, preInstructionText, instructionText, showStimulusFunction, clearStimulusFunction, processKeyFunction, maxTrials, stimulusNames) {
	this.id = id;
	this.experimentActive = false;
	this.responses = [];
	this.maxTrials = maxTrials;
	this.errorsOnCurrentTrial = 0;
	this.errors = 0;
	this.lastTimeStimulusPresented = new Date().getTime();
	this.clearStimulusFunction = clearStimulusFunction;
	this.showStimulusFunction = showStimulusFunction;
	this.stimulusCount = stimulusNames.length;
	this.stimulusNames = stimulusNames;

	document.getElementById("instruction").innerHTML = preInstructionText;

	document.onkeydown = processKeyFunction;

	this.startExperiment = function() {
		currentExperiment = this;
		this.experimentActive = true;
		document.getElementById("time").innerHTML = "";
		document.getElementById("count").innerHTML = "";
		document.getElementById("mean").innerHTML = "";
		document.getElementById("sd").innerHTML = "";
		document.getElementById("instruction").innerHTML = instructionText;
		this.startTest();
	}
	
	this.response = function(stimulusID, responseTime, currentErrors) {
		this.stimulusID = stimulusID;
		this.responseTime = responseTime;
		this.currentErrors = currentErrors;
	}
	
	this.reportError = function() {
		currentExperiment.errorsOnCurrentTrial = currentExperiment.errorsOnCurrentTrial + 1;
	}

	this.stopExperiment = function () {
		window.setTimeout(this.showStimulusFunction, 0);
		testActive = false;
		var meanDeltaTime = [];
		var standardDeviation = [];
		var errorRate = [];
		var means = "";
		var deviations = "";
		
		for (var stimulusIndex = 0; stimulusIndex < currentExperiment.stimulusCount; ++stimulusIndex) {
			meanDeltaTime.push(0);
			standardDeviation.push(0);
			errorRate.push(0);
		}
		
		for (var stimulusIndex = 0; stimulusIndex < currentExperiment.stimulusCount; ++stimulusIndex) {
			for (var i = 0; i < this.responses.length; ++i) {
				if (this.responses[i].stimulusID == stimulusIndex) {
					meanDeltaTime[stimulusIndex] += this.responses[i].responseTime; 
					errorRate[stimulusIndex] += this.responses[i].currentErrors; 
				}
			}
			meanDeltaTime[stimulusIndex] = Math.round(meanDeltaTime[stimulusIndex] / this.responses.length);
			errorRate[stimulusIndex] = (errorRate[stimulusIndex] / this.responses.length);
			means = means + "Stimulus " + stimulusIndex + ", mean: " + meanDeltaTime[stimulusIndex] + " ms<br />";
			for (var i = 0; i < this.responses.length; ++i) {
				if (this.responses[i].stimulusID == stimulusIndex) {
					var diff = (this.responses[i].responseTime - meanDeltaTime[stimulusIndex]);
					standardDeviation[stimulusIndex] += diff * diff; 
				}
			}
			standardDeviation[stimulusIndex] = Math.round(Math.sqrt(standardDeviation[stimulusIndex] / this.responses.length));
			deviations = deviations + "Stimulus " + stimulusIndex + ", SD: " + standardDeviation[stimulusIndex] + " ms<br />";
			
			document.getElementById("count").innerHTML = "Count: " + this.responses.length;
			document.getElementById("mean").innerHTML = means;
			document.getElementById("sd").innerHTML = deviations;
			document.getElementById("instruction").innerHTML = "Thank you! You will be redirected to the results page shortly.";
		}
		this.experimentActive = false;
		var dataToPost = {
			'experimentID': this.id,
			'count': this.responses.length,
			'stimulusCount': this.stimulusCount
		}
		
		for (var stimulusIndex = 0; stimulusIndex < currentExperiment.stimulusCount; ++stimulusIndex) {
			dataToPost["mean"+stimulusIndex] = meanDeltaTime[stimulusIndex];
			dataToPost["sd"+stimulusIndex] = standardDeviation[stimulusIndex];
			dataToPost["errors"+stimulusIndex] = errorRate[stimulusIndex];
			dataToPost["stimulus"+stimulusIndex] = currentExperiment.stimulusNames[stimulusIndex];
		}
		alert(JSON.stringify(dataToPost));
		this.postData('/get_data', dataToPost);
		times = [];
	}
	
	this.receiveResponse = function(responseTime) {
		if (typeof currentExperiment.currentStimulus == 'undefined') {
			alert("Error: stimulus ID not defined. Please define currentExperiment.currentStimulus");
		};
		this.responses.push(new this.response(currentExperiment.currentStimulus, responseTime, currentExperiment.errorsOnCurrentTrial));
		document.getElementById("time").innerHTML = responseTime + " ms, errors: " + currentExperiment.errorsOnCurrentTrial;
		this.errorsOnCurrentTrial = 0;
		document.getElementById("count").innerHTML = "Trials complete: " + currentExperiment.responses.length + " of " + currentExperiment.maxTrials;
	}
	
	this.postData = function (path, params) {
		var form = document.createElement("form"); // create invisible form
		form.setAttribute("method", "post");
		form.setAttribute("action", path);

		for(var key in params) {
			if(params.hasOwnProperty(key)) {
				var hiddenField = document.createElement("input");
				hiddenField.setAttribute("type", "hidden");
				hiddenField.setAttribute("name", key);
				hiddenField.setAttribute("value", params[key]);
				form.appendChild(hiddenField);
			 }
		}

		document.body.appendChild(form);
		form.submit();
	}

	this.startTest = function() {
		currentExperiment.clearStimulusFunction();
		timeInSeconds = Math.random() * 4 + 2; // 2 - 6s
		window.setTimeout(this.showStimulus, timeInSeconds * 1000);
	}

	this.stopTest = function() {
		var currTime = new Date().getTime();
		var deltaTime = currTime - currentExperiment.lastTimeStimulusPresented;
		currentExperiment.receiveResponse(deltaTime);
		
		
		if (currentExperiment.responses.length>=currentExperiment.maxTrials) {
			this.stopExperiment();
		} else {
			testActive = false;
			currentExperiment.startTest();
		};
	}

	this.showStimulus = function() {
		currentExperiment.lastTimeStimulusPresented = new Date().getTime();
		currentExperiment.showStimulusFunction();
	};
}
