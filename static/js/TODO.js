class TODO {

    static isWindowOpened = false;
    static openedWindow = null;

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

}