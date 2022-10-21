[![Follow on Twitter](https://img.shields.io/twitter/follow/pownjs.svg?logo=twitter)](https://twitter.com/pownjs)
![NPM](https://img.shields.io/npm/v/@pown/cli.svg)
[![Fury](https://img.shields.io/badge/version-2x%20Fury-red.svg)](https://github.com/pownjs/lobby)
[![SecApps](https://img.shields.io/badge/credits-SecApps-black.svg)](https://secapps.com)

# Pown CLI

CLI is the main command line interface to PownJS. It contains some basic functionalities, such as colors, tables, logging and more. Just like all other PownJS features, this module is 100% swapable. Your can replace this module with your own.

## Quickstart

Install this module from the root of your project:

```sh
$ npm install @pown/cli --save
```

Once done, invoke pown like this:

```sh
$ ./node_modules/.bin/pown
```

You can also specify a custom location for your modules via the POWN_ROOT environment variable like this:

```sh
$ POWN_ROOT=path/to/root ./node_modules/.bin/pown
```
