import {getHTMLFromClient} from '../utils/client';

function getHTML(g, elementReference) {
    return g.webdriver.element(elementReference).then(element => {
        return g.webdriver.execute(getHTMLFromClient, element.value)
            .then(res => res.value)
    });
}

export default function(g, selector) {
    return g.find(selector).then((wdioSelector)=> {
        return getHTML(g, wdioSelector)
    });
}