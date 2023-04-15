class TODO {

    static isWindowOpened = false;
    static openedWindow = null;
    static priorities = {
        1: 'Low',
        2: 'Medium',
        3: 'High'
    };
    static tasks = null;

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

    static openWindow(name) {
        if (!name) {
            return console.error('Window name cannot be empty');
        }
        if (!this.isWindowOpened) {
            const win = document.querySelector(`.modal-window[data-name=${name}]`);
            if (win) {
                document.querySelector('#modal-layer').style.display = 'grid';
                win.style.display = 'block';
                this.openedWindow = name;
            }
            this.isWindowOpened = true;
        }
    }

    static closeWindow(name) {
        if (!name) {
            return console.error('Window name cannot be empty');
        }
        if (this.isWindowOpened) {
            const win = document.querySelector(`.modal-window[data-name=${name}]`);
            if (win) {
                win.style.display = 'none';
                document.querySelector('#modal-layer').style.display = 'none';
                this.openedWindow = null;
            }
            this.isWindowOpened = false;
        }
    }

    /**
     * Adds task to undone tasks table
     * @param {object} properties Task details
     * @returns {boolean}
     */
    static addTaskToTable({ title, deadline, priority, tid, content }) {
        if (!tid || !title || !priority) return false;

        deadline = deadline || '-';

        priority = parseInt(priority);
        switch (priority) {
            case 1: priority = 'Low'; break;
            case 2: priority = 'Medium'; break;
            case 3: priority = 'High'; break;
            default: priority = 'Low';
        }

        const tr = document.createElement('tr');
        tr.classList.add('undone-task');
        tr.dataset.title = title;
        tr.dataset.deadline = deadline;
        tr.dataset.priority = priority;
        tr.dataset.tid = tid;

        let priorityColor = '';
        if (deadline && TODO.date(deadline) === TODO.date()) priorityColor = 'priority-today';

        tr.innerHTML = `<td class="undone-title"><a class="any-task" title="Click to show details">${title}</a></td>
        <td class="undone-deadline ${priorityColor}">${deadline}</td>
        <td class="undone-priority"><a class="priority-task">${priority}</a></td>
        <td><a data-tid="${tid}" class="edit-task">Edit</a></td>
        <td><a data-tid="${tid}" data-event="false" class="confirm-task">Confirm</a></td>
        <td><a data-tid="${tid}" data-event="false" class="remove-task">Remove</a></td>`;
        document.querySelector('#undone-tasks-table tbody').appendChild(tr);
        confirmTaskSetEvent();
        deleteTaskSetEvent();
        document.querySelector('#undone-task-count').textContent++;
        this.tasks.push({ ID: tid, title, deadline, done: 0, priority_id: priority, description: content, priority_name: "Medium" });
        return true;
    }

    static updateTaskInTable({ title, deadline, priority, tid, content }) {
        if (!tid || !title || !priority) {
            console.error('Task ID, title and priority number can not be empty');
            return false;
        }
        deadline = deadline || '-';
        const tr = document.querySelector(`#undone-tasks-table [data-tid='${tid}']`);
        tr.dataset.title = title;
        tr.dataset.deadline = deadline;
        tr.dataset.priority = this.priorities[priority];
        tr.dataset.tid = tid;
        tr.querySelector('.undone-title .any-task').textContent = title;
        tr.querySelector('.undone-deadline').textContent = deadline;
        tr.querySelector('.priority-task').textContent = this.priorities[priority];
        const task = TODO.tasks.find(e => e.ID === parseInt(tid));
        task.title = title;
        task.deadline = deadline;
        task.priority_id = parseInt(priority);
        task.priority_name = this.priorities[priority];
        task.description = content;
    }

}

if (document.querySelector('.tasks-data')) {
    TODO.tasks = JSON.parse(document.querySelector('.tasks-data').textContent);
}

if (document.querySelector('.notes-data')) {
    TODO.notes = JSON.parse(document.querySelector('.notes-data').textContent);
}