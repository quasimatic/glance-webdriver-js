import Glance from '../../src/glance';
let glance;

describe("Config", function(){
    before(function(){
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

    it("should use same baseUrl", function() {
        return glance.url("/file.html");
    });
})