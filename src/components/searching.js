import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const compare = createComparison(
        {
            skipEmptyTargetValues: true
        },
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    );
    return (data, state, action) => {
        if (action && action.name === 'clear' && action.dataset.field === searchField) {
            const input = action.parentElement.querySelector('input');
            if (input) input.value = '';
            state[searchField] = '';
            }
            return data.filter(row => compare(row, state));
    }
}