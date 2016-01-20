describe("config", function(){
    it("should use same baseUrl", function*() {
        yield glance.url("/file.html");
    });
})