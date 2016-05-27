import {getValueFromClient} from '../utils/client';

export default function(g, selector) {
    selector = selector.replace(/:value$/, "");
    return g.find(selector).then((wdioSelector)=> g.browser.getValue(wdioSelector));
}