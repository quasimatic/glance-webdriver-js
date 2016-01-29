describe('Window', function () {
	it("should change focus to popup window", function*() {
		glance.webdriverio().addCommand("activateNewWindow", function () {
			return this.pause(1000).getTabIds().then(function (handles) {
				return this.getCurrentTabId().then(function (current) {
					if (handles[0] == current)
						return this.window(handles[1])
					else
						return this.window(handles[0])
				})
			})
		});

		glance.webdriverio().addCommand("activateOnlyWindow", function () {
			return this.pause(1000).getTabIds()
				.then(function (handles) {
					return this.window(handles[0])
				})
		});


		yield glance.url("file:///" + __dirname + "/examples/window.html");
		yield glance.click("Popup");
		yield glance.webdriverio().activateNewWindow();
		var content = yield glance.get("Popup Window>html")
		content.should.match(/<div.*>Popup Window<\/div>/);

		yield glance.click("Close")
		yield glance.webdriverio().activateOnlyWindow();

		var content = yield glance.get("Popup>html")
		content.should.match(/<a.*href="\.\/new-window.html" target="_blank".*>Popup<\/a>/);
	});
});