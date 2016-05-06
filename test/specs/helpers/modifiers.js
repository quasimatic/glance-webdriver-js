let nextClosestSibling = {
    "next-closest-sibling": {
        browser: true,
        filter: function(elements, config) {
            var scope = config.scope;
            if (!scope) return [];

            var sibling = scope.nextElementSibling;
            
            while (sibling) {
                if (elements.filter(e => e == sibling).length > 0)
                    return [sibling];

                sibling = sibling.nextElementSibling;
            }

            return [];
        }
    }
};

export {nextClosestSibling};