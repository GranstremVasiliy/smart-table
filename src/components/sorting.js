import { sortMap } from "../lib/sort.js";

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // @todo: #3.1 — запомнить выбранный режим сортировки
            const currentSort = action.dataset.value || 'none';
            const nextSort = sortMap[currentSort];
            action.dataset.value = nextSort;
            field = action.dataset.field;
            order = nextSort; // используем nextSort, чтобы передавать корректное направление
            // @todo: #3.2 — сбросить сортировки остальных колонок
            columns.forEach(column => {
                if(column.dataset.field !== action.dataset.field) {
                    column.dataset.value = 'none';
                }
            });
        } else {
            // @todo: #3.3 — получить выбранный режим сортировки
            columns.forEach(column => {                       
                if (column.dataset.value !== 'none') {        
                    field = column.dataset.field;           
                    order = column.dataset.value;            
                }
            });
        }

        // формируем параметр sort для query
        const sort = (field && order !== 'none') ? `${field}:${order}` : null;  // сохраним в переменную параметр сортировки в виде field:direction

        return sort ? Object.assign({}, query, { sort }) : query; // по общему принципу, если есть сортировка, добавляем, если нет, то не трогаем query
    }
} 
