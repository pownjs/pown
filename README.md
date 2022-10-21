[![Follow on Twitter](https://img.shields.io/twitter/follow/pownjs.svg?logo=twitter)](https://twitter.com/pownjs)
[![NPM](https://img.shields.io/npm/v/pown.svg)](https://www.npmjs.com/package/pown)
[![Fury](https://img.shields.io/badge/version-3x%20Rage-red.svg)](https://github.com/pownjs/lobby)
![default workflow](https://github.com/pownjs/git/actions/workflows/default.yaml/badge.svg)
[![SecApps](https://img.shields.io/badge/credits-SecApps-black.svg)](https://secapps.com)

# Pown

Pown.js is a security testing toolkit built on top of Node.js and NPM. Unlike traditional security tools, notably Metasploits, Pown.js considers frameworks to be an anti-pattern. Therefore, each feature in Pown is in fact a standalone NPM module allowing greater degree of reuse and flexibility. Creating new features is a matter of publishing new modules to NPM. This module provides simple means to start the cli. As a result you can easily build your own tools with pown or create new tools by composition.

## Quickstart

Install Pown.js globally with npm or yarn.

```sh
$ npm install -g pown@latest
```

## Usage

```
pown.js [options] <command> [command options]

Commands:
  pown.js update                   Update global installation of pown  [aliases: upgrade, up, u]
  pown.js credits [options]        list contributors and credits
  pown.js modules <command>        Module manager  [aliases: module, mo, m]
  pown.js preferences <command>    Preferences  [aliases: prefs]
  pown.js script [file] [args...]  Simple scripting engine for automating pown commands.
  pown.js shell [options]          Simple shell for executing pown commands

Options:
  --version  Show version number  [boolean]
  --help     Show help  [boolean]
```

## Modules

Pown.js comes with several builtin modules for convenience. However, additional modules can be installed directly from the NPM registry using `pown modules` command. Optional modules are installed in the current users's home folder under `~/.pown/modules`.
