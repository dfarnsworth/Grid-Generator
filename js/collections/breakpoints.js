var BreakpointCollection = Backbone.Collection.extend({

	model: app.BreakpointModel,

	localStorage: new Store('grid-generator'),

	initialize: function() {
		// console.log("BC init");
	}

});

app.breakpoints = new BreakpointCollection();

app.breakpoints.on("add", function(breakpoint){
	// console.log(breakpoint, "<- Added");
})