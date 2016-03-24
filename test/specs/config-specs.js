import {createGlance} from "../test-helper"
let glance;

describe("Config", function(){
    before(function(){
        glance = createGlance();
    });

    after(function(){
       glance.end();
    });

    it("should use same baseUrl", function() {
        return glance.url("/file.html");
    });
})