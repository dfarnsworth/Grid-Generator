var app = app || {};

app.OverlayView = Backbone.View.extend({

	el: "#form",
	// Visible Style Template
	visibleStyleTemplate: _.template('<textarea id="visible-styles"><%= styles %></textarea>'),

	// Overlay Templates
	overlayContainerTemplate: _.template($("#overlay-template").html()),
	overlayColumnTemplate: _.template('<div class="generated_column <%= columnClass %>"></div>'),

	// CSS Templates
	styleContainerTemplate: _.template($("#style-template").html()),
	styleClearfixTemplate: _.template($("#clearfix-template").html()),
	styleGridTemplate: _.template($("#grid-template").html()),
	styleOffsetTemplate: _.template($("#offset-template").html()),
	styleMediaQueryTemplate: _.template($("#media-query-template").html()),

	events: {
		"click .overlay-toggle": "toggleOverlay",
		"click .style-toggle": "toggleStyles"
	},

	initialize: function() {
		this.head = $("head");
		this.body = $("body");
		this.visibleStyleContainer = this.$(".style-container");

		// Overlay is hidden on load
		this.overlayIsVisible = false;
		this.stylesAreVisible = false;
		this.drawMediaQueries = false;

		app.generator.on("change", this.refresh, this);
		app.generator.on("breakpointChange", this.logBreakpoints, this);

		return this;
	},

	logBreakpoints: function() {
		var breakpointArray = app.generator.get("breakpoints"),
			verifiedArray = {},
			i = 0,
			j = 0;

		console.log(breakpointArray);

		$(breakpointArray).each(function(){
			if(breakpointArray[i]["containerSize"] >= 0 &&
			 	breakpointArray[i]["screenSize"] >= 0) {
				verifiedArray[j] = breakpointArray[i];
				j++;
			}
			i++;
		});

		this.verifiedBreakpoints = verifiedArray;
		if (JSON.stringify(app.generator.get("breakpoints")) !== "{}") {
			this.drawMediaQueries = true;
			// console.log($.parseJSON(JSON.stringify(verifiedArray)));
			this.refresh();
		} else {
			this.drawMediaQueries = false;
		}
	},

	refresh: function() {
		if (this.overlayIsVisible) {
			// First remove overlay
			this.destroyOverlay();
			this.destroyAppendedStyles();

			// Then remake it
			this.generateStyles();
			this.appendStyles();
			this.generateOverlay();
		}
		return;
	},

	toggleOverlay: function(e) {
		if (!this.overlayIsVisible) {
			this.generateStyles();
			this.appendStyles();
			this.generateOverlay();
		} else {
			this.destroyOverlay();
			this.destroyAppendedStyles();
		}
		return this;
	},

	toggleStyles: function(e) {
		if (!this.stylesAreVisible) {
			this.generateStyles();
			this.appendVisibleStyles();
		} else {
			this.destroyVisibleStyles();
		}
		return this;
	},

	appendVisibleStyles: function() {
		this.stylesAreVisible = true;
		this.visibleStyleContainer.html(this.visibleStyleTemplate({styles: app.compiledStyles }));
	},

	destroyVisibleStyles: function() {
		this.stylesAreVisible = false;
		this.visibleStyleContainer.html("");
	},

	drawGrid: function($i) {
		var text = "",
			columnWidth = parseInt(app.generator.escape("columnWidth")),
			gutterWidth = parseInt(app.generator.escape("gutterWidth")),
			containerWidth = parseInt(app.generator.get("containerWidth")),
			gridClass = app.generator.escape("gridClass"),
			item = (columnWidth * $i) + (gutterWidth * $i - (gutterWidth));

		item = item / containerWidth * 100;
		text = "." + gridClass + $i + " { width: " + item + "%; } \n";
		return text;
	},

	drawOffset: function($i) {
		var text = "",
			j = $i + 1,
			columnWidth = parseInt(app.generator.escape("columnWidth")),
			gutterWidth = parseInt(app.generator.escape("gutterWidth")),
			containerWidth = parseInt(app.generator.get("containerWidth")),
			offsetClass = app.generator.escape("offsetClass"),
			item = (columnWidth * j) + (gutterWidth * j - (gutterWidth)) - columnWidth;;

		item = item / containerWidth * 100;
		text = "." + offsetClass + $i + " { margin-left: " + item + "%; }\n";
		return text;
	},

	appendStyles: function() {
		this.head.append(this.styleContainerTemplate({styles: app.compiledStyles}));
	},

	generateStyles: function() {
		var mediaQueries = "",
			that = this,
			grids = "\n/* Grid */\n",
			offsets = "\n/* Offsets */\n",
			container = "\n/* Container */\n",
			columns = parseInt(app.generator.escape("columns")),
			containerClass = app.generator.escape("containerClass"),
			gutterWidth = parseInt(app.generator.escape("gutterWidth")),
			containerWidth = parseInt(app.generator.get("containerWidth")),
			breakpoints = app.generator.get("breakpoints")
			i = 0;

		for (var $i = 0; $i < columns; $i++) {
			var plusOne = $i + 1;
			grids += this.drawGrid(plusOne);
			if ($i < columns - 1) {
				offsets += this.drawOffset(plusOne);
			}
		}
		container += "." +  containerClass + " { margin: 0 auto; ";
		if (app.generator.get("sideGutters")) {
			container += "padding: 0 " + gutterWidth / 2 + "px; ";
		}
		// container += "max-width: " + containerWidth + "px; }";
		container += "}";

		if (this.drawMediaQueries) {
			mediaQueries += "\n/* Media Queries */\n";
			$(breakpoints).each(function(){
				console.log(this);
				var unit = this.unit == "pixels" ? "px" : "%";
				mediaQueries += that.styleMediaQueryTemplate({
					minWidth: this.screenMinSize,
					maxWidth: this.screenMaxSize,
					containerClass: containerClass,
					containerWidth: this.containerSize,
					unit: unit
				});
				i++;
			});
		}

		this.gridStyles = grids;
		this.offsetStyles = offsets;
		this.containerStyles = container;
		this.mediaQueries = mediaQueries;
		this.compileStyles();
		return this;
	},

	compileStyles: function() {
		var i = 0,
			that = this,
			compiledStyles = "",
			containerClass = app.generator.escape("containerClass"),
			containerWidth = parseInt(app.generator.escape("containerWidth")),
			gutterWidth = parseInt(app.generator.escape("gutterWidth")),
			gridClass = app.generator.escape("gridClass"),
			margin = gutterWidth / containerWidth * 100,
			clearfix = this.styleClearfixTemplate({
				gridPrefix: gridClass,
				margin: margin });

		compiledStyles += clearfix;
		compiledStyles += this.gridStyles;
		compiledStyles += this.offsetStyles;
		compiledStyles += this.containerStyles;
		compiledStyles += this.mediaQueries;

		app.compiledStyles = compiledStyles;
		if (this.stylesAreVisible) {
			this.appendVisibleStyles();
		}
		return this;
	},

	generateOverlay: function() {
		var html = "",
			columns = parseInt(app.generator.escape("columns")),
			className = app.generator.escape("gridClass") + "1";
		for (var $i = 0; $i < columns; $i++) {
			if ($i === columns - 1) {
				className += " omega";
			}
			html += this.overlayColumnTemplate({columnClass: className});
		}
		this.overlayColumns = html;
		this.showOverlay();
		return this;
	},

	showOverlay: function() {
		this.overlayIsVisible = true;
		this.body.append(
			this.overlayContainerTemplate({
				html: this.overlayColumns,
				containerClass: app.generator.escape("containerClass") })
			);
		return this;
	},

	destroyAppendedStyles: function() {
		$("#grid-styles").remove();
		return this;
	},

	destroyOverlay: function() {
		this.overlayIsVisible = false;
		$("#overlay").remove();
		return this;
	}

});