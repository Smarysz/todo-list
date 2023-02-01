console.clear();

////////// Global frontend JavaScript file

class TODO {
    /**
     * 
     * @param {string | Date | undefined} date Date or empty
     * @returns {string} Time in HH:MM:SS format
     */
    static getTime(date) {

        let d;
        if (arguments.length === 0) d = new Date;
        else d = new Date(date);
        let h = d.getHours();
        let m = d.getMinutes();
        let s = d.getSeconds();

        if (h < 10) h = '0' + h;
        if (m < 10) m = '0' + m;
        if (s < 10) s = '0' + s;

        return h + ':' + m + ':' + s;
    }

    static date(date) {
        let d;
        if (arguments.length === 0) d = new Date;
        else d = new Date(date);
        let month = this.month(d);
        let day = d.getDate();
        if (month < 10) month = '0' + month;
        if (day < 10) day = '0' + day;
        return d.getFullYear() + '-' + month + '-' + day;
    }

    /**
     * 
     * @param {string | Date | undefined} date Date or empty
     * @returns {number} Minute from date
     */
    static minute(date) {
        let d;
        if (arguments.length === 0) d = new Date;
        else d = new Date(date);
        return d.getMinutes();
    }

    /**
     * 
     * @param {string | Date | undefined} date Date or empty
     * @returns {number} Day (1 - 31) from date
     */
    static day(date) {
        let d;
        if (arguments.length === 0) d = new Date;
        else d = new Date(date);
        return d.getDate();
    }

    /**
     * 
     * @param {string | Date | undefined} date Date or empty
     * @returns {number} Month (1 - 12) from date
     */
    static month(date) {
        let d;
        if (arguments.length === 0) d = new Date;
        else d = new Date(date);
        return d.getMonth() + 1;
    }

    /**
     * 
     * @param {string | Date | undefined} date Date or empty
     * @returns {number} Year in YYYY format
     */
    static year(date) {
        let d;
        if (arguments.length === 0) d = new Date;
        else d = new Date(date);
        return d.getFullYear();
    }
}

class TODODB {

    static shutdown() {
        fetch('/exit', {
            method: 'POST'
        });
    }

    static async removeTask(tid) {
        const data = await fetch(`/task/${tid}`, {
            method: 'DELETE'
        });
        return await data.json();
    }

    static async confirmTask(tid) {
        const data = await fetch(`/task/confirm/${tid}`, {
            method: 'POST'
        });
        return await data.json();
    }

    static async uncheckTask(tid) {
        const data = await fetch(`/task/uncheck/${tid}`, {
            method: 'POST'
        });
        return await data.json();
    }

}

const pageID = document.body.dataset.pageid;
const activeItem = document.querySelector(`.menu-item[data-page='${pageID}']`);
if (activeItem) activeItem.classList.add('menu-item-active');

if (document.body.classList.contains('id-exit')) {
    TODODB.shutdown();
}

function removeTaskSetEvent() {
    document.querySelectorAll('.remove-task').forEach(function (e) {
        if (e.dataset.event === 'false') {
            e.addEventListener('click', async function () {
                const data = await TODODB.removeTask(e.dataset.tid);
                if (data.status) {
                    if (this.parentElement.parentElement.parentElement.parentElement.dataset.type === 'done') {
                        document.querySelector('#done-task-count').textContent--;
                    } else {
                        document.querySelector('#undone-task-count').textContent--;
                    }
                    this.parentElement.parentElement.remove();
                }

            });
            e.dataset.event = 'true';
        }
    });
}

// first call of removeTaskSetEvent()
removeTaskSetEvent();

function confirmTaskSetEvent() {
    document.querySelectorAll('.confirm-task').forEach(function (e) {
        if (e.dataset.event === 'false') {
            e.addEventListener('click', async function () {
                const data = await TODODB.confirmTask(e.dataset.tid);
                if (data.status) {
                    const rootTR = this.parentElement.parentElement;
                    const tr = document.createElement('tr');
                    tr.classList.add('done-task');
                    tr.dataset.title = rootTR.dataset.title;
                    tr.dataset.deadline = rootTR.dataset.deadline;
                    tr.dataset.priority = rootTR.dataset.priority;
                    tr.dataset.tid = rootTR.dataset.tid;
                    tr.innerHTML = `<td><a class="any-task" title="Click to show details">${rootTR.dataset.title}</a></td>
                        <td>${rootTR.dataset.deadline}</td>
                        <td><a class="priority-task">${rootTR.dataset.priority}</a></td>
                        <td><a data-tid="${rootTR.dataset.tid}" data-event="false" class="uncheck-task">Uncheck</a></td>
                        <td><a data-tid="${rootTR.dataset.tid}" data-event="false" class="remove-task">Remove</a></td>`;
                    document.querySelector('#done-tasks-table tbody').appendChild(tr);
                    rootTR.remove();
                    uncheckTaskSetEvent();
                    removeTaskSetEvent();
                    document.querySelector('#done-task-count').textContent++;
                    document.querySelector('#undone-task-count').textContent--;
                }
            });
            e.dataset.event = 'true';
        }
    });
}

// first call of confirmTaskSetEvent()
confirmTaskSetEvent();

function uncheckTaskSetEvent() {
    document.querySelectorAll('.uncheck-task').forEach(function (e) {
        if (e.dataset.event === 'false') {
            e.addEventListener('click', async function () {
                const data = await TODODB.uncheckTask(e.dataset.tid);
                if (data.status) {
                    const rootTR = this.parentElement.parentElement;
                    const tr = document.createElement('tr');
                    tr.classList.add('undone-task');
                    tr.dataset.title = rootTR.dataset.title;
                    tr.dataset.deadline = rootTR.dataset.deadline;
                    tr.dataset.priority = rootTR.dataset.priority;
                    tr.dataset.tid = rootTR.dataset.tid;

                    let priorityColor = '';
                    if (rootTR.dataset.deadline && TODO.date(rootTR.dataset.deadline) === TODO.date()) {
                        priorityColor = 'priority-today';
                    }

                    tr.innerHTML = `<td class="undone-title"><a class="any-task" title="Click to show details">${rootTR.dataset.title}</a></td>
                        <td class="undone-deadline ${priorityColor}">${rootTR.dataset.deadline}</td>
                        <td class="undone-priority"><a class="priority-task">${rootTR.dataset.priority}</a></td>
                        <td><a data-tid="${rootTR.dataset.tid}" class="edit-task">Edit</a></td>
                        <td><a data-tid="${rootTR.dataset.tid}" data-event="false" class="confirm-task">Confirm</a></td>
                        <td><a data-tid="${rootTR.dataset.tid}" data-event="false" class="remove-task">Remove</a></td>`;
                    document.querySelector('#undone-tasks-table tbody').appendChild(tr);
                    rootTR.remove();
                    confirmTaskSetEvent();
                    removeTaskSetEvent();
                    document.querySelector('#done-task-count').textContent--;
                    document.querySelector('#undone-task-count').textContent++;
                }
            });
            e.dataset.event = 'true';
        }
    });
}

// first call of uncheckTaskSetEvent()
uncheckTaskSetEvent();

// Search tasks in table
document.querySelectorAll('#undone-search, #done-search').forEach(e => {
    e.value = '';
    e.addEventListener('input', function () {
        const phrase = this.value;
        if (phrase.length > 0) {

            let count = 0;
            document.querySelectorAll(`.${this.dataset.type}-task`).forEach(ee => {
                if (!ee.dataset.title.includes(phrase)) {
                    ee.style.display = 'none';
                } else {
                    count++;
                    ee.style.display = 'table-row';
                }
            });
            if (count === 0) {
                this.classList.add('search-noresults');
                this.title = 'No results';
            }
            else {
                this.classList.remove('search-noresults');
                this.title = '';
            }

        } else {
            count = 0;
            this.classList.remove('search-noresults');
            this.title = '';
            document.querySelectorAll(`.${this.dataset.type}-task`).forEach(ee => {
                ee.style.display = 'table-row';
            });
        }

    });
});