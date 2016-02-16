describe('Containing', function () {
	before(function*() {
		yield glance.url("file:///" + __dirname + "/examples/containers.html")
	});

	it("should look inside a container", function*() {
		var content = yield glance.get("box2>Item 1>html")
		content.should.match(/<div.*class="box2-item".*>Item 1<\/div>/);
	});

	it("should traverse the dom looking for items in multiple containers", function*() {
		var content = yield glance.get("Item 1 in box 3>Item 2>html")
		content.should.match(/<div.*class="box3-item-2".*>Item 2<\/div>/);
	});

	it("should show a duplicate found error if container finds more than one", function*() {
		yield glance.get("box4>Duplicate A>html").catch(function(err){
			err.message.should.equal("Found 2 duplicates for: box4>Duplicate A")
		})
	});

	it("should traverse the dom looking for items in parent containers", function*() {
		var content = yield glance.get("box5>inner-box>Item 1>html");
		content.should.match(/<div.*class="box5-item-1".*>Item 1<\/div>/);
	});

	it("should only crawl parents til first find", function*() {
		var content = yield glance.get("Item B>Item A>html");
		content.should.match(/<div.*class="box6-item-A".*>Item A<\/div>/);
	});

	it("should look by class near a container", function*() {
		var content = yield glance.get("box7>Item Content>class-name>html");
		content.should.match(/<div.*class="class-name".*><\/div>/);
	});

	it("should look by node type near a container", function*() {
		var content = yield glance.get("Item Content>input-near-content>html");
		content.should.match(/<input.*class="input-near-content".*>/);
	});

	it("should look within a custom label", function* () {
		yield glance.addLabel("customlabel", function() {
			return this.convertGlanceSelector(".random>div#2").then((wdioSelector)=> this.webdriverio.element(wdioSelector));
		});

		var content = yield glance.get("box9>customlabel>Item 1>html")
		content.should.match(/<div.*class="box9-item-1".*>Item 1<\/div>/);
	});

	it("should find the custom label in container", function*(){
		yield glance.addLabel("customClassLabel", function() {
			return this.convertGlanceSelectors("custom-class").then((wdioSelector)=> this.webdriverio.elements(wdioSelector));
		});

		var content = yield glance.get("Container Label For Custom Class>customClassLabel>html");
		content.should.match(/<div.*class="custom-class".*>Inside<\/div>/);
	})

	it("Should limit and narrow the search to containers found", function*(){
		var content = yield glance.get("reference 1>parent>target>html")
		content.should.match(/<div.*class="target-1".*>target<\/div>/);
	})
});