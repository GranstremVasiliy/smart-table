export function initFiltering(elements) {
    // #4.1 — заполнить выпадающие списки опциями
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach(elementName => {
            elements[elementName].append(
                ...Object.values(indexes[elementName]).map(name => {
                    const el = document.createElement('option');
                    el.value = name;
                    el.textContent = name;
                    return el;
                                }));
        });
    };

    const applyFiltering = (query, state, action) => {
        // #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const parent = action.parentElement;
            const input = parent.querySelector('input, select');
            if (input) {
                input.value = '';
                const fieldName = action.dataset.field;
                if (fieldName && state[fieldName] !== undefined) {
                    state[fieldName] = '';
                }
            }
        }

        // #4.5 — собрать фильтры для query
        const filter = {};
        Object.keys(elements).forEach(key => {
            if(elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) {
                filter[`filter[${elements[key].name}]`] = elements[key].value;
            }
        }
    })

        // вернуть новый query с фильтрами
        return Object.keys(filter).length
            ? Object.assign({}, query, filter)
            : query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}
