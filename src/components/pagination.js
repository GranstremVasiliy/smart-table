import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true);    // в качестве шаблона берём первый элемент из контейнера со страницами
    pages.firstElementChild.remove();
        

    let pageCount;

    const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page;
    // @todo: #2.6 — обработать действия
        if(action) switch (action.name) {
            case 'prev' : page = Math.max(1, page - 1);
            break;
            case 'next' : page = Math.min(pageCount, page + 1);
            break;
            case 'last' : page = pageCount;
            break;
            case 'first' : page = 1;
            break;
        };
          return Object.assign({}, query, { // добавим параметры к query, но не изменяем исходный объект
        limit,
        page
    });    
}

    const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit);
 // @todo: #2.4 — получить список видимых страниц и вывести их
        const visiblePages = getPages(page, pageCount, 5);
    pages.replaceChildren(...visiblePages.map(pageNumber => {        // перебираем их и создаём для них кнопку
    const el = pageTemplate.cloneNode(true);                    // клонируем шаблон, который запомнили ранее
    return createPage(el, pageNumber, pageNumber === page);        // вызываем колбэк из настроек, чтобы заполнить кнопку данными
})) 
        // @todo: #2.5 — обновить статус пагинации
    fromRow.textContent = (page - 1) * limit + 1;
    toRow.textContent = Math.min((page * limit), total);
    totalRows.textContent = total;
    };
    return {
    updatePagination,
    applyPagination
}
};
