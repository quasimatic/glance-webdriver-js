describe('Drag and Drop', function () {
	before(function*() {
		yield glance.url("file:///" + __dirname + "/examples/drag-and-drop.html")
	});

	it("should drag and drop an item", function*() {
		yield glance.dragAndDrop("item-1", "item-2")
	});
});