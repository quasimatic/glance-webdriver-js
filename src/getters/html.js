import {getHTMLFromClient} from '../utils/client';

function getHTML(g, elementReference) {
    return g.browser.element(elementReference).then(element => {
        return g.browser.execute(getHTMLFromClient, element.value)
            .then(res => res.value)
    });
}

export default function(g, selector) {
    return g.find(selector).then((wdioSelector)=> {
        return getHTML(g, wdioSelector)
    });
}