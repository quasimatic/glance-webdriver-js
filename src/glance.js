import GlanceBrowser from "glance-browser";
import WebdriverIOAdapter from "./adapters/webdriverio-adapter";

export default class Glance extends GlanceBrowser {
    constructor(config = {}) {
        config.newInstance = (config = this.config) => {
            return new Glance({...this, config});
        };

        config.browser = config.browser || new WebdriverIOAdapter(config.driverConfig);

        super(config);
    }
}

