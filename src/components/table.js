import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);
// @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    before.reverse().forEach(subName => {
    root[subName] = cloneTemplate(subName);
    root.container.prepend(root[subName].container);
});
    after.forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.append(root[subName].container);
    });
// @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener('change', () => {
        onAction();
    });

    root.container.addEventListener('reset', (event) => {
        setTimeout(onAction, 0);
    });

    root.container.addEventListener('submit', (event) => {
        event.preventDefault();
        onAction(event.submitter);
    });

    

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate('row');
        Object.keys(item).forEach(key => {
            const el = row.elements[key];
            if (!el) return;
            if(el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
                el.value = item[key] ?? '';
            } else {
                el.textContent = item[key] ?? ''
            }
        });  
        return row.container;
     }); 
    root.elements.rows.replaceChildren(...nextRows);
    }
    
    return {...root, render};
}