describe("Chainable", function () {
    before(function () {
        glance = new Glance(browser);
    });

    it("should chain promises", function*() {
        yield glance.url("file:///" + __dirname + "/examples/set.html")
        yield glance.set("select-1:value", "value3")
        var content = yield glance.get("select-1:value")
        content.should.equal('value3');

        yield glance.url("file:///" + __dirname + "/examples/chaining.html")
            .click("Button 1")
            .click("Button 2")
            .get("result-1")
            .set("input-1", "value-1")
            .set("input-missing", "value-missing").catch(()=> {
                return Promise.resolve();
            })


        yield glance.addLabel("customlabel", function (selector) {
            return this.convertGlanceSelector("Button 2").then((wdioSelector)=> this.webdriverio.element(wdioSelector))
        });

        var content = yield glance.get("customlabel:html");
        content.should.match(/<button.*>Button 2<\/button>/)

        yield glance.url("file:///" + __dirname + "/examples/chaining-2.html")
            .click("Button A")
            .click("Button B")

        var result = yield glance.get("result-a")
        result.should.equal("Result A")

        yield glance.addLabel("blockinglabel", function (selector) {
            return glance.click("Custom Button").convertGlanceSelector("Custom Button").then((wdioSelector)=> this.webdriverio.element(wdioSelector))
        });

        yield glance.url("file:///" + __dirname + "/examples/chaining.html")
            .then(function () {
                console.log("Clicking");
                return glance.click("blockinglabel");
            });

        var clickedText = yield glance.get("input-1");
        clickedText.should.equal("clicked")

    });
})