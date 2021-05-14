#!/usr/bin/env node

import { createConnection, getConnectionOptions } from 'typeorm';
import { Command } from 'commander';
import { ShortenerCLI } from './shortener-cli';
import * as path from 'path';

getConnectionOptions()
  .then((options) => {
    return createConnection({
      ...options,
      entities: [path.join(__dirname, '..', 'models/**/*.js')],
    });
  })
  .then((connection) => {
    const program = new Command();
    const cli = new ShortenerCLI(program);

    cli.init();
  })
  .catch((error) => console.error(error));
