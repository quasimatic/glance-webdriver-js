describe("overrides", function(){
	it("should use overwritten methods in addCommand", function*() {
		glance.addCommand("customCommand", function () {
			return this.getHTML("box2>inner-box#2>Item A");
		})

		yield glance.url("file:///" + __dirname + "/examples/nth.html")
		var content = yield glance.customCommand();
		content.should.match(/<div.*class="item-2".*>Item A<\/div>/);
	});
})