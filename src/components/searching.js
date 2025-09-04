
export function initSearching(searchField) {
    return (query, state, action) => {
        // Если поле поиска пустое, просто возвращаем текущий query
        if (!state[searchField]) {
            return query;
        }
        // Добавляем параметр search к query
        return Object.assign({}, query, { search: state[searchField] });
    };
};
