describe('Targeting', function () {
	before(function*() {
		yield glance.url("file:///" + __dirname + "/examples/labels.html")
	})

	it("should look by content", function*() {
		var content = yield glance.getHTML("Content Item")
		content.should.match(/<div.*>Content Item<\/div>/);
	});

	it("should look by content as contains", function*() {
		var content = yield glance.getHTML("Item Contains")
		content.should.match(/<div.*>This Item Contains Text<\/div>/);
	});

	it("should look by exact match first then contains", function*() {
		var content = yield glance.getHTML("Item Exact Match")
		content.should.match(/<div.*>Item Exact Match<\/div>/);
	});

	it('will look by id', function* () {
		var content = yield glance.getHTML("label-id")
		content.should.match(/<div id="label-id".*>ID Item<\/div>/);
	});

	it("should look by class", function*() {
		var content = yield glance.getHTML("div-class")
		content.should.match(/<div class="div-class".*>Class Item<\/div>/);
	});

	it("should look by node type", function*() {
		var content = yield glance.getHTML("button")
		content.should.match(/<button class="button-direct".*>Button<\/button>/);
	});

	it("should allow using wdio selector", function*(){
		var content = yield glance.getHTML("wdio:div*=wdio selector")
		content.should.match(/<div.*>wdio selector<\/div>/);
	});

	it("should use the last index against the whole selector", function*() {
		var content = yield glance.getHTML("h2>Shared Title#1")
		content.should.match(/<span class="title".*>Shared Title<\/span>/);
	});

	it.skip("should look at attributes by value", function*() {
		var content = yield glance.getHTML("attribute-value")
		content.should.match(/<div data-key="attribute-value".*>Attribute Item<\/div>/);
	});

	it("should look by node type", function*() {
		var content = yield glance.getHTML("text and nodes#1")
		content.should.match(/<div class="text-with-nodes".*>\n    This item has text and nodes\n    <div>Inner Text<\/div>\n    <span>More Text<\/span>\n<\/div>/);
	});

	it("should look by custom labels", function* () {
		yield glance.addElementLabel(function () {
			return this.element(".random>div#2")
		}, "customlabel");

		var content = yield glance.getHTML("customlabel");
		content.should.match(/<div.*>Other Custom Data<\/div>/);
	});

	it("should show an error if duplicate elements are found", function*() {
		yield glance.getHTML("Duplicate").catch(function(err){
			err.message.should.equal("Found 2 duplicates for: Duplicate")
		})
	});

	it("should show a duplicate error only for first type of match", function*() {
		yield glance.getHTML("Copy Exact Match").catch(function(err){
			err.message.should.equal("Found 2 duplicates for: Copy Exact Match")
		})
	});

	it("should show an error if element not found", function*() {
		yield glance.getHTML("item-not-found").catch(function(err){
			err.message.should.equal("Element not found: item-not-found")
		})
	});
});