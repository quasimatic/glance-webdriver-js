describe('Error Messages', function() {
    before(function*() {
        glance = new Glance(browser);
        yield glance.url("file:///" + __dirname + "/examples/errors.html")
    });

    it("should show correct error within a chain", function*() {
        try {
            yield glance
                .click('non-existing-button-1')
                .click('non-existing-button-2');

            throw new Error("Did not catch error");
        }
        catch(err)
        {
            err.message.should.equal("Element not found: non-existing-button-1");
        }
    });
});