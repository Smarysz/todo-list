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

    static async addTask({ title, deadline, priority, description }) {
        const data = await fetch('/task/add', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(arguments[0])
        });
        return await data.json();
    }

}