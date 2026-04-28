import { getPages } from "../lib/utils.js";

export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {

    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    let pageCount = 0;

    /**
     * 1. Формирование query (до запроса)
     */
    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        // управление страницами
        if (action) switch (action.name) {
            case 'prev':
                page = Math.max(1, page - 1);
                break;
            case 'next':
                page = Math.min(pageCount || Infinity, page + 1);
                break;
            case 'first':
                page = 1;
                break;
            case 'last':
                page = pageCount || page;
                break;
        }

        return {
            ...query,
            limit,
            page
        };
    };

    /**
     * 2. Обновление UI после получения данных
     */
    const updatePagination = (total, query) => {
        const limit = query.limit;

        pageCount = Math.ceil(total / limit);

        const page = query.page;

        const visiblePages = getPages(page, pageCount, 5);

        pages.replaceChildren(
            ...visiblePages.map(pageNumber => {
                const el = pageTemplate.cloneNode(true);
                return createPage(el, pageNumber, pageNumber === page);
            })
        );

        fromRow.textContent = (page - 1) * limit + 1;
        toRow.textContent = Math.min(page * limit, total);
        totalRows.textContent = total;
    };

    return {
        applyPagination,
        updatePagination
    };
};