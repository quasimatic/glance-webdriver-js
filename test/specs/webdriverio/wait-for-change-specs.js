describe('Wait for change', function() {
    before(function*() {
        glance = new Glance(browser);
    })

    it("should wait til change", function*() {
        yield glance.url("file:///" + __dirname + "/examples/watch-for-change.html")
        var value = yield glance.watchForChange("text-1").get("text-1")
        value.should.equal("text has changed");
    });

    it("should wait until watched item is changed", function*() {
        yield glance.url("file:///" + __dirname + "/examples/wait-for-change.html")

        yield glance.watchForChange("watch-1");
        var value = yield glance.waitForChange("watch-1").get("text-1");
        value.should.equal("parent has changed");
    });
});