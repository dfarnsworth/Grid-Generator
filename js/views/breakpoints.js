var app = app || {};

app.BreakpointView = Backbone.View.extend({

	el: ".breakpoint-container",

	template: _.template($("#breakpoint-template").html()),

	events: {
		"click .add-breakpoint": "addBreakpoint",
		"click input": "getBreakpoints",
		"keyup input": "getBreakpoints",
	},

	initialize: function() {
		// var breakpoint = new app.BreakpointModel;
		// console.log("breakpoint view created", this);

		this.iterator = 0;
		this.buttonBreakpoint = this.$(".add-breakpoint");
		this.inner = this.$(".breakpoint-appender");
		return this;

		this.model.on( 'add', this.addBreakpoint, this );


	},

	addBreakpoint: function(e) {
		this.iterator++;
		this.inner.append( this.template({iterator: this.iterator}) );
		return this;
	},

	getBreakpoints: function(e) {
		var breakpointArray = [],
			breakpoints = this.$el.find(".breakpoint"),
			i = 0;

		breakpoints.each(function(){
			var screenMinSize = parseInt($(this).find(".screen-min-size").val()),
				screenMaxSize = parseInt($(this).find(".screen-max-size").val()),
				containerSize = parseInt($(this).find(".container-size").val()),
				unit = $(this).find('input[name="unit_' + (i+1) + '"]:checked').val();

			breakpointArray.push({
				screenMinSize: screenMinSize,
				screenMaxSize: screenMaxSize,
				containerSize: containerSize,
				unit: unit
			});
			i++;
		});
		// console.log(breakpointArray, breakpointArray.length);
		app.generator.set("breakpoints", breakpointArray);
		app.generator.trigger("breakpointChange");
	}

});