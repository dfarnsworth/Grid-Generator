 <?
	error_reporting(E_ALL);
	ini_set("display_errors","on");
	
	if ($_POST) {
		$text = $_POST["unsorted"];
	} else {
		$text = "";
	}

	$output = "";
	$in_declaration = false;
	$in_comment = false;
	$last_char = false;
	$length = strlen($text);
	$cache = "";
	$properties = array();
	$property_names = array();
	$current_property_name = "";
	
	$hadcomment = false;
	$in_property = false;
	$in_name = false;
	
	for ($i = 0; $i < $length; $i++) {
		$char = substr($text,$i,1);
		$l_char = substr($text,$i - 1,1); // for closing comments more reliably
		$n_char = substr($text,$i + 1,1); // for opening comments and adding trailing ;s
		if ($char == "/" && $n_char == "*") {
			$in_comment = true;
			$hadcomment = true;
			if (!$in_declaration) {
				$output .= $char;
			}
		} elseif ($char == "/" && $l_char == "*") {
			$in_comment = false;
			if (!$in_declaration) {
				$output .= $char;
			}
		} elseif ($in_comment) {
			if (!$in_declaration) {
				$output .= $char;
			}
		} elseif ($char == "{") {
			$in_property = false;
			$in_name = true;
			
			$in_declaration = true;
			$properties = array();
			$property_names = array();
			$property_errors = array();	
		} elseif ($char == "}") {
			$in_declaration = false;
			$in_property = false;
			$in_name = false;
			
			// Alphabetize			
			array_multisort($property_names,$properties,SORT_ASC,SORT_STRING);
			$output .= "{ ";
			foreach ($properties as $name => $value) {
				$output .= $name.": ".$value."; ";
			}
			if ($property_errors) {
				$output .= " /*";
				$errors = 0;
				$error_count = count($property_errors);
				if ($error_count == 1) {
					$error_report = "Duplicate Property: ";
				} else {
					$error_report = "Duplicate Properties: ";
				}
				foreach ($property_errors as $pe) {
					$errors++;
					$output .= " " . $pe;
					if ($error_count > 1 && $errors < $error_count) {
						$output .= ", ";
					}
				}
				$output .= " */ ";
			}
			$output .= "}";
		} elseif ($in_declaration && $char == ":") {
			$in_property = true;
			$in_name = false;
			
			// This is a property name
			if (!in_array(trim($cache),$property_names)) {
				$property_names[] = trim($cache);
			} else {
				// if this is a duplicate
				$property_errors[] = trim($cache);
			}
			$current_property_name = trim($cache);
			$cache = "";
		} elseif ($in_declaration && $char == ";") {
			$in_property = false;
			$in_name = true;
			
			$properties[$current_property_name] = trim($cache);
			$cache = "";
		} elseif ($in_declaration && $n_char == "}") {
			// Add trailing ";" if it's not there
			$cache .= $char;
			if ($in_property) {
				$properties[$current_property_name] = trim($cache);
				$cache = "";
			}
		} elseif ($in_declaration) {
			$cache .= $char;
		} else {
			$output .= $char;
		} 
	}
?>
<html>
	<head></head>
	<body>
		<form method="post">
			Unsorted<br />
			<textarea name="unsorted" rows="20" cols="100"></textarea>
			<br /><br>
			<input type="submit" value="Submit" />
		</form>
		Sorted<br />
		<textarea name="sorted" rows="20" cols="100"><?=htmlspecialchars($output)?></textarea>
	</body>
</html>