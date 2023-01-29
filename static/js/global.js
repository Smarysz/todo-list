console.clear();

class TODO {

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
    TODO.shutdown();
}

document.querySelectorAll('.remove-task').forEach(function (e) {
    e.addEventListener('click', async function () {
        const data = await TODO.removeTask(e.dataset.tid);
        if (data.status) {
            if (this.parentElement.parentElement.parentElement.parentElement.dataset.type === 'done') {
                document.querySelector('#done-task-count').textContent--;
            } else {
                document.querySelector('#undone-task-count').textContent--;
            }
            this.parentElement.parentElement.remove();
        }

    });
});

function confirmTaskSetEvent() {
    document.querySelectorAll('.confirm-task').forEach(function (e) {
        if (e.dataset.event === 'false') {
            e.addEventListener('click', async function () {
                const data = await TODO.confirmTask(e.dataset.tid);
                if (data.status) {
                    const rootTR = this.parentElement.parentElement;
                    const tr = document.createElement('tr');
                    tr.dataset.tid = rootTR.dataset.tid;
                    tr.dataset.title = rootTR.dataset.title;
                    tr.dataset.deadline = rootTR.dataset.deadline;
                    tr.dataset.priority = rootTR.dataset.priority;
                    tr.innerHTML = `<td>${rootTR.dataset.title}</td>
                        <td>${rootTR.dataset.deadline}</td>
                        <td><a class="priority-task">${rootTR.dataset.priority}</a></td>
                        <td><a data-tid="${rootTR.dataset.tid}" data-event="false" class="uncheck-task">Uncheck</a></td>
                        <td><a data-tid="${rootTR.dataset.tid}" class="remove-task">Remove</a></td>`;
                    document.querySelector('#done-tasks-table tbody').appendChild(tr);
                    rootTR.remove();
                    uncheckTaskSetEvent();
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
                const data = await TODO.uncheckTask(e.dataset.tid);
                if (data.status) {
                    const rootTR = this.parentElement.parentElement;
                    const tr = document.createElement('tr');
                    tr.dataset.tid = rootTR.dataset.tid;
                    tr.dataset.title = rootTR.dataset.title;
                    tr.dataset.deadline = rootTR.dataset.deadline;
                    tr.dataset.priority = rootTR.dataset.priority;
                    tr.innerHTML = `<td class="undone-title">${rootTR.dataset.title}</td>
                        <td class="undone-deadline">${rootTR.dataset.deadline}</td>
                        <td class="undone-priority"><a class="priority-task">${rootTR.dataset.priority}</a></td>
                        <td><a data-tid="${rootTR.dataset.tid}" class="edit-task">Edit</a></td>
                        <td><a data-tid="${rootTR.dataset.tid}" data-event="false" class="confirm-task">Confirm</a></td>
                        <td><a data-tid="${rootTR.dataset.tid}" class="remove-task">Remove</a></td>`;
                    document.querySelector('#undone-tasks-table tbody').appendChild(tr);
                    rootTR.remove();
                    confirmTaskSetEvent();
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