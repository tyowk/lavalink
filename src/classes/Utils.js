exports.Utils = class Utils {
    static formatTime(ms) {
        const minute = 60 * 1000;
        const hour = 60 * minute;
        const day = 24 * hour;
        if (ms < minute) {
            return `${(ms / 1000).toFixed()}s`;
        } else if (ms < hour) {
            return `${Math.floor(ms / minute)}m ${Math.floor((ms % minute) / 1000)}s`;
        } else if (ms < day) {
            return `${Math.floor(ms / hour)}h ${Math.floor((ms % hour) / minute)}m`;
        } else {
            return `${Math.floor(ms / day)}d ${Math.floor((ms % day) / hour)}h`;
        }
    }
    
    static chunk(array, size) {
        const chunked = [];
        let index = 0;
        while (index < array.length) {
            chunked.push(array.slice(index, size + index));
            index += size;
        }
        return chunked;
    }
    
    static parseTime(string) {
        const time = string.match(/([0-9]+[d,h,m,s])/g);
        if (!time) return 0;
        let ms = 0;
        for (const t of time) {
            const unit = t[t.length - 1];
            const amount = Number(t.slice(0, -1));
            if (unit === "d") ms += amount * 24 * 60 * 60 * 1000;
            else if (unit === "h") ms += amount * 60 * 60 * 1000;
            else if (unit === "m") ms += amount * 60 * 1000;
            else if (unit === "s") ms += amount * 1000;
        }
        return ms;
    }
}
