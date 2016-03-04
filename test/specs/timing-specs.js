import Glance from '../../src/glance';
let glance;

describe('Timing', function () {
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

    it("should retry finding selector", function () {
        this.timeout(30000)
        return glance.url("file:///" + __dirname + "/examples/timing.html")
            .get("Appearing Item:html").should.eventually.match(/<div.*>Appearing Item<\/div>/);
    });

    it.skip("should retry failed action", function() {
        var retry = 0;
        /*glance.webdriverio.addCommand("glanceElement", function(selector, customLabels, multiple) {
         return glance.webdriverio.searchClient(selector, customLabels, multiple, 0).then(function (id) {
         if(retry == 3)
         return id;

         return glance.execute(function(){
         var button = document.getElementById("button-1");
         button.parentNode.removeChild(button);
         setTimeout(function(){
         document.body.appendChild(button)
         }, 1000)
         }).then(function () {
         ++retry;
         return id;
         });
         });
         }, true);
         */
        glance.url("file:///" + __dirname + "/examples/timing.html");

        glance.click("Button 1");
    });
});