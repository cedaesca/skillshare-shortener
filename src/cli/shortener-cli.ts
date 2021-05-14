#!/usr/bin/env node
// Libraries
import { nanoid } from 'nanoid';
import * as commander from 'commander';
import * as chalk from 'chalk';
import * as figlet from 'figlet';
import { EntityNotFoundError, IsNull, Not, FindOperator } from 'typeorm';

// Internal dependencies
import { Link } from '../models/link';
import { General } from '../utils/general';
import { URL } from 'url';

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
      .option(
        '--stats <shortened url>',
        'Shows statistics for a shortened link'
      )
      .option('--disable <shortened url>', 'Disables a shortened url')
      .option(
        '--enable <shortened url>',
        'Enables a previously disabled shortened url'
      )
      .option('--list <url>', 'Display all the shortlinks for a given URL.')
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
    } else if (options.disable) {
      await this.disable(options.disable);
    } else if (options.enable) {
      await this.enable(options.enable);
    } else if (options.stats) {
      await this.fetchStats(options.stats);
    } else if (options.list) {
      await this.list(options.list);
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

      process.exit(0);
    }

    console.log(
      `Link has been shortened! You can open it here: ${this.baseUrl}/${link.slug}`
    );
  }

  /**
   * Disables a given URL
   *
   * @param { string } url
   *
   * @return { Promise<void> }
   */
  private async disable(url: string): Promise<void> {
    await this.updateLink({ url, disabledAt: new Date() });

    console.log(`Link ${url} has been disabled!`);
  }

  /**
   * Enables a given URL
   *
   * @param { string } url
   *
   * @return { Promise<void> }
   */
  private async enable(url: string): Promise<void> {
    await this.updateLink({ url, disabledAt: null });

    console.log(`Link ${url} has been enabled!`);
  }

  /**
   * Fetch a given URL's stats
   *
   * @param { string } url
   *
   * @return { Promise<void> }
   */
  private async fetchStats(url: string): Promise<void> {
    let link: Link;

    const slug = this.getSlugFromUrl(url);

    try {
      link = await Link.findOneOrFail({ slug }, { relations: ['visits'] });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        console.log(`No link "${url}" was found in the database.`);
      } else {
        console.log(
          `An error occured while fetching the link from the database`
        );
      }

      process.exit(0);
    }

    const linkStatus = link.disabledAt === null ? 'active' : 'disabled';
    const totalVisits = link.visits.length;

    const details = link.visits.map((visit) => {
      const formattedDetail = `
        - IP ${visit.ipAddress} - Date: ${visit.createdAt} - UserAgent: ${visit.userAgent} - Referrer: ${visit.referrer}
      `;

      return formattedDetail;
    });

    console.log(`
      Stats for link ${url}
      Current status: ${linkStatus}
      Times it has been opened: ${totalVisits}
      Details:
        ${details}
    `);
  }

  /**
   * Display all the shortlinks for a given URL
   *
   * @param { string } url
   *
   * @return { Promise<void> }
   */
  private async list(url: string): Promise<void> {
    let links: Link[];

    try {
      links = await Link.find({ target: url });
    } catch (error) {
      console.log(`An error occured while fetching the shortlinks`);

      process.exit(0);
    }

    const formattedLinks = links.map((link) => {
      const linkStatus = link.disabledAt === null ? 'active' : 'disabled';

      return `
        - ${this.baseUrl}/${link.slug} - Created at: ${link.createdAt} - Current status: ${linkStatus}
      `;
    });

    const totalLinks = links.length;

    console.log(`
      Shortlinks for link ${url}
      Times it has been shortened: ${totalLinks}
      Details:
        ${formattedLinks}
    `);
  }

  /**
   * Retrieves the slug from a given URL
   *
   * @param { string } url
   *
   * @return { string }
   */
  private getSlugFromUrl(url: string): string {
    const [, slug] = new URL(url).pathname.split('/');

    return slug;
  }

  /**
   * Disable or enable a given URL
   *
   * @param { { url: string; disabledAt: Date | null } } options
   *
   * @return { Promise<void> }
   */
  private async updateLink(options: {
    url: string;
    disabledAt: Date | null;
  }): Promise<void> {
    let link: Link;
    let disabledAt: FindOperator<any>;
    let searchingLinkState: string;

    const slug = this.getSlugFromUrl(options.url);

    if (options.disabledAt !== null) {
      disabledAt = IsNull();
      searchingLinkState = 'active';
    } else {
      disabledAt = Not(IsNull());
      searchingLinkState = 'disabled';
    }

    try {
      link = await Link.findOneOrFail({ slug, disabledAt });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        console.log(
          `No ${searchingLinkState} link "${options.url}" was found in the database.`
        );
      } else {
        console.log(
          `An error occured while fetching the link from the database`
        );
      }

      process.exit(0);
    }

    link.disabledAt = options.disabledAt;

    try {
      await link.save();
    } catch (error) {
      console.log(`An error occured while updating the link in the database`);

      process.exit(0);
    }
  }
}
