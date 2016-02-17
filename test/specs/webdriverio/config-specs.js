describe("Config", function(){
    before(function(){
        glance = new Glance(browser);
    });

    it("should use same baseUrl", function*() {
        yield glance.url("/file.html");
    });
})