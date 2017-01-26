import Glance from "./glance";
import {Cast} from "glance-browser";

export default class WebdriverCast extends Cast {
    constructor(options) {
        options.glance = new Glance(options);
        super(options);
    }
}