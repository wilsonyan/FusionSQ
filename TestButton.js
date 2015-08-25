//Author-Wilson
//Description-TestButton


function run(context) {

    "use strict";
    if (adsk.debug === true) {
        /*jslint debug: true*/
        debugger;
        /*jslint debug: false*/
    }

    var ui;
    try {
        var app = adsk.core.Application.get();
        ui = app.userInterface;

        // Get the CommandDefinitions collection.
        var cmdDefs = ui.commandDefinitions;
        
        // Create a button command definition.
        var buttonSample = cmdDefs.addButtonDefinition('MyButtonDefIdJS', 'SmartQuote', 
                                                       'Sample button tooltip',
                                                       './/Resources');
        
	
        // Connect the command created event.
        buttonSample.commandCreated.add(SampleCommandCreatedEventHandler);
        
        // Get the Inspect toolbar panel. 
        var inspectPanel = ui.allToolbarPanels.itemById('SolidScriptsAddinsPanel');
        
        // Add the button to the bottom.
        var buttonControl = inspectPanel.controls.addCommand(buttonSample, 'MyButtonControlIDJS');
    }
    catch (e) {
        if (ui) {
            ui.messageBox('Failed : ' + (e.description ? e.description : e));
        }
    }
}


// Handle the add-in being unloaded.
function stop(context) {
    var ui;
    try {
        var app = adsk.core.Application.get();
        ui = app.userInterface;

        // Clean up the UI.
        var cmdDef = ui.commandDefinitions.itemById('MyButtonDefIdJS');
        if (cmdDef) {
            cmdDef.deleteMe();
        }
            
        var inspectPanel = ui.allToolbarPanels.itemById('SolidScriptsAddinsPanel');
        var cntrl = inspectPanel.controls.itemById('MyButtonControlIDJS');
        if (cntrl) {
            cntrl.deleteMe();
        }
		
    }
    catch (e) {
        if (ui) {
            ui.messageBox('Failed : ' + (e.description ? e.description : e));
        }
    }
}


// Handle the command created event.
var SampleCommandCreatedEventHandler = function(args) {
    try {
        var cmd = args.command;
    
        var app = adsk.core.Application.get();
        var design = adsk.fusion.Design(app.activeProduct);
        var ui = app.userInterface;

		
        // Get the root component of the active design.
        var rootComp = design.rootComponent;
		var rootCompCount = rootComp.features.count;

		//ui.messageBox(String(rootCompCount));
		
		if(rootCompCount == 0){
            ui.messageBox('There is no body to quote in the active design.', 'Nothing to Quote');
            return;
        }

        // Prompt the user for a string and validate it's valid.
        var isValid = false;
        var input = '1 in';  // The initial default value.
        var realValue;
        while (!isValid) {
            // Get a string from the user.
            var objIsCancelled = [];
            input = ui.inputBox('Enter a distance', objIsCancelled, 'Distance', input);
            
            // Exit the program if the dialog was cancelled.
            if (objIsCancelled.value) {
                adsk.terminate();    
                return;
            }
            
            // Check that a valid length description was entered.
            var unitsMgr = design.unitsManager;
            try {
                realValue = unitsMgr.evaluateExpression(input, unitsMgr.defaultLengthUnits);
                isValid = true;
            }
            catch (e) {
                // Invalid expression so display an error and set the flag to allow them
                // to enter a value again.
                ui.messageBox('"' + input + '" is not a valid length expression.', 'Invalid entry', 
                              adsk.core.MessageBoxButtonTypes.OKButtonType, 
                              adsk.core.MessageBoxIconTypes.CriticalIconType);
                isValid = false;
            }
        }
        
        // Use the value for something.
        ui.messageBox('input: ' + input + ', result: ' + realValue);
    }
    catch (e) {
        if (ui) {
            ui.messageBox('Failed : ' + (e.description ? e.description : e));
        }
    }
};