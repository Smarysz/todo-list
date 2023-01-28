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
}

const pageID = document.body.dataset.pageid;
const activeItem = document.querySelector(`.menu-item[data-page='${pageID}']`);
if (activeItem) activeItem.classList.add('menu-item-active');

if (document.body.classList.contains('id-exit')) {
    TODO.shutdown();
}

document.querySelectorAll('.remove-task').forEach(function (e) {
    e.addEventListener('click', async function () {
        let data = await TODO.removeTask(e.dataset.tid);
        if (data.status) {
            alert('deleted!');
        } else {
            alert('Not deleted');
        }

    });
});