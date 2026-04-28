import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const { tableTemplate, rowTemplate, before, after } = settings;
    const root = cloneTemplate(tableTemplate);

    // #1.2 — дополнительные шаблоны до таблицы
    [...before].reverse().forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.prepend(root[subName].container);
    });

    // #1.2 — дополнительные шаблоны после таблицы
    after.forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.append(root[subName].container);
    });

    // #1.3 — обработка событий
    root.container.addEventListener('change', () => {
        onAction();
    });

    root.container.addEventListener('reset', () => {
        setTimeout(onAction);
    });

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        // #1.1 — преобразование данных в строки
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);

            Object.keys(item).forEach(key => {
                if (key in row.elements) {
                    const el = row.elements[key];

                    if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
                        el.value = item[key];
                    } else {
                        el.textContent = item[key];
                    }
                }
            });

            return row.container;
        });

        root.elements.rows.replaceChildren(...nextRows);
    };

    return { ...root, render };
}