/*globals adsk*/
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
        var design = adsk.fusion.Design(app.activeProduct);
        ui = app.userInterface;

		
        // Get the root component of the active design.
        var rootComp = design.rootComponent;
		var rootCompCount = rootComp.features.count;

		//ui.messageBox(String(rootCompCount));
		
		if(rootCompCount == 0){
            ui.messageBox('There is no body to quote in the active design.', 'Nothing to Quote');
            return;
        }

		//STEP

    } 
    catch (e) {
        if (ui) {
            ui.messageBox('Failed : ' + (e.description ? e.description : e));
        }
    } 
 
    adsk.terminate();    
}
