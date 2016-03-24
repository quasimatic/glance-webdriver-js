import {createGlance} from "../test-helper"
let glance;

describe('Error Messages', function () {
    this.timeout(5000)
    before(function () {
        glance = createGlance();
        return glance.url("file:///" + __dirname + "/examples/errors.html")
    });

    after(function(){
        glance.end();
    });

    it("should show correct error within a chain", function () {
        return glance
            .click('non-existing-button-1')
            .click('non-existing-button-2')
            .should.be.rejectedWith("Element not found: non-existing-button-1");

    });
});