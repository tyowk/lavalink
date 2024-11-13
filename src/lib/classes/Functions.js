const fs = require('node:fs');
const path = require('node:path');

exports.CustomFunctions = class Functions {
    constructor(i) {
        this.client = i.client;

        const files = fs.readdirSync(path.join(__dirname, '..', 'functions'));
        if (!files) throw new Error('Failed to load custom functions! please contact the developer.');
        for (const file of files) {
            const f = require(path.join('..', 'functions', file));
            if (!f || !f.name || !f.code) continue;
            client.functionManager.createFunction({
                name: f.name,
                type: 'djs',
                code: f.code
            });
        }
    }
}
