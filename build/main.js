#!/usr/bin/env node
var program = require('commander');
program.version('0.1.0812', '-v, --version')
    .command('init <name>')
    .action(function (name) {
    console.log(name);
});
program.parse(process.argv);
//# sourceMappingURL=main.js.map