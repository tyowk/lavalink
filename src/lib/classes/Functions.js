const fs = require('node:fs');
const path = require('node:path');
const chalk = require('chalk');

exports.CustomFunctions =  class Functions {
    constructor(client, debug = false, basePath = path.join(__dirname, '..', 'functions')) {
        try {
            const files = fs.readdirSync(basePath);
            for (const file of files) {
                const filePath = path.join(basePath, file);
                const func = require(filePath);
                if (fs.statSync(filePath).isDirectory()) {
                    this.constructor(client, filePath);
                } else {
                    try {
                        if (!func || typeof func !== 'function') {
                            this.debug('error', file);
                            continue;
                        }
                        
                        if (debug) this.debug('success', file);
                        client.functionManager.createFunction({
                            name: `$${file.split('.')[0]}`,
                            type: 'djs',
                            code: func
                        });
                    } catch (err) {
                        if (debug) this.debug('error', file);
                    }
                }
            }
        } catch (err) { console.error(err) }
    }

    debug(type, file) {
        if (type === 'success') {
            return console.log(
                '[' + chalk.blue('DEBUG') + ']'
                + chalk.gray(' :: Function loaded: ')
                + chalk.cyan(`$${file.split('.')[0]}`)
            );
        } else if (type === 'error') {
            return console.log(
                '[' + chalk.blue('DEBUG') + ']'
                + chalk.gray(' :: Failed to Load: ')
                + chalk.red(`$${file.split('.')[0]}`)
            );
        }
    }
}
