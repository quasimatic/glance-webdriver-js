import {createGlance} from "../test-helper"

describe('Extensions: labels', function () {
    let glance;

    beforeEach(function () {
        glance = createGlance();
        return glance.url("file:///" + __dirname + "/../examples/custom.html");
    });

    afterEach(function () {
        glance.end();
    });

    it("should provide custom locator", function () {
        glance.addExtension({
            labels: {
                "a-custom-thing": {
                    locate: function (label, {glance}) {
                        return glance.find("custom-item").then((wdioSelector)=> {
                            return glance.webdriver.element(wdioSelector);
                        });
                    }
                }
            }
        });

        return glance.get("a-custom-thing").should.eventually.equal('something custom');
    });
});