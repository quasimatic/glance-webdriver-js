import Glance from '../../src/glance';
let glance;

describe('Targeting', function () {
    this.timeout(10000)
    before(function () {
        glance = new Glance({
            capabilities: [{
                browserName: 'phantomjs'
            }],
            logLevel: 'silent',
            coloredLogs: true,
            screenshotPath: './errorShots/',
            baseUrl: 'http://localhost',
            waitforTimeout: 5000
        });

        return glance.url("file:///" + __dirname + "/examples/labels.html")
    });

    it("should look by content", function () {
        return glance.get("Content Item:html").should.eventually.match(/<div.*>Content Item<\/div>/);
    });

    it("should look by content as contains", function () {
        return glance.get("Item Contains:html").should.eventually.match(/<div.*>This Item Contains Text<\/div>/);
    });

    it("should look by exact match first then contains", function () {
        return glance.get("Item Exact Match:html").should.eventually.match(/<div.*>Item Exact Match<\/div>/);
    });

    it('will look by id', function () {
        return glance.get("label-id:html").should.eventually.match(/<div.*id="label-id".*>ID Item<\/div>/);
    });

    it("should look by class", function () {
        return glance.get("div-class:html").should.eventually.match(/<div.*class="div-class".*>Class Item<\/div>/);
    });

    it("should look by node type", function () {
        return glance.get("button:html").should.eventually.match(/<button.*class="button-direct".*>Button<\/button>/);
    });

    it("should use the last index against the whole selector", function () {
        return glance.get("h2>Shared Title#1:html").should.eventually.match(/<span.*class="title".*>Shared Title<\/span>/);
    });

    it.skip("should look at attributes by value", function () {
        return glance.get("attribute-value:html").should.eventually.match(/<div.*data-key="attribute-value".*>Attribute Item<\/div>/);
    });

    it("should look by node type", function () {
        return glance.get("text and nodes#1:html").should.eventually.match(/<div.*class="text-with-nodes".*>\n    This item has text and nodes\n    <div>Inner Text<\/div>\n    <span>More Text<\/span>\n<\/div>/);
    });

    it("should look by custom labels", function () {
        return glance.addLabel("customlabel", function (selector) {
                return this.convertGlanceSelector(".random>div#2").then((wdioSelector)=> this.webdriverio.element(wdioSelector))
            })
            .get("customlabel:html").should.eventually.match(/<div.*>Other Custom Data<\/div>/);
    });

    it("should show an error if duplicate elements are found", function () {
        return glance.get("Duplicate").should.be.rejectedWith("Found 2 duplicates for: Duplicate");
    });

    it("should show a duplicate error only for first type of match", function () {
        return glance.get("Copy Exact Match").should.be.rejectedWith("Found 2 duplicates for: Copy Exact Match")
    })

    it("should show an error if element not found", function () {
        return glance.get("item-not-found").should.be.rejectedWith("Element not found: item-not-found")
    });
});