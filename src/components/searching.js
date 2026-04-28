export function initSearching(searchField) {

    return (query, state, action) => {

        const value = state?.[searchField];

        // если поле пустое — ничего не добавляем
        if (!value) return query;

        return {
            ...query,
            search: value
        };
    };
}