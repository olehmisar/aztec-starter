#!/usr/bin/env node
import { Command } from 'commander';
import input from '@inquirer/input';
const program = new Command();
import tiged from 'tiged';

program.action(async () => {
    const appName = await input({
        message: 'Your app name:',
        default: 'aztec-starter-app',
    });

    const emitter = tiged(`AztecProtocol/aztec-starter`, {
        disableCache: true,
        force: true,
        verbose: true,
    });

    emitter.on('info', info => {
        console.log(info.message);
    });

    emitter.clone(`./${appName}`).then(() => {
        console.log('done');
    });
});

program.parse();