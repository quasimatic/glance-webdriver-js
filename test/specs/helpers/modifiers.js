function nextClosestSibling() {
    glanceSelector.addModifiers({
        "next-closest-sibling": {
            filter: function(elements, context) {
                var sibling = context.nextElementSibling;

                while (sibling) {
                    if (elements.filter(e => e == sibling).length > 0)
                        return [sibling];

                    sibling = sibling.nextElementSibling;
                }

                return [];
            }
        }
    })
}

export {nextClosestSibling};