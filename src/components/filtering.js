export function initFiltering(elements, indexes) {

    /**
     * 1. заполнение select'ов (после получения indexes)
     */
    const updateIndexes = (indexes) => {
        Object.keys(indexes).forEach((key) => {
            elements[key].append(
                ...Object.values(indexes[key]).map(name => {
                    const option = document.createElement('option');
                    option.textContent = name;
                    option.value = name;
                    return option;
                })
            );
        });
    };

    /**
     * 2. формирование query
     */
    const applyFiltering = (query, state, action) => {

        // очистка фильтра
        if (action && action.name === 'clear') {
            const field = action.dataset.field;

            const wrapper = action.closest('label') || action.parentElement;
            const input = wrapper.querySelector('input');

            if (input) input.value = '';
            if (state[field] !== undefined) state[field] = '';
        }

        const filter = {};

        Object.keys(elements).forEach(key => {
            const el = elements[key];

            if (!el) return;

            if (['INPUT', 'SELECT'].includes(el.tagName) && el.value) {
                filter[`filter[${el.name}]`] = el.value;
            }
        });

        return Object.keys(filter).length
            ? { ...query, ...filter }
            : query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}