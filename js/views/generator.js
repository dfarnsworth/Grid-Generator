var app = app || {};

app.AppView = Backbone.View.extend({

	el: "#form",

	containerWidthTemplate: _.template($("#container-width-template").html()),

	events: {
		// Breakpoint
		// "click .add-breakpoint": "createBreakpoint",

		// Measurements
		"keyup input.column-width": "updateColumnWidth",
		"keyup input.gutter-width": "updateGutterWidth",
		"keyup input.count": "updateColumnCount",
		"click input.side-gutters": "updateSideGutters",

		// Naming
		"keyup input.grid-class": "updateGridClass",
		"keyup input.offset-class": "updateOffsetClass",
		"keyup input.container-class": "updateContainerClass"
	},

	initialize: function() {
		// Create a generator model instance
		app.generator = new app.Generator();

		// Startup the overlay view
		new app.OverlayView;

		new app.BreakpointView;

		// Where to display Default Width
		this.defaultWidthContainer = this.$("#default-width");

		// Input Fields
		this.inputColumnWidth = this.$(".column-width");
		this.inputGutterWidth = this.$(".gutter-width");
		this.inputCount = this.$(".count");
		this.inputSideGutters = this.$(".side-gutters");
		this.inputGridClass = this.$(".grid-class");
		this.inputOffsetClass = this.$(".offset-class");
		this.inputContainerClass = this.$(".container-class");

		// Toggle Overlay Button
		this.buttonToggle = this.$(".overlay-toggle");

		// Model Events
		app.generator.on("change", this.calculateContainerWidth, this);
		// Now trigger a change
		app.generator.trigger("change");

		return this;
	},

	createBreakpoint: function() {
		// var view = new app.BreakpointView({ model: app.BreakpointModel });
		app.breakpoints.add({ model: app.BreakpointModel });
		console.log(app.breakpoints.length);
	},

	calculateContainerWidth: function() {
		var widthToDisplay,
			columnWidth = parseInt(app.generator.escape("columnWidth")),
			gutterWidth = parseInt(app.generator.escape("gutterWidth")),
			columns = parseInt(app.generator.escape("columns")),
			sideGutters = app.generator.get("sideGutters"),
			containerWidth = (columnWidth * columns) + (gutterWidth * columns - gutterWidth);

		app.generator.set("containerWidth", containerWidth);
		app.generator.set("containerWidthPadded", containerWidth + gutterWidth);

		// If side gutters...
		if (sideGutters) {
			widthToDisplay = app.generator.escape("containerWidthPadded");
		} else {
			widthToDisplay = app.generator.escape("containerWidth");
		}

		// Display the default width
		this.defaultWidthContainer.html(
			this.containerWidthTemplate(
				{containerWidth: widthToDisplay})
			);

		return this;
	},

	// Updater Methods
	updateColumnWidth: function() {
		app.generator.set("columnWidth", this.inputColumnWidth.val() ? parseInt(this.inputColumnWidth.val()) : 60);
	},
	updateGutterWidth: function() {
		app.generator.set("gutterWidth", this.inputGutterWidth.val() ? parseInt(this.inputGutterWidth.val()) : 20);
	},
	updateColumnCount: function() {
		app.generator.set("columns", this.inputCount.val() ? parseInt(this.inputCount.val()) : 12);
	},
	updateSideGutters: function() {
		app.generator.set("sideGutters", this.inputSideGutters.is(":checked") ? true : false);
	},
	updateGridClass: function() {
		app.generator.set("gridClass", this.inputGridClass.val() !== "" ? this.inputGridClass.val() : "grid_");
	},
	updateOffsetClass: function() {
		app.generator.set("offsetClass", this.inputOffsetClass.val() !== "" ? this.inputOffsetClass.val() : "offset_");
	},
	updateContainerClass: function() {
		app.generator.set("containerClass", this.inputContainerClass.val() !== "" ? this.inputContainerClass.val() : "container");
	}

});