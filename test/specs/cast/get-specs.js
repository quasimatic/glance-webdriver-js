import {createGlance} from "../../test-helper"
import Cast from '../../../src/cast';

let cast;

let options = {
    driverConfig: {
        capabilities: [{
            browserName: 'phantomjs'
        }],
        logLevel: 'silent',
        coloredLogs: true,
        screenshotPath: './errorShots/',
        baseUrl: 'http://localhost',
        waitforTimeout: 5000
    }
}

describe('Cast getters', function () {
    this.timeout(5000);

    before(function () {
        cast = new Cast(options);
    });

    after(function () {
        cast.end();
    });

    it("should get values that are null", function () {
        return cast.apply({
                "$url": "file:///" + __dirname + "/examples/get.html",
                "text-1": null,
                "text-2": null
            })
            .should.eventually.deep.equal({
                "$url": "file:///" + __dirname + "/examples/get.html",
                "text-1": "value-1",
                "text-2": "value-2"
            })
    });

    it.skip("should get value after set", function () {
        return cast.apply({
                "$url": "file:///" + __dirname + "/examples/get.html",
                "text-different-than-set": "set value"
            })
            .should.eventually.deep.equal({
                "$url": "file:///" + __dirname + "/examples/get.html",
                "text-different-than-set": "another value"
            })
    })
});