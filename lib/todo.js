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

    /**
     * 
     * @param {string} text Text message
     * Print an error in console using red color
     */
    static error(text) {
        console.log('\x1b[41m\x1b[37m ERROR [' + this.getTime() + ']: ' + text + ' \x1b[0m');
    }

    /**
     * 
     * @param {string} text Text message
     * Print a success message in console using green color
     */
    static success(text) {
        console.log('\x1b[42m\x1b[37m SUCCESS [' + this.getTime() + ']: ' + text + ' \x1b[0m');
    }

    /**
     * 
     * @param {string} text Text message
     * Print info in console using blue color
     */
    static info(text) {
        console.log('\x1b[44m\x1b[37m INFO [' + this.getTime() + ']: ' + text + ' \x1b[0m');
    }
}

module.exports = TODO;