import Glance from '../../src/glance';
let glance;

describe('Nth', function () {
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
		return glance.url("file:///" + __dirname + "/examples/nth.html")
	});

	it("should get the nth item", function() {
		return glance.get("box1>Item A#2:html").should.eventually.match(/<div.*class="item-2".*>Item A<\/div>/);
	});

	it("should get the nth container for an item", function() {
		return glance.get("box2>inner-box#2>Item A:html").should.eventually.match(/<div.*class="item-2".*>Item A<\/div>/);
	});
});