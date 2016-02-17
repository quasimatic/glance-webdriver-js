describe('Targeting', function () {
	before(function*() {
		glance = new Glance(browser);
		yield glance.url("file:///" + __dirname + "/examples/labels.html")
	});

	it("should look by content", function*() {
		var content = yield glance.get("Content Item>html")
		content.should.match(/<div.*>Content Item<\/div>/);
	});

	it("should look by content as contains", function*() {
		var content = yield glance.get("Item Contains>html")
		content.should.match(/<div.*>This Item Contains Text<\/div>/);
	});

	it("should look by exact match first then contains", function*() {
		var content = yield glance.get("Item Exact Match>html")
		content.should.match(/<div.*>Item Exact Match<\/div>/);
	});

	it('will look by id', function* () {
		var content = yield glance.get("label-id>html")
		content.should.match(/<div.*id="label-id".*>ID Item<\/div>/);
	});

	it("should look by class", function*() {
		var content = yield glance.get("div-class>html")
		content.should.match(/<div.*class="div-class".*>Class Item<\/div>/);
	});

	it("should look by node type", function*() {
		var content = yield glance.get("button>html")
		content.should.match(/<button.*class="button-direct".*>Button<\/button>/);
	});

	it("should use the last index against the whole selector", function*() {
		var content = yield glance.get("h2>Shared Title#1>html")
		content.should.match(/<span.*class="title".*>Shared Title<\/span>/);
	});

	it.skip("should look at attributes by value", function*() {
		var content = yield glance.get("attribute-value>html")
		content.should.match(/<div.*data-key="attribute-value".*>Attribute Item<\/div>/);
	});

	it("should look by node type", function*() {
		var content = yield glance.get("text and nodes#1>html")
		content.should.match(/<div.*class="text-with-nodes".*>\n    This item has text and nodes\n    <div>Inner Text<\/div>\n    <span>More Text<\/span>\n<\/div>/);
	});

	it("should look by custom labels", function* () {
		yield glance.addLabel("customlabel", function (selector) {
			return this.convertGlanceSelector(".random>div#2").then((wdioSelector)=> this.webdriverio.element(wdioSelector))
		});

		var content = yield glance.get("customlabel>html");
		content.should.match(/<div.*>Other Custom Data<\/div>/);
	});

	it("should show an error if duplicate elements are found", function*() {
		yield glance.get("Duplicate>html").catch(function(err){
			err.message.should.equal("Found 2 duplicates for: Duplicate")
		})
	});

	it("should show a duplicate error only for first type of match", function*() {
		yield glance.get("Copy Exact Match>html").catch(function(err){
			err.message.should.equal("Found 2 duplicates for: Copy Exact Match")
		})
	});

    it("should show an error if element not found", function(done) {
        this.timeout(30000)
        glance.get("item-not-found>html").catch(function(err) {
            try {
                err.message.should.equal("Element not found: item-not-found>html")
                done();
            }
            catch (err) {
                done(err)
            }
        });
    });
});
