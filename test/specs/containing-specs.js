import {createGlance} from "../test-helper"
let glance;

describe('Containing', function () {
    this.timeout(5000)
    before(function () {
        glance = createGlance();

        return glance.url("file:///" + __dirname + "/examples/containers.html")
    });

    after(function(){
        glance.end();
    })

    it("should look inside a container", function () {
        return glance.get("box2>Item 1:html")
            .should.eventually.match(/<div.*class="box2-item".*>Item 1<\/div>/);
    });

    it("should traverse the dom looking for items in multiple containers", function () {
        return glance.get("Item 1 in box 3>Item 2:html")
            .should.eventually.match(/<div.*class="box3-item-2".*>Item 2<\/div>/);
    });

    it("should show a duplicate found error if container finds more than one", function () {
        return glance.get("box4>Duplicate A").catch(function (err) {
            return err.message.should.equal("Found 2 duplicates for: box4>Duplicate A")
        })
    });

    it("should traverse the dom looking for items in parent containers", function () {
        return glance.get("box5>inner-box>Item 1:html")
            .should.eventually.match(/<div.*class="box5-item-1".*>Item 1<\/div>/);
    });

    it("should only crawl parents til first find", function () {
        return glance.get("Item B>Item A:html")
            .should.eventually.match(/<div.*class="box6-item-A".*>Item A<\/div>/);
    });

    it("should look by class near a container", function () {
        return glance.get("box7>Item Content>class-name:html")
            .should.eventually.match(/<div.*class="class-name".*><\/div>/);
    });

    it("should look by node type near a container", function () {
        return glance.get("Item Content>input-near-content:html")
            .should.eventually.match(/<input.*class="input-near-content".*>/);
    });

    it("should look within a custom label", function () {
        return glance.addLabel("customlabel", function (glance) {
                return glance.convertGlanceSelector(".random>div#2").then((wdioSelector)=> glance.browser.element(wdioSelector));
            })
            .get("box9>customlabel>Item 1:html")
            .should.eventually.match(/<div.*class="box9-item-1".*>Item 1<\/div>/);
    });

    it("should find the custom label in container", function () {
        return glance.addLabel("customClassLabel", function (glance) {
                return glance.convertGlanceSelectors("custom-class").then((wdioSelector)=> glance.browser.elements(wdioSelector));
            })
            .get("Container Label For Custom Class>customClassLabel:html")
            .should.eventually.match(/<div.*class="custom-class".*>Inside<\/div>/);
    })

    it("Should limit and narrow the search to containers found", function () {
        return glance.get("reference 1>parent>target:html")
            .should.eventually.match(/<div.*class="target-1".*>target<\/div>/);
    })
});