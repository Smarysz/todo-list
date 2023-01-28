class TODO {

    static getTime() {

        const date = new Date;
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();

        if (h < 10) h = '0' + h;
        if (m < 10) m = '0' + m;
        if (s < 10) s = '0' + s;

        return h + ':' + m + ':' + s;

    }

    static getDatetime(date) {
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();

        if (h < 10) h = '0' + h;
        if (m < 10) m = '0' + m;
        if (s < 10) s = '0' + s;

        return data.getDate() + h + ':' + m + ':' + s;
    }

    static error(text) {
        console.log('\x1b[41m\x1b[37m ERROR [' + this.getTime() + ']: ' + text + ' \x1b[0m');
    }

    static success(text) {
        console.log('\x1b[42m\x1b[37m SUCCESS [' + this.getTime() + ']: ' + text + ' \x1b[0m');
    }

    static info(text) {
        console.log('\x1b[44m\x1b[37m INFO [' + this.getTime() + ']: ' + text + ' \x1b[0m');
    }
}

module.exports = TODO;