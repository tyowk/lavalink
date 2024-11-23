const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

exports.Functions = class Functions {
    constructor(client, debug, basePath = path.join(__dirname, '..', 'functions')) {
        try {
            const files = fs.readdirSync(basePath);
            for (const file of files) {
                const filePath = path.join(basePath, file);
                const func = require(filePath);
                if (fs.statSync(filePath).isDirectory()) {
                    new this.constructor(client, debug, filePath);
                } else {
                    if (typeof func !== 'function') {
                        if (debug) this.debug('error', file);
                        continue;
                    }

                    const name = file.split('.')[0];
                    if (debug) this.debug('success', file);
                    client.functionManager.createFunction({
                        name: `$${name}`,
                        type: 'djs',
                        code: func
                    });
                }
            }
        } catch (err) { 
            console.error(err); 
        }
    }
    
    debug(type, file) {
        const name = file.split('.')[0];
        if (type === 'success') {
            console.log(`[${chalk.blue('DEBUG')}] :: Function loaded: ${chalk.cyan(`$${name}`)}`);
        } else if (type === 'error') {
            console.log(`[${chalk.blue('DEBUG')}] :: Failed to Load: ${chalk.red(`$${name}`)}`);
        }
    }
};
