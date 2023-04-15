class TODODB {

    static shutdown() {
        fetch('/exit', {
            method: 'POST'
        });
    }

    static async deleteTask(tid) {
        const data = await fetch(`/task/${tid}`, {
            method: 'DELETE'
        });
        return await data.json();
    }

    static async confirmTask(tid) {
        const data = await fetch(`/task/confirm/${tid}`, {
            method: 'PUT'
        });
        return await data.json();
    }

    static async uncheckTask(tid) {
        const data = await fetch(`/task/uncheck/${tid}`, {
            method: 'PUT'
        });
        return await data.json();
    }

    static async addTask({ title, deadline, priority, description }) {
        const data = await fetch('/task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(arguments[0])
        });
        return await data.json();
    }

    static async updateTask({ tid, title, deadline, priority, description }) {
        const data = await fetch(`/task/${tid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(arguments[0])
        });
        return await data.json();
    }

    static async addNote({ name, description }) {
        const data = await fetch(`/note`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(arguments[0])
        });
        return await data.json();
    }

    static async deleteNote(nid) {
        const data = await fetch(`/note/${nid}`, {
            method: 'DELETE'
        });
        return await data.json();
    }

    static async updateNote({ nid, title, content }) {
        const data = await fetch(`/note/${nid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(arguments[0])
        });
        return await data.json();
    }

}