import Glance from '../../src/glance';
let glance;

describe('Wait for change', function () {
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
    });

    it("should wait til change", function () {
        return glance.url("file:///" + __dirname + "/examples/watch-for-change.html")
            .watchForChange("text-1")
            .get("text-1").should.eventually.equal("text has changed");
    });

    it("should wait until watched item is changed", function () {
        return glance.url("file:///" + __dirname + "/examples/wait-for-change.html")
            .watchForChange("watch-1")
            .waitForChange("watch-1")
            .get("text-1").should.eventually.equal("parent has changed");
    });
});