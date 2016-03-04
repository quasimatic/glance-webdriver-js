import Glance from '../../src/glance';
let glance;

describe('Window', function () {
    this.timeout(10000);

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

    it("should change focus to popup window", function () {
        glance.webdriverio.addCommand("activateNewWindow", function () {
            return this.pause(1000).getTabIds().then(function (handles) {
                return this.getCurrentTabId().then(function (current) {
                    if (handles[0] == current)
                        return this.window(handles[1])
                    else
                        return this.window(handles[0])
                })
            })
        });

        glance.webdriverio.addCommand("activateOnlyWindow", function () {
            return this.pause(1000).getTabIds()
                .then(function (handles) {
                    return this.window(handles[0])
                })
        });

        return glance.url("file:///" + __dirname + "/examples/window.html")
            .click("Popup")
            .then(function () {
                return glance.webdriverio.activateNewWindow()
                    .then(function () {
                        return glance.get("Popup Window:html").should.eventually.match(/<div.*>Popup Window<\/div>/);
                    })
            })
            .click("Close")
            .then(function () {
                return glance.webdriverio.activateOnlyWindow();
            })
            .get("Popup:html").should.eventually.match(/<a.*href="\.\/new-window.html" target="_blank".*>Popup<\/a>/);
    });
})
