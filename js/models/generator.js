var app = app || {};

app.Generator = Backbone.Model.extend({

	defaults: {
		columnWidth: 60,
		gutterWidth: 20,
		columns: 12,
		gridClass: "grid_",
		offsetClass: "offset_",
		containerClass: "container",
		containerWidth: 940,
		containerWidthPadded: 960,
		sideGutters: false,
		breakpoints: {},
		breakpointCount: 0
	},

	initialize: function() {
		return this;
	}

});