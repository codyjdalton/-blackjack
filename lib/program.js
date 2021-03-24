#!/usr/bin/env node
/**
 * commands
 */
const program = require('commander');

const { PlayModule } = require('./modules/play/play.module');

class Program {

    constructor() {
        this.program = program;
    }

    run() {
        return new Promise((resolve) => {
            
            this.program
                .command('play')
                .alias('p')
                .action(() => new PlayModule().play());

            this.program.parse(process.argv);

            resolve(this.program);
        });
    }
}

const prog = new Program().run();

module.exports = {
    prog,
    Program
};