[![Follow on Twitter](https://img.shields.io/twitter/follow/pownjs.svg?logo=twitter)](https://twitter.com/pownjs)
![NPM](https://img.shields.io/npm/v/@pown/connect.svg)
[![Fury](https://img.shields.io/badge/version-2x%20Fury-red.svg)](https://github.com/pownjs/lobby)
![default workflow](https://github.com/pownjs/connect/actions/workflows/default.yaml/badge.svg)
[![SecApps](https://img.shields.io/badge/credits-SecApps-black.svg)](https://secapps.com)

# Pown Connect

This is a simple, high-level library and pownjs command for making raw, TCP connections. This module comes with its own Scheduler.

## Credits

This tool is part of [secapps.com](https://secapps.com) open-source initiative.

```
  ___ ___ ___   _   ___ ___  ___
 / __| __/ __| /_\ | _ \ _ \/ __|
 \__ \ _| (__ / _ \|  _/  _/\__ \
 |___/___\___/_/ \_\_| |_|  |___/
  https://secapps.com
```

### Authors

* [@pdp](https://twitter.com/pdp) - https://pdparchitect.github.io/www/

## Quickstart

This tool is meant to be used as part of [Pown.js](https://github.com/pownjs/pown), but it can be invoked separately as an independent tool.

Install Pown first as usual:

```sh
$ npm install -g pown@latest
```

Install connect:

```sh
$ pown modules install @pown/connect
```

Invoke directly from Pown:

```sh
$ pown connect
```

### Standalone Use

Install this module locally from the root of your project:

```sh
$ npm install @pown/connect --save
```

Once done, invoke pown cli:

```sh
$ POWN_ROOT=. ./node_modules/.bin/pown-cli connect
```

You can also use the global pown to invoke the tool locally:

```sh
$ POWN_ROOT=. pown connect
```

## Usage

> **WARNING**: This pown command is currently under development and as a result will be subject to breaking changes.

```
pown-cli connect [address]

Connect to addreess

Options:
  --version                                            Show version number  [boolean]
  --help                                               Show help  [boolean]
  --content-sniff-size, --content-sniff, --sniff-size  Specify the size of the content sniff  [number] [default: 5]
  --print-response-data, --print-data                  Print response data  [boolean] [default: false]
  --download-response-data, --download-data            Download response data  [boolean] [default: false]
  --connect-timeout, -t, --timeout                     Maximum time allowed for connection  [number] [default: 30000]
  --data-timeout, -T                                   Maximum time allowed for connection  [number] [default: 30000]
  --accept-unauthorized, -k, --insecure                Accept unauthorized TLS errors  [boolean] [default: false]
  --tls                                                Connect with TLS  [boolean] [default: false]
  --connect-concurrency, -c                            The number of connections to open at the same time  [number] [default: Infinity]
  --task-concurrency, -C                               The number of connect tasks to run at the same time  [number] [default: Infinity]
  --data, -d                                           Data to send  [string]
  --json-data, -D                                      Data to send (json encoded string)  [string]
```
