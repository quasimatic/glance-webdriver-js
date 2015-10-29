module.exports = {
	webdriverIO: function(webdriverio) {
		var wdio = require("./webdriverio.js");
		return wdio.create(webdriverio);
	}
}