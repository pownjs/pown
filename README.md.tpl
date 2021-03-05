[![Follow on Twitter](https://img.shields.io/twitter/follow/pownjs.svg?logo=twitter)](https://twitter.com/pownjs)
[![NPM](https://img.shields.io/npm/v/pown.svg)](https://www.npmjs.com/package/pown)
[![Fury](https://img.shields.io/badge/version-2x%20Fury-red.svg)](https://github.com/pownjs/lobby)
![default workflow](https://github.com/pownjs/git/actions/workflows/default.yaml/badge.svg)
[![SecApps](https://img.shields.io/badge/credits-SecApps-black.svg)](https://secapps.com)

# Pown

Pown.js is a security testing and exploitation toolkit built on top of Node.js and NPM. Unlike traditional security tools like Metasploits, Pown.js considers frameworks to be an anti-pattern. Therefore, each module in Pown is in fact a standalone NPM module allowing greater degree of reuse and flexibility. Creating new modules is a matter of publishing to NPM and tagging it with the correct tags. The rest is handled automatically.

## Quickstart

Install Pown.js globally with npm or yarn.

```sh
$ npm install -g pown@latest
```

## Usage

```
{{usage}}
```

## Modules

Pown.js comes with several builtin modules for convenience. However, additional modules can be installed directly from the NPM registry using `pown modules` command. Optional modules are installed in the current users's home folder under `.pown/modules`.
