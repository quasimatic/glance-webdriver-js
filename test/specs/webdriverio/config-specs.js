describe("config", function(){
    it.only("should use same baseUrl", function*() {
        yield glance.url("/file.html");
    });
})