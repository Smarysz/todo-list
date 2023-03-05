console.clear();

////////// Global frontend JavaScript file

const pageID = document.body.dataset.pageid;
const activeItem = document.querySelector(`.menu-item[data-page='${pageID}']`);
if (activeItem) activeItem.classList.add('menu-item-active');

if (document.body.classList.contains('id-exit')) {
    TODODB.shutdown();
}

function removeTaskSetEvent() {
    document.querySelectorAll('.remove-task').forEach(function (e) {
        if (e.dataset.event === 'false') {
            e.addEventListener('click', function () {
                confirmRemoveYes.dataset.tid = e.dataset.tid;
                TODO.openWindow('confirm-remove');
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
                    tr.innerHTML = `<td class="done-title"><a class="any-task" title="Click to show details">${rootTR.dataset.title}</a></td>
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

document.querySelectorAll('.modal-window-x').forEach(e => {
    e.addEventListener('click', function () {
        TODO.closeWindow(e.dataset.name);
    });
});

const taskName = document.querySelector('#task-name');
const deadlineDate = document.querySelector('#task-deadline-date');
const deadlineTime = document.querySelector('#task-deadline-time');
const taskPriority = document.querySelector('#task-priority');
const taskDescription = document.querySelector('#task-description');

const newTaskBtn = document.querySelector('#new-task');
if (newTaskBtn) {
    newTaskBtn.addEventListener('click', function () {
        taskName.value = '';
        taskName.title = '';
        taskName.classList.remove('input-error');
        deadlineDate.value = '';
        deadlineDate.title = '';
        deadlineDate.classList.remove('input-error');
        deadlineTime.value = '';
        deadlineTime.title = '';
        deadlineTime.classList.remove('input-error');
        taskPriority.value = 0;
        taskPriority.title = '';
        taskPriority.classList.remove('input-error');
        taskDescription.value = '';
        TODO.openWindow('new-task');
    });
}

if (taskName) {
    taskName.addEventListener('input', function () {
        if (this.value.length) {
            this.classList.remove('input-error');
            this.title = '';
        }
    });
}

if (taskPriority) {
    taskPriority.addEventListener('input', function () {
        if (this.value != 0) {
            this.classList.remove('input-error');
            this.title = '';
        }
    });
}

if (deadlineDate) {
    deadlineDate.addEventListener('input', function () {
        if (this.value) {
            this.classList.remove('input-error');
            this.title = '';
        }
    });
}

if (deadlineTime) {
    deadlineTime.addEventListener('input', function () {
        deadlineDate.classList.remove('input-error');
        deadlineDate.title = '';
    });
}

if (taskDescription) {
    taskDescription.addEventListener('input', function () {
        if (this.value.length <= 65535) {
            this.classList.remove('input-error');
            this.title = '';
        }
        if (this.value.length > 65535) {
            this.classList.add('input-error');
            this.title = 'Maximum length is 65535';
        }
    });
}

const createTaskBtn = document.querySelector('#create-task');
if (createTaskBtn) {
    createTaskBtn.addEventListener('click', async function () {
        let isValid = true;
        const name = taskName.value;
        const date = deadlineDate.value;
        const time = deadlineTime.value;
        const priority = taskPriority.value;
        const description = taskDescription.value;

        if (!name.length) {
            taskName.classList.add('input-error');
            taskName.title = 'Task name can not be empty';
            isValid = false;
        }

        if (priority == 0) {
            taskPriority.classList.add('input-error');
            taskPriority.title = 'Priority can not be empty';
            isValid = false;
        }

        if (!date && time) {
            deadlineDate.classList.add('input-error');
            deadlineDate.title = 'Date can not be empty if time is set';
            isValid = false;
        }

        if (description.length > 65535) {
            taskDescription.classList.add('input-error');
            taskDescription.title = 'Maximum length is 65535';
            isValid = false;
        }

        let fullDate = date + ' ' + time;
        fullDate = fullDate.trim();

        const date1 = +(new Date(fullDate));
        const date2 = +(new Date);

        if (date2 - date1 >= 0) {
            deadlineDate.classList.add('input-error');
            deadlineDate.title = 'Date must be current';
            isValid = false;
        }

        if (!isValid) return;

        const added = await TODODB.addTask({
            title: name,
            deadline: fullDate,
            priority,
            description
        });

        if (added.status) {
            TODO.closeWindow('new-task');
            TODO.openWindow('new-task-ok');
        } else {
            TODO.openWindow('new-task-error');
        }
    });
}

document.querySelectorAll('.modal-window .ok-btn[data-name]').forEach(e => {
    e.addEventListener('click', function () {
        TODO.closeWindow(this.dataset.name);
    });
});

const sdTaskTitle = document.querySelector('#sd-task-title');
const sdTaskDescription = document.querySelector('#sd-task-description');

document.querySelectorAll('.tasks-table').forEach(e => {
    e.addEventListener('click', function (event) {
        if (event.target.classList.contains('any-task')) {
            const tid = event.target.parentElement.parentElement.dataset.tid;
            const data = JSON.parse(document.querySelector('.tasks-data').textContent);
            const task = data.find(e => e.ID === parseInt(tid));
            sdTaskTitle.textContent = task.title;
            sdTaskDescription.textContent = task.description;
            TODO.openWindow('show-details');
        }
    });
});

const confirmRemoveYes = document.querySelector('#remove-task-yes');

if (confirmRemoveYes) {
    confirmRemoveYes.addEventListener('click', async function () {
        const data = await TODODB.removeTask(confirmRemoveYes.dataset.tid);
        if (data.status) {
            if (this.parentElement.parentElement.parentElement.parentElement.dataset.type === 'done') {
                document.querySelector('#done-task-count').textContent--;
            } else {
                document.querySelector('#undone-task-count').textContent--;
            }
            document.querySelector(`.tasks-table tr[data-tid='${confirmRemoveYes.dataset.tid}']`).remove();
            TODO.closeWindow('confirm-remove');
        }
        confirmRemoveYes.dataset.tid = '';
    });
}

const confirmRemoveNo = document.querySelector('#remove-task-no');

if (confirmRemoveNo) {
    confirmRemoveNo.addEventListener('click', function () {
        confirmRemoveYes.dataset.tid = '';
        TODO.closeWindow('confirm-remove');
    });

    document.querySelector('.modal-window[data-name=confirm-remove] .modal-window-x').addEventListener('click', function () {
        confirmRemoveYes.dataset.tid = '';
    });
}