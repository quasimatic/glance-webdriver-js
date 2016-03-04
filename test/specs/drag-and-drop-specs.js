import Glance from '../../src/glance';
let glance;

describe('Drag and Drop', function () {
	before(function() {
		glance = new Glance({
			capabilities: [{
				browserName: 'phantomjs'
			}],
			logLevel: 'silent',
			coloredLogs: true,
			screenshotPath: './errorShots/',
			baseUrl: 'http://localhost',
			waitforTimeout: 5000
		});

		return glance.url("file:///" + __dirname + "/examples/drag-and-drop.html")
	});

	it("should drag and drop an item", function() {
		return glance.dragAndDrop("item-1", "item-2")
	});
});