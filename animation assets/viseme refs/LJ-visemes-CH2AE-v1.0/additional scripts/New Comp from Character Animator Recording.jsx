(function NewCompFromCharacterAnimatorRecording()
{
	/* global $, alert, app, File, Folder, ImportOptions, PREFType, prompt */
	var scriptName = "New Comp from Character Animator Recording";
	var intendedFootageFPS = 12;
	var fileToImport, sidecarFile, sidecarContents, importOpts, footageItem, footageSource, filePath, fileBaseName, audioFile, audioFootageItem, compDuration, comp, footageLayer, audioLayer;
	var pngExtension = ".png";	// assumes lowercase extension created by Character Animator
	var pngExtensionFilter;
	
	// make sure the frame rate is a number and can be accepted by After Effects
	function validateFPS(inputFPS)
	{
		if (isNaN(parseFloat(inputFPS)) || (inputFPS < 0)) {
			inputFPS =12;
		} else if (inputFPS > 99) {
			inputFPS = 99;
		}
		
		return parseFloat(inputFPS);
	}
	
	// import the footage (PNG sequence); just use the first selected file
	pngExtensionFilter = "*"+pngExtension; // trying to use a Mac-specific filter function can cause an uncaught exception when viewing the Desktop and switching video modes :-(
	fileToImport = File.openDialog("Select file from the PNG sequence", pngExtensionFilter, false);
	if (!fileToImport || !fileToImport.exists) {
		return;
	}
	
	// set the intended frame rate to what was specified in the sidecar (if it exists), the last setting specified by the user, or 12 if not previouly specified
	sidecarFile = new File(fileToImport.path + "/" + fileToImport.name.replace(/\.\d+\.png/, ".json"));
	if (sidecarFile.exists) {
		sidecarFile.open("r");
		try {
			sidecarContents = JSON.parse(sidecarFile.read());
		}
		catch (e) {
			sidecarFile = null;
		}
		if (sidecarFile !== null) {
			sidecarFile.close();
			intendedFootageFPS = validateFPS(sidecarContents.frameRate);
		}
	} else {
		sidecarFile = null;
	}
	
	if (sidecarFile === null) {
		if (app.settings.haveSetting("Adobe", "characteranimator_sceneFPS", PREFType.PREF_Type_MACHINE_INDEPENDENT)) {
			intendedFootageFPS = validateFPS(app.settings.getSetting("Adobe", "characteranimator_sceneFPS", PREFType.PREF_Type_MACHINE_INDEPENDENT));
		}
		var enteredFootageFPS = prompt("Specify the recorded scene's frame rate", intendedFootageFPS.toString(), scriptName);
		if (enteredFootageFPS === null) {
			return;
		} else {
			intendedFootageFPS = validateFPS(enteredFootageFPS);
			app.settings.saveSetting("Adobe", "characteranimator_sceneFPS", intendedFootageFPS.toString(), PREFType.PREF_Type_MACHINE_INDEPENDENT);
		}
	}

	app.beginUndoGroup(scriptName);
	
	importOpts = new ImportOptions(fileToImport);
	importOpts.sequence = true;	// import as sequence
	importOpts.forceAlphabetical = true;	// force alphabetical order (to work around 3709647)
	footageItem = app.project.importFile(importOpts);
	if (!footageItem) {
		return;
	}
	footageItem.name = decodeURI(fileToImport.name).replace(/\.\d+\.png/, "");	// remove the numeric part for the footage item name
	if (!footageItem.hasVideo) {
		alert("No video component to the selected footage: " + footageItem.name, scriptName);
		return;
	}
	footageItem.selected = false;

	// for now, conform PNG sequence to 12 fps
	footageSource = footageItem.mainSource;
	if (footageSource.isStill) {
		alert("Can't set frame rate for a still file: " + footageItem.name);
		return;
	}
	footageSource.conformFrameRate = intendedFootageFPS;

	// if matching audio recording (WAV file), import that
	filePath = footageItem.file.path;
	fileBaseName = decodeURI(footageItem.file.name).replace(/\.\d+\.png$/, "");
	audioFile = new File(filePath + "/" + fileBaseName + ".wav");
	if (audioFile.exists) {
		audioFootageItem = app.project.importFile(new ImportOptions(audioFile));
		audioFootageItem.selected = false;
	} else {
		audioFile = null;
	}

	// create a new comp based on the PNG sequence's dimensions and longest file's duration;
	// ideally, both should have the same duration, but use the longest one so the user can shift one layer if needed
	compDuration = (audioFile && (audioFootageItem.duration > footageItem.duration)) ? audioFootageItem.duration : footageItem.duration;
	comp = app.project.items.addComp(fileBaseName, footageItem.width, footageItem.height, footageItem.pixelAspect, compDuration, footageItem.frameRate);
	footageLayer = comp.layers.add(footageItem, footageItem.duration);
	if (audioFile) {
		audioLayer = comp.layers.add(audioFootageItem, audioFootageItem.duration);
		audioLayer.moveAfter(footageLayer);
	}

	// select the created comp, and open it
	comp.selected = true;
		
	comp.openInViewer();

	app.endUndoGroup();
})();
