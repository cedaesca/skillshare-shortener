#!/usr/bin/env node
// Libraries
import { nanoid } from 'nanoid';
import * as commander from 'commander';
import * as chalk from 'chalk';
import * as figlet from 'figlet';

// Internal dependencies
import { Link } from '../models/link';
import { General } from '../utils/general';

export class ShortenerCLI {
  private program: commander.Command;
  private baseUrl = process.env.BASE_URL;

  constructor(program: commander.Command) {
    this.program = program;
  }

  /**
   * Initializes the CLI program
   *
   */
  public async init() {
    this.program
      .version('0.0.1')
      .description('CLI to shorten links and fetch statistics')
      .option('--shorten <url>', 'Shortens an url')
      .option('--stats <url>', 'Shows statistics for a shortened link')
      .option('--disable <url>', 'Disables a shortened url')
      .option('--enable <url>', 'Enables a previously disabled shortened url')
      .parse(process.argv);

    const options = this.program.opts();
    const argumentValue = options[Object.keys(options)[0]];

    if (argumentValue !== undefined && !General.isValidURL(argumentValue)) {
      console.log(
        'Please provide a valid URL as an argument. Example: sk --shorten https://google.com'
      );

      process.exit(0);
    }

    if (options.shorten) {
      await this.shorten(options.shorten);
    } else if (Object.keys(options).length < 1) {
      console.log(
        chalk.red(figlet.textSync('skillshare', { horizontalLayout: 'full' }))
      );

      this.program.help();
    }

    process.exit(0);
  }

  /**
   * Shortens the given URL
   *
   * @param { string } url
   *
   * @return { Promise<void> }
   */
  private async shorten(url: string): Promise<void> {
    const link = new Link();

    link.target = url;
    link.slug = nanoid(10);

    try {
      await link.save();
    } catch (error) {
      console.error('An error occured while saving the link', error);
    }

    console.log(
      `Link has been shortened! You can open it here: ${this.baseUrl}/${link.slug}`
    );
  }
}
