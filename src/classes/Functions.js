const { readdirSync, statSync } = require('node:fs');
const { blue, cyan, red } = require('chalk');
const { join } = require('node:path');

exports.CustomFunctions =  class Functions {
    constructor(client, debug = false, basePath = join(__dirname, '..', 'functions'), totall = { success: 0, error: 0 }) {
        try {
            const files = readdirSync(basePath);
            for (const file of files) {
                const filePath = join(basePath, file);
                const func = require(join('..', 'functions', file));
                if (statSync(filePath).isDirectory()) {
                    this.constructor(client, filePath);
                } else { try {
                        if (!func || typeof func !== 'function') { if (debug) this.debug('error', file); totall.error++; continue; }
                        if (debug) this.debug('success', file); totall.success++;
                        client.functionManager.createFunction({ name: `$${file.split('.')[0]}`, type: 'djs', code: func });
                    } catch (err) { if (debug) this.debug('error', file); totall.error++; }
                }
            }
        } catch (err) {
            console.error(err)
        } finally {
            if (debug) {
                console.log('[' + blue('DEBUG') + '] :: Totall function loaded: ' + cyan(totall.success));
                console.log('[' + blue('DEBUG') + '] :: Totall function unloaded: ' + red(totall.error));
            }
        }
    }

    debug(type, file) {
        if (type === 'success') {
            console.log('[' + blue('DEBUG') + '] :: Function loaded: ' + cyan(`$${file.split('.')[0]}`));
        } else if (type === 'error') {
            console.log('[' + blue('DEBUG') + '] :: Failed to Load: ' + red(`$${file.split('.')[0]}`));
        }
    }
}
