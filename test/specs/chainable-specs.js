import {createGlance} from "../test-helper"
let glance;

describe("Chainable", function () {
    this.timeout(5000)
    before(function () {
        glance = createGlance();
    });

    after(function(){
        glance.end();
    });

    it("should chain promises", function () {
        return glance.url("file:///" + __dirname + "/examples/set.html")
            .set("select-1:value", "value3")
            .get("select-1:value")
            .then(function (content) {
                return content.should.equal('value3');
            })
            .then(function () {
                return glance.url("file:///" + __dirname + "/examples/chaining.html")
                    .click("Button 1")
                    .click("Button 2")
                    .get("result-1")
                    .set("input-1", "value-1")
                    .set("input-missing", "value-missing").catch(()=> {
                        return Promise.resolve();
                    })
            })
            .then(function () {
                return glance.addLabel("customlabel", function (glance, selector) {
                        return glance.convertGlanceSelector("Button 2").then((wdioSelector)=> glance.browser.element(wdioSelector))
                    })
                    .get("customlabel:html").should.eventually.match(/<button.*>Button 2<\/button>/);
            })
            .then(function () {
                return glance.url("file:///" + __dirname + "/examples/chaining-2.html")
                    .click("Button A")
                    .click("Button B")
                    .get("result-a").should.eventually.equal("Result A");
            })
            .then(function () {
                return glance.addLabel("blockinglabel", function (selector) {
                        return glance.click("Custom Button").convertGlanceSelector("Custom Button").then((wdioSelector)=> glance.browser.element(wdioSelector))
                    })
                    .url("file:///" + __dirname + "/examples/chaining.html")
                    .then(function () {
                        return glance.click("blockinglabel");
                    })
                    .get("input-1").should.eventually.equal("clicked")
            })
    });
})