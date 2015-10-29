describe('Timing', function () {
	it("should look by content", function*() {
		yield glance.url("file:///" + __dirname + "/examples/timing.html")

		var content = yield glance.getHTML("Appearing Item")
		content.should.match(/<div.*>Appearing Item<\/div>/);
	});
});