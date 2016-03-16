export default function(selector, customLabels, multiple, logLevel) {
	glanceSelector.addCustomLabels(customLabels);
	return glanceSelector(selector);
}