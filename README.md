# Skillshare URL Shortener

## Project Requirements

1. Node Version >= 14
2. MySQL Database

## Setup Steps

1. Run `npm i` command
2. Copy `.env.example` into `.env`
3. Configure all relevant environment variables in `.env`
4. Build the dist with `npm run build`
5. Link the CLI with `npm link`
6. Start the server with `npm start`

## CLI Commands

1. `sk --help` Display all the available commands.
2. `sk --shorten <url>` Shortens the given URL.
3. `sk --disable <shortened url>` Disables the given URL.
4. `sk --enable <shortened url>` Enables a previously disabled URL.
5. `sk --stats <shortened url>` Display the given URL stats.
6. `sk --list <shortened url>` Display all the shortlinks for a given URL.

## Warnings

1. Environment variable `TYPEORM_SYNCHRONIZE` must be false in production.
2. Environment variable `TYPEORM_LOGGING` is recommended to be false in production.
