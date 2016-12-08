import GlanceBrowser from "glance-browser";
import WebdriverIOAdapter from "./adapters/webdriverio-adapter";

export default class Glance extends GlanceBrowser {
    constructor(config = {}) {
        config.newInstance = (config = this.config) => {
            return new Glance({...this, config});
        };

        config.browser = config.browser || new WebdriverIOAdapter(config.driverConfig);
        config.browserExecute = (func, ...args) => {
            let callback = args.pop();

            return new Promise((resolve, reject)=> {
                var rejected = false;
                var timeout = setTimeout(function () {
                    rejected = true;
                    reject("Browser Execute Timeout");
                }, 2000);

                return this.browser.executeAsync(function () {
                    var args = Array.prototype.slice.call(arguments);
                    var func = args.shift();
                    var done = args.pop();
                    args.push(function (e, result) {
                        done(result);
                    });

                    eval("(" + func + ")").apply(null, args);
                }, func.toString(), ...args).then(result => {
                    if(rejected) return;
                    clearTimeout(timeout);
                    return resolve(result)
                }, error => {
                    if(rejected) return;
                    clearTimeout(timeout);
                    return reject(error)
                });
            }).then(res => callback(null, res), callback);
        };

        super(config);
    }
}

