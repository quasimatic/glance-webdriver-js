describe('Nth', function () {
	before(function*() {
		yield glance.url("file:///" + __dirname + "/examples/nth.html")
	});

	it("should get the nth item", function*() {
		var content = yield glance.getHTML("box1>Item A#2")
		content.should.match(/<div class="item-2".*>Item A<\/div>/);
	});

	it("should get the nth container for an item", function*() {
		var content = yield glance.getHTML("box2>inner-box#2>Item A")
		content.should.match(/<div class="item-2".*>Item A<\/div>/);
	});
});