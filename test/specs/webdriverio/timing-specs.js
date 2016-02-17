describe('Timing', function() {
    before(function*() {
        glance = new Glance(browser);
    });

    it("should retry finding selector", function*() {
        this.timeout(30000)
        yield glance.url("file:///" + __dirname + "/examples/timing.html")

        var content = yield glance.get("Appearing Item>html")
        content.should.match(/<div.*>Appearing Item<\/div>/);
    });

    it.skip("should retry failed action", function*() {
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
        yield glance.url("file:///" + __dirname + "/examples/timing.html");

        yield glance.click("Button 1");
    });
});