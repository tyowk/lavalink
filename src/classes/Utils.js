module.exports = class Utils {
    static formatTime(ms) {
        const minute = 60 * 1000;
        const hour = 60 * minuteMs;
        const day = 24 * hourMs;
        if (ms < minute) {
            return `${ms / 1000}s`;
        } else if (ms < hour) {
            return `${Math.floor(ms / minute)}m ${Math.floor((ms % minute) / 1000)}s`;
        } else if (ms < day) {
            return `${Math.floor(ms / hour)}h ${Math.floor((ms % hour) / minute)}m`;
        } else {
            return `${Math.floor(ms / day)}d ${Math.floor((ms % day) / hour)}h`;
        }
    }
    
    static chunk(array, size) {
        const chunked_arr = [];
        let index = 0;
        while (index < array.length) {
            chunked_arr.push(array.slice(index, size + index));
            index += size;
        }
        return chunked_arr;
    }
    
    static formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
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
