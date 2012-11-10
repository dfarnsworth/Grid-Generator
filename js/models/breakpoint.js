var app = app || {};

app.BreakpointModel = Backbone.Model.extend({

	defaults: {
		screenSize: 0,
		containerSize: 0,
		unit: "pixels"
	},

	initialize: function() {
		console.log("new Breakpoint Model created!");
		return this;
	}

});