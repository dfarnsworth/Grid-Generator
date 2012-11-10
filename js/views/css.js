app.OverlayView = Backbone.View.extend({

	el: "#form",

	overlayContainerTemplate: _.template($("#overlay-template").html()),
	overlayColumnTemplate: _.template('<div class="generated_column <%= columnClass %>"></div>'),

	events: {
		"click .overlay-toggle": "toggleOverlay"
	},

	initialize: function() {
		this.buttonTemplate = this.$(".overlay-toggle");
		this.body = $("body");
		this.overlayIsVisible = false;
		return this;
	},

	toggleOverlay: function(e) {
		if (!this.overlayIsVisible) {
			this.generateOverlay();
		} else {
			this.destroyOverlay();
		}
	},

	generateOverlay: function() {
		var html = "",
			className = app.gridClass + "1";
		for (var $i = 0; $i < app.columns; $i++) {
			if ($i === app.columns - 1) {
				className += " omega";
			}
			html += this.overlayColumnTemplate({columnClass: className});
		}
		this.overlayColumns = html;
		this.showOverlay();
	},

	showOverlay: function() {
		this.overlayIsVisible = true;
		this.body.append(this.overlayContainerTemplate({html: this.overlayColumns}));
	},

	destroyOverlay: function() {
		this.overlayIsVisible = false;
		$("#overlay").remove();
	}

});