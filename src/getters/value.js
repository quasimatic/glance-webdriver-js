import {getValueFromClient} from '../client';

export default function(g, selector) {
    selector = selector.replace(/:value$/, "");
    return g.find(selector).then((wdioSelector)=> g.webdriver.getValue(wdioSelector));
}