import {createGlance} from "../test-helper"
import {nextClosestSibling} from "./helpers/properties";

describe('Properties', function () {
    let glance;

    beforeEach(function () {
        glance = createGlance();
        return glance.url("file:///" + __dirname + "/examples/properties.html")
    })

    afterEach(function () {
        glance.end();
    });

    it("should get value", function () {
        glance.addExtension({
            properties: nextClosestSibling

        })
        return glance.get("start > label:next-closest-sibling").should.eventually.equal('label 1');
    });
});