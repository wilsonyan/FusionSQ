//Author-Wilson
//Description-TestButton


function run(context) {

    "use strict";
    if (adsk.debug === true) {
        /*jslint debug: true*/
        debugger;
        /*jslint debug: false*/
    }

    var ui, app;
	
	
    try {
        app = adsk.core.Application.get();
        ui = app.userInterface;

        // Get the CommandDefinitions collection.
        var cmdDefs = ui.commandDefinitions;

		//ui.messageBox(String(cmdDefs.count));
        
				
        // Create a button command definition.
        var buttonSample = cmdDefs.addButtonDefinition('MyButtonDefIdJS', 'SmartQuote', 
                                                       '<div style="align:center">Sample button tooltip</div>',
                                                       './/assets');


        // Connect the command created event.
        //buttonSample.commandCreated.add(SampleCommandCreatedEventHandler);
        var simples = buttonSample.commandCreated.add(onCommandCreated);

		



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


var onCommandCreated = function(args){
	
    var commandId = 'CommandInputGallery';
    var commandName = 'Command Input Gallery';
    var commandDescription = 'Demo command input examples.';	
	
	try{
        var app = adsk.core.Application.get();
        var design = adsk.fusion.Design(app.activeProduct);
        var ui = app.userInterface;

        // Get the root component of the active design.
        var rootComp = design.rootComponent;
		var rootCompCount = rootComp.features.count;

		//ui.messageBox(String(rootCompCount));87-
		if(rootCompCount == 0){
            ui.messageBox('There is no body to quote in the active design.', 'Nothing to Quote');
            return;
        }
		
		var command = args.command;

		//Terminate the script when the command is destroyed
		command.destroy.add(function() { adsk.terminate(); });
		
		var inputs = command.commandInputs;

		inputs.addTextBoxCommandInput(commandId + '_text_intro', '', "<strong>SmartQuote is an awesome platform for manufacturing prototypes and lots of volume.SmartQuote is an awesome platform for manufacturing prototypes and lots of volume.SmartQuote is an awesome platform for manufacturing prototypes and lots of volume.SmartQuote is an awesome platform for manufacturing prototypes and lots of volume.SmartQuote is an awesome platform for manufacturing prototypes and lots of volume.SmartQuote is an awesome platform for manufacturing prototypes and lots of volume.SmartQuote is an awesome platform for manufacturing prototypes and lots of volume.SmartQuote is an awesome platform for manufacturing prototypes and lots of volume.</strong>", 10, true);		
        var string_input = inputs.addStringValueInput(commandId + '_email', 'Email Address', '');
		inputs.addTextBoxCommandInput(commandId + '_text_intro', '', "<strong>Awesome Sauce</strong>", 5, true);


		var MyInputChangedHandler = function(args) {
			var app = adsk.core.Application.get();
			var ui = app.userInterface;
		};


		// Event handler function.
		var MyValidateInputsHandler = function(args) {
				var app = adsk.core.Application.get();
				var ui = app.userInterface;

				if(args.firingEvent.sender.commandInputs.itemById(commandId + '_email').value == 'asdf'){
					args.areInputsValid = true;
				}
				else{
					args.areInputsValid = false;				
				}

		};
		

		


//        var input_handler = command.inputChanged.add(MyInputChangedHandler);        
		var valid_handler = command.validateInputs.add(MyValidateInputsHandler);
		

		

	}
	catch (e){
		ui.messageBox('Failed : ' + (e.description ? e.description : e));
	}
};
	


// Handle the command created event
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
