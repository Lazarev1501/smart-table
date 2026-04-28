import './fonts/ys-display/fonts.css'
import './style.css'

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

/**
 * API
 */
const API = initData(sourceData);

/**
 * TABLE
 */
const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'filter', 'header'],
    after: ['pagination']
}, render);

/**
 * STATE
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));

    return {
        ...state,
        rowsPerPage: parseInt(state.rowsPerPage),
        page: parseInt(state.page ?? 1)
    };
}

/**
 * SEARCH
 */
const applySearching = initSearching(
    sampleTable.search.elements,
    'search'
);

/**
 * FILTER
 */
const { applyFiltering, updateIndexes } = initFiltering(
    sampleTable.filter.elements,
    {}
);

/**
 * SORT
 */
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

/**
 * PAGINATION
 */
const { applyPagination, updatePagination } = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');

        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;

        return el;
    }
);

/**
 * RENDER PIPELINE
 */
async function render(action) {
    const state = collectState();

    let query = {};

    // SEARCH
    query = applySearching(query, state, action);

    // FILTER
    query = applyFiltering(query, state, action);

    // SORT
    query = applySorting(query, state, action);

    // PAGINATION
    query = applyPagination(query, state, action);

    // API CALL
    const { total, items } = await API.getRecords(query);

    // UI UPDATE
    updatePagination(total, query);
    sampleTable.render(items);
}

/**
 * INIT
 */
async function init() {
    const indexes = await API.getIndexes();

    updateIndexes({
        searchBySeller: indexes.sellers
    });

    render();
}

/**
 * MOUNT
 */
const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

/**
 * START
 */
init();