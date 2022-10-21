[![Follow on Twitter](https://img.shields.io/twitter/follow/pownjs.svg?logo=twitter)](https://twitter.com/pownjs)
[![NPM](https://img.shields.io/npm/v/pown.svg)](https://www.npmjs.com/package/pown)
[![Fury](https://img.shields.io/badge/version-3x%20Rage-red.svg)](https://github.com/pownjs/lobby)
![default workflow](https://github.com/pownjs/git/actions/workflows/default.yaml/badge.svg)
[![SecApps](https://img.shields.io/badge/credits-SecApps-black.svg)](https://secapps.com)

# Pown Script

Pown Script is a simple scripting environment. The key advantage of using Pown Script instead of Bash, Python, Perl, etc, is because all commands are executed within the same VM context (same process). Commands such as [Pown Recon](https://github.com/pownjs/pown-script) take advantage of this by keeping a global model of its graph, thus, removing the need to save into intermediate files upon each command execution.

Pown Script implements some some standard commands such as `echo`, `sleep` and even `set`. This is done for interoperability. Every pown script is also a valid bash script.

## Credits

This tool is part of [secapps.com](https://secapps.com) open-source initiative.

```
  ___ ___ ___   _   ___ ___  ___
 / __| __/ __| /_\ | _ \ _ \/ __|
 \__ \ _| (__ / _ \|  _/  _/\__ \
 |___/___\___/_/ \_\_| |_|  |___/
  https://secapps.com
```

## Quickstart

This tool is meant to be used as part of [Pown.js](https://github.com/pownjs/pown) but it can be invoked separately as an independent tool.

Install Pown first as usual:

```sh
$ npm install -g pown@latest
```

Invoke directly from Pown:

```sh
$ pown script
```

Otherwise, install this module locally from the root of your project:

```sh
$ npm install @pown/script --save
```

Once done, invoke pown cli:

```sh
$ ./node_modules/.bin/pown-cli script
```

You can also use the global pown to invoke the tool locally:

```sh
$ POWN_ROOT=. pown script
```

## Usage

> **WARNING**: This pown command is currently under development and as a result will be subject to breaking changes.

```
pown-cli script [file] [args...]

Simple scripting engine for automating pown commands.

Options:
      --version  Show version number  [boolean]
      --help     Show help  [boolean]
  -c, --command  Evaluate inline commands  [boolean] [default: false]
  -e, --exit     Exit immediately  [boolean] [default: false]
  -x, --expand   Expand command  [boolean] [default: false]
  -s, --skip     Skip number of lines  [number] [default: 0]
```
