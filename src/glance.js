import GlanceCommon from "glance-common";
import WebdriverIOAdapter from "./adapters/webdriverio-adapter";

export default class Glance extends GlanceCommon {
    constructor(config = {}) {
        config.newInstance = function (config = this.config) {
            return new Glance({...this, config});
        };

        config.browser = config.browser || new WebdriverIOAdapter(config.driverConfig);
        config.browserExecute = (func, ...args) => {
            let callback = args.pop();

            return this.browser.executeAsync(function () {
                var args = Array.prototype.slice.call(arguments);
                var func = args.shift();
                var done = args.pop();
                args.push(function (err, result) {
                    done(result);
                });

                eval("(" + func + ")").apply(null, args);
            }, func.toString(), ...args).then(res => callback(null, res), callback);
        }

        super(config);
    }
}