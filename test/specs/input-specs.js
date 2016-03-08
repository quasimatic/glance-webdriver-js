import Glance from '../../src/glance';
let glance;

describe('Input get', function () {
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
        return glance.url("file:///" + __dirname + "/examples/get.html")
    })

    it("should get value", function () {
        return glance.get("input-1").should.eventually.equal('value 1');
    });

    it("should get text", function () {
        return glance.get("label-1").should.eventually.equal('label 1');
    });

    it("should get selected text by default", function () {
        return glance.get("select-1").should.eventually.equal('text2');
    });

    it("should get selected value", function () {
        return glance.get("select-1:value").should.eventually.equal('value2');
    });

    it("should get select option text by default", function () {
        return glance.get("select-1>text1").should.eventually.equal('text1');
    });

    it("should get select option value", function () {
        return glance.get("select-1>text1:value").should.eventually.equal('value1');
    });

    it("should get using a custom label", function () {
        return glance.addGetter("complex-control-1", function (selector) {
                return this.get(selector + ">special-widget>span")
            })
            .get("wrapper-1>special-container:complex-control-1").should.eventually.equal('special value 1');
    });
});

describe('Input set', function () {
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
        return glance.url("file:///" + __dirname + "/examples/set.html")
    })

    it("should set value", function () {
        return glance.set("input-1", "value 1")
            .get("input-1").should.eventually.equal('value 1');
    });

    it.skip("should not set text", function () {
        return glance.set("label-1", "label 1").catch(function (err) {
            err.message.should.equal("label-1 text not changable");
        })
    });

    it("should set selected text by default", function () {
        return glance.set("select-1", "text2")
            .get("select-1").should.eventually.equal('text2');
    });

    it("should set selected value", function () {
        return glance.set("select-1:value", "value3")
            .get("select-1:value").should.eventually.equal('value3');
    });

    it("should set using a custom label", function () {
        return glance.addSetter("complex-control-1", function (selector, value) {
                return this.set(selector + ">wrapper-1>special-widget>input", "special value 1")
            })
            .set("special-container:complex-control-1", "special value 1")
            .get("special-container>special-widget>input").should.eventually.equal('special value 1');
    });


    it("should set a non element custom label", function () {
        return glance.addSetter("non-element", function (selector, value) {
                return this.set("wrapper-1>special-widget-2>input", value)
            })
            .set("non-element", "special value 2")
            .get("special-container>special-widget-2>input").should.eventually.equal('special value 2');
    });

    it("should reject if it can't set a readonly element", function (done) {
        this.timeout(30000)

        glance.set("readonly-element", "value 1").catch(function (err) {
            try {
                err.message.should.equal("No setter found for: readonly-element")
                done();
            }
            catch (err) {
                done(err)
            }
        });
    });


    it("should reject if it can't find a setter", function (done) {
        this.timeout(30000)

        glance.set("non-existing", "value 1").catch(function (err) {
            try {
                err.message.should.equal("Can't set because Element not found: non-existing")
                done();
            }
            catch (err) {
                done(err)
            }
        });
    });

    it("should reject if it finds duplicates", function (done) {
        this.timeout(30000)
        glance.set("duplicate-element", "value 1").catch(function (err) {
            try {
                err.message.should.equal("Can't set because Found 2 duplicates for: duplicate-element")
                done();
            }
            catch (err) {
                done(err)
            }
        });
    });
});

describe("page setters", function () {
    it("should change the url by a setter", function () {
        return glance.set("$url", "file:///" + __dirname + "/examples/set-2.html")
            .then(function () {
                return glance.webdriverio.getTitle().should.eventually.equal("NEW SET TEST PAGE");
            })
    });
});