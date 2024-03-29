console.clear();

////////// Global frontend JavaScript file //////////

const pageID = document.body.dataset.pageid;
const activeItem = document.querySelector(`.menu-item[data-page='${pageID}']`);

const doneTaskTable = document.querySelector('#done-tasks-table');
const undoneTaskTable = document.querySelector('#undone-tasks-table');

if (activeItem) activeItem.classList.add('menu-item-active');

if (document.body.classList.contains('id-exit')) {
    TODODB.shutdown();
}

function deleteTaskSetEvent() {
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

// first call of deleteTaskSetEvent()
deleteTaskSetEvent();

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
                    deleteTaskSetEvent();
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
                    deleteTaskSetEvent();
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

        const added = await TODODB.addTask({ title: name, deadline: fullDate, priority, description });

        if (added.status) {
            TODO.closeWindow('new-task');
            TODO.openWindow('new-task-ok');
            TODO.addTaskToTable({ title: name, deadline: fullDate, priority, tid: added.tid, content: description });
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
            const task = TODO.tasks.find(e => e.ID === parseInt(tid));
            sdTaskTitle.textContent = task.title;
            sdTaskDescription.textContent = task.description;
            TODO.openWindow('show-details');
        }
    });
});

const confirmRemoveYes = document.querySelector('#remove-task-yes');

if (doneTaskTable) {
    doneTaskTable.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-task')) {
            confirmRemoveYes.dataset.type = 'done';
        }
    });
}

if (undoneTaskTable) {
    undoneTaskTable.addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-task')) {
            editTaskSave.dataset.tid = e.target.dataset.tid;
            const task = TODO.tasks.find(el => el.ID == e.target.dataset.tid);
            if (task) {
                editTaskName.value = task.title;
                if (task.deadline.toUpperCase() !== 'NULL') {
                    const deadline = task.deadline.split(' ');
                    editTaskDeadlineDate.value = deadline[0] || '';
                    editTaskDeadlineTime.value = deadline[1] || '';
                }
                editTaskPriority.value = task.priority_id;
                editTaskDescription.value = task.description;
                TODO.openWindow('edit-task');
            }
        }
    });
}

const editTaskSave = document.querySelector('#edit-task-save');
const editTaskX = document.querySelector('.modal-window[data-name=edit-task] .modal-window-x');
const editTaskName = document.querySelector('#edit-task-name');
const editTaskDeadlineDate = document.querySelector('#edit-task-deadline-date');
const editTaskDeadlineTime = document.querySelector('#edit-task-deadline-time');
const editTaskPriority = document.querySelector('#edit-task-priority');
const editTaskDescription = document.querySelector('#edit-task-description');

if (editTaskX) {

    function clearInputs() {
        editTaskName.value = '';
        editTaskDeadlineDate.value = '';
        editTaskDeadlineTime.value = '';
        editTaskPriority.value = 0;
        editTaskDescription.value = '';
    }

    clearInputs();

    editTaskName.addEventListener('input', function () {
        if (this.value.length) {
            this.classList.remove('input-error');
            this.title = '';
        }
    });

    editTaskDeadlineTime.addEventListener('input', function () {
        editTaskDeadlineDate.classList.remove('input-error');
        editTaskDeadlineDate.title = '';
    });

    editTaskDeadlineDate.addEventListener('input', function () {
        if (this.value) {
            this.classList.remove('input-error');
            this.title = '';
        }
    });

    editTaskPriority.addEventListener('input', function () {
        if (this.value != 0) {
            this.classList.remove('input-error');
            this.title = '';
        }
    });

    editTaskDescription.addEventListener('input', function () {
        if (this.value.length > 65535) {
            this.classList.add('input-error');
            this.title = 'Maximum length is 65535';
        }
        if (this.value.length <= 65535) {
            this.classList.remove('input-error');
            this.title = '';
        }
    });

    editTaskSave.addEventListener('click', async function () {
        document.querySelectorAll('.modal-window[data-name=edit-task] .input').forEach(e => {
            e.classList.remove('input-error');
            e.title = '';
        });

        let isValid = true;
        const name = editTaskName.value;
        const date = editTaskDeadlineDate.value;
        const time = editTaskDeadlineTime.value;
        const priority = editTaskPriority.value;
        const description = editTaskDescription.value;

        if (!name.length) {
            editTaskName.classList.add('input-error');
            editTaskName.title = 'Task name can not be empty';
            isValid = false;
        }

        if (priority == 0) {
            editTaskPriority.classList.add('input-error');
            editTaskPriority.title = 'Priority can not be empty';
            isValid = false;
        }

        if (!date && time) {
            editTaskDeadlineDate.classList.add('input-error');
            editTaskDeadlineDate.title = 'Date can not be empty if time is set';
            isValid = false;
        }

        if (description.length > 65535) {
            editTaskDescription.classList.add('input-error');
            editTaskDescription.title = 'Maximum length is 65535';
            isValid = false;
        }

        let fullDate = date + ' ' + time;
        fullDate = fullDate.trim();

        const date1 = +(new Date(fullDate));
        const date2 = +(new Date);

        if (date2 - date1 >= 0) {
            editTaskDeadlineDate.classList.add('input-error');
            editTaskDeadlineDate.title = 'Date must be current';
            isValid = false;
        }

        let tid = String(parseInt(this.dataset.tid));

        if (!isValid || tid == 'NaN') return;

        tid = parseInt(tid);
        const updated = await TODODB.updateTask({ tid, title: name, deadline: fullDate, priority, description });

        TODO.closeWindow('edit-task');

        if (updated.status) {
            TODO.openWindow('edit-task-ok');
            TODO.updateTaskInTable({ title: name, deadline: fullDate, priority, tid, content: description });
        } else {
            TODO.openWindow('edit-task-error');
        }

    });

    editTaskX.addEventListener('click', function () {
        document.querySelectorAll('.modal-window[data-name=edit-task] .input').forEach(e => {
            e.classList.remove('input-error');
            e.title = '';
        });
        clearInputs();
    });
}

if (confirmRemoveYes) {
    confirmRemoveYes.addEventListener('click', async function () {
        const data = await TODODB.deleteTask(confirmRemoveYes.dataset.tid);
        if (data.status) {
            if (confirmRemoveYes.dataset.type === 'done') {
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

const notesContainer = document.querySelector('#note-container-items');
const newNoteBtn = document.querySelector('#new-note');
const createNoteBtn = document.querySelector('#create-note');
const noteName = document.querySelector('#note-name');
const noteDescription = document.querySelector('#note-description');
const removeNoteYes = document.querySelector('#remove-note-yes');
const removeNoteNo = document.querySelector('#remove-note-no');
const editNoteName = document.querySelector('#edit-note-name');
const editNoteDescription = document.querySelector('#edit-note-description');
const editNoteSave = document.querySelector('#edit-note-save');
const sdNoteTitle = document.querySelector('#sd-note-title');
const sdNoteDescription = document.querySelector('#sd-note-description');

if (newNoteBtn) {

    editNoteSave.addEventListener('click', async function () {
        const name = editNoteName.value;
        const content = editNoteDescription.value;
        const nid = parseInt(this.dataset.nid);
        let isValid = true;
        if (!name) {
            editNoteName.classList.add('input-error');
            editNoteName.title = 'Note name can not be empty';
            isValid = false;
        }
        if (content.length > 65535) {
            editNoteDescription.classList.add('input-error');
            editNoteDescription.title = 'Maximum length is 65535';
            isValid = false;
        }

        if (!isValid) return;

        const updated = await TODODB.updateNote({ nid, title: name, content });

        if (updated.status) {
            const note = TODO.notes.find(note => note.ID == nid);
            note.title = name;
            note.content = content;
            document.querySelector(`.note-banner-title[data-nid="${nid}"]`).textContent = name;
            TODO.closeWindow('edit-note');
        }
    });

    editNoteDescription.addEventListener('input', function () {
        if (this.value.length <= 65535) {
            this.classList.remove('input-error');
            this.title = '';
        }
    });

    editNoteName.addEventListener('input', function () {
        if (this.value.length) {
            this.classList.remove('input-error');
            this.title = '';
        }
    });

    notesContainer.addEventListener('click', function (e) {
        if (!e.target.classList.contains('edit-controls-container') && !e.target.classList.contains('edit-note-x') && !e.target.classList.contains('delete-note-x')) {
            const nid = parseInt(e.target.dataset.nid);
            if(!nid) return;
            const note = TODO.notes.find(note => note.ID == nid);
            sdNoteTitle.textContent = note.title;
            sdNoteDescription.textContent = note.content;
            TODO.openWindow('show-note-details');
        }
        if (e.target.classList.contains('delete-note-x')) {
            removeNoteYes.dataset.nid = e.target.dataset.nid;
            TODO.openWindow('note-confirm-remove');
        }
        if (e.target.classList.contains('edit-note-x')) {
            const note = TODO.notes.find(note => note.ID == parseInt(e.target.dataset.nid));
            editNoteName.value = note.title;
            editNoteDescription.value = note.content;
            editNoteSave.dataset.nid = note.ID;
            TODO.openWindow('edit-note');
        }
    });

    removeNoteYes.addEventListener('click', async function () {
        const deleted = await TODODB.deleteNote(this.dataset.nid);
        if (deleted.status) {
            document.querySelector(`.note-element[data-nid='${this.dataset.nid}']`).remove();
            TODO.closeWindow('note-confirm-remove');
        }
    });

    removeNoteNo.addEventListener('click', function () {
        removeNoteYes.dataset.nid = null;
        TODO.closeWindow('note-confirm-remove');
    });

    newNoteBtn.addEventListener('click', function () {
        noteName.value = '';
        noteDescription.value = '';
        TODO.openWindow('new-note');
    });

    noteName.addEventListener('input', function () {
        if (this.value) {
            this.classList.remove('input-error');
            this.title = '';
        }
    });

    noteDescription.addEventListener('input', function () {
        if (this.value.length <= 65535) {
            this.classList.remove('input-error');
            this.title = '';
        }
    });

    createNoteBtn.addEventListener('click', async function () {
        let isValid = true;
        const name = noteName.value;
        const description = noteDescription.value;

        if (!name.length) {
            noteName.classList.add('input-error');
            noteName.title = 'Note name can not be empty';
            isValid = false;
        }

        if (description.length > 65535) {
            noteDescription.classList.add('input-error');
            noteDescription.title = 'Maximum length is 65535';
            isValid = false;
        }

        if (!isValid) return;

        const added = await TODODB.addNote({ name, description });

        if (added.status) {
            TODO.notes.push({ ID: added.nid, title: name, content: description });
            notesContainer.innerHTML += `
            <div class="note-element" data-nid="${added.nid}">
                <h1 class="note-banner noselect">
                    <div class="note-banner-title">${name}</div>
                    <div class="edit-controls-container">
                        <img src="/img/edit-icon.png" data-nid="${added.nid}" class="edit-note-x noselect" alt="Edit note" title="Edit" draggable="false">
                        <img src="/img/exit-icon.png" data-nid="${added.nid}" class="delete-note-x noselect" alt="Delete note" title="Remove" draggable="false">
                    </div>
                </h1>
                <pre class="note-content">${description}</pre>
            </div>`;
            TODO.closeWindow('new-note');
            TODO.openWindow('new-note-ok');
        }

    });

}

document.querySelectorAll('.modal-window-x').forEach(e => e.setAttribute('draggable', 'false'));