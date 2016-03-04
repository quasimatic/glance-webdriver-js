import Glance from '../../src/glance';
let glance;

describe('Error Messages', function () {
    this.timeout(5000)
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
        return glance.url("file:///" + __dirname + "/examples/errors.html")
    });

    it("should show correct error within a chain", function () {
        return glance
            .click('non-existing-button-1')
            .click('non-existing-button-2')
            .should.be.rejectedWith("Element not found: non-existing-button-1");

    });
});