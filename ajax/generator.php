<?
	// error_reporting(E_ALL);
	// ini_set("display_errors","on");

	// Defaults
	$defaultColumn = 60;
	$defaultGutter = 20;
	$defaultCount = 12;
	$defaultGridPrefix = "grid_";
	$defaultOffsetPrefix = "offset_";
	$defaultContainer = "container";

	// Clearfix
	$clearfix = '[class*="{{grid}}"] { float: left; margin-right: {{margin}}%; *zoom: 1; }' . "\n";
	$clearfix .= '[class*="{{grid}}"]:before, [class*="{{grid}}"]:after { content: "";  display: table; }' . "\n";
	$clearfix .= '[class*="{{grid}}"]:after { clear: both; }' . "\n\n";

	$createGrid = $_GET ? true : false;
	$columnWidth = $_GET["column-width"] !== "" ? $_GET["column-width"] : $defaultColumn;
	$gutterWidth = $_GET["gutter-width"] !== "" ? $_GET["gutter-width"] : $defaultGutter;
	$gridPrefix = $_GET["grid-prefix"] !== "" ? trim($_GET["grid-prefix"]) :$defaultGridPrefix;
	$offsetPrefix = $_GET["offset-prefix"] !== "" ? trim($_GET["offset-prefix"]) :$defaultOffsetPrefix;
	$count = $_GET["count"] !== "" ? $_GET["count"] : $defaultCount;
	$containerName = $_GET["container-class"] !== "" ? $_GET["container-class"] : $defaultContainer;
	$sideGutters = $_GET["side-gutters"];
	$breakpoints = $_GET["breakpoints"] ? $_GET["breakpoints"] : false;

	strpos($gridPrefix, ".") === 0 && $gridPrefix = substr($gridPrefix, 1);
	strpos($offsetPrefix, ".") === 0 && $offsetPrefix =  substr($offsetPrefix,1);

	$fullWidth = ($columnWidth * $count) + ($gutterWidth * $count - ($gutterWidth));

	// Drawing Functions
	function defineMargin($gwidth = 20, $full = 940) {
		return $gwidth / $full * 100;
	}
	function defineGrid($cwidth = 60, $gwidth = 20, $x = 1, $full) {
		$item = "";
		$item = ($cwidth * $x) + ($gwidth * $x - ($gwidth));
		$item = $item / $full * 100;

		return $item;
	}
	function drawGrid($cwidth = 60, $gwidth = 20, $x = 1, $full) {
		$text = "";
		$item = "";
		$item = ($cwidth * $x) + ($gwidth * $x - ($gwidth));
		$item = $item / $full * 100;
		$text = "{ width: " .$item. "%; } \n";
		return $text;
	}
	function defineOffset($cwidth = 60, $gwidth = 20, $x = 1, $full) {
		$item = "";
		$item = ($cwidth * $x) + ($gwidth * $x - ($gwidth));
		$item = $item / $full * 100;

		return $item;
	}
	function drawOffset($cwidth = 60, $gwidth = 20, $x = 1, $full) {
		$text = "";
		$item = "";
		$item = ($cwidth * $x) + ($gwidth * $x - ($gwidth)) - $cwidth;
		$item = $item / $full * 100;
		$text = "{ margin-left: " .$item. "%; } \n";
		return $text;
	}

	$margin = defineMargin($gutterWidth, $fullWidth);

	$clearfix = str_replace("{{grid}}", $gridPrefix, $clearfix);
	$clearfix = str_replace("{{margin}}", $margin, $clearfix);

	$output = "";
	$output .= $clearfix;
	// Create Grid
	if ($createGrid) {
		$output .= "/* GRID */\n";

		for ($i = 0; $i < $count; $i++) {
			$gnum = $i+1;
			$grid = drawGrid($columnWidth, $gutterWidth, $gnum, $fullWidth);
			$output .= "." . $gridPrefix . $gnum . " " . $grid;
		}

		$output .= "\n/* OFFSETS */\n";
		for ($i = 0; $i < $count - 1; $i++) {
			$gnum = $i+1;
			$offset = drawOffset($columnWidth, $gutterWidth, $gnum + 1, $fullWidth);
			$output .= "." . $offsetPrefix . $gnum . " " . $offset;
		}
	}


	// Container Width
	$containerOutput = "\n\n/* Container */\n";

	$containerOutput .= "." . $containerName . "{ margin: 0 auto; max-width: " . $fullWidth . "px;";
	$sideGutters == "on" && $containerOutput .= "padding: 0 " . $gutterWidth/2 . "px; ";
	$containerOutput .= "}\n";
	$output .= $containerOutput;

	// Calculate Breakpoints
	$mediaQueries = "";
	if ($breakpoints) {
		$breakpoints = json_decode($breakpoints);
		foreach ($breakpoints as $item) {
			$paddingCSS = "";
			$sideGutters == "on" && $paddingCSS = "padding: 0 ".$item[1] * ($margin/2/100)."px; ";
			$query = "@media screen and (min-width: ".$item[0]."px) { ";
			$query .= ".".$containerName." { ".$paddingCSS." width: ".$item[1]."px; }";
			$query .= "}";

			$mediaQueries .= $query;

		}
	}

	$output.=$mediaQueries;

	// Create Data
	$data = array();
	$data["column"] = defineGrid($columnWidth, $gutterWidth, 1, $fullWidth);
	$data["margin"] = defineMargin($gutterWidth, $fullWidth);
	$data["count"] = $count;
	$data["full"] = $fullWidth;
	$data["side-gutters"] = $sideGutters;
	$data["media-queries"] = $mediaQueries;
	$data["css"] = $output;
	$data["gridPrefix"] = $gridPrefix;
	$data["offsetPrefix"] = $offsetPrefix;

	if ($_GET["type"] == "json") {
		echo json_encode($data);
	} else {
		echo $output;
	}
?>