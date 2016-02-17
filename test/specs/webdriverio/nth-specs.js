describe('Nth', function () {
	before(function*() {
		glance = new Glance(browser);
		yield glance.url("file:///" + __dirname + "/examples/nth.html")
	});

	it("should get the nth item", function*() {
		var content = yield glance.get("box1>Item A#2>html")
		content.should.match(/<div.*class="item-2".*>Item A<\/div>/);
	});

	it("should get the nth container for an item", function*() {
		var content = yield glance.get("box2>inner-box#2>Item A>html")
		content.should.match(/<div.*class="item-2".*>Item A<\/div>/);
	});
});