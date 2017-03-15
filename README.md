[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/pownjs/Lobby)

```
 _______  _______  _     _  __    _      ___  _______ 
|       ||       || | _ | ||  |  | |    |   ||       |
|    _  ||   _   || || || ||   |_| |    |   ||  _____|
|   |_| ||  | |  ||       ||       |    |   || |_____ 
|    ___||  |_|  ||       ||  _    | ___|   ||_____  |
|   |    |       ||   _   || | |   ||       | _____| |
|___|    |_______||__| |__||_|  |__||_______||_______|
```

Pown.js is the security testing an exploitation toolkit built on top of Node.js and NPM.

## Why Pown.js

Unlike existing frameworks, such as Metasploit, the development of Pown.js is 100% decentralised and community driven. Pown.js is unopinionated and programmatic in nature. All Pown.js features come in the form of standard NPM modules which are orchestrated through Node's event-driven paradigms and some form of module auto-discovery. If you are familiar with other Node projects such as Grunt, Babel or Browserify you are already familiar with Pown.js.

## Toolkit Design

Pown.js is made of self-published NPM modules, which come together to form the toolkit features. Pown.js modules are encouraged to be as much framework-agnostic as possible so that they can be re-used in other non-Pown.js modules and projects. Existing NPM modules can be converted with minimal effort to integrate into the Pown.js framework.

Pown.js modules are organised into distributions. The official Pown.js distribution is served by the [pown-dist](https://github.com/pownjs/pown-dist) module but non-official distributions are encouraged and can be built and used by the community as well.

The Pown.js capabilities are accessed by the user via framework modules called tools, which are orchestrated by the command-line interface [pown-cli](https://github.com/pownjs/pown-dist). The current list of official tools include:

* [pown-shell](https://github.com/pownjs/pown-shell) - interactive command shell
* [pown-credits](https://github.com/pownjs/pown-credits) - credit all contributors
* [pown-proxy](https://github.com/pownjs/pown-proxy) - interactive web proxy
* [pown-network](https://github.com/pownjs/pown-network) - interactive network attacker

Other tools are provided and advertised via the NPM module system. Pown.js tools can run on their own without relying on the pown-cli module, which ensures that the original authors are in full control of their project.

The Pown.js framework provides a minimal set of underlaying features in order to be as lightweight as possible. Most features which are not related to module discovery and communication will be provided as separate modules, which Pown.js module authors can directly depend on without embedding the whole framework which is definitely going to be a much bigger package.

Pown.js also provides a set of compiler and transpiler utilities served by the [pown-toolchain](https://github.com/pownjs/pown-toolchain) module. For example, modules may depend directly on upcoming language features which are not available in the latest version of node. The toolchain provides the necessary tools to support these language features without much effort. Module authors do not need to use the toolchain if they don't specifically need to. It is provided only for convenience.

## Why JavaScript, Node.js and NPM

Node and NPM have vibrant development community. JavaScript is not going away anytime soon given it underpins the World Wide Web we know today. NPM provides access to countless of modules which support a wide-range of technologies - unprecedented characteristic previously unseen in other development communities.

The bottom line is that even if you don't like using JavaScript, you can alway build your modules using your language of choice that can transpile to JavaScript and in the future you can also build in C/C++, go and whatever you like by utilising WebAssembly.

Given that Pown.js is nothing more than a simple orchestration layer and a community and the fact that modules are encouraged to be as framework-agnostic as possible, it is safe to say that any contributions to this framework will be relevant for the time to come.

## Wish List

Needless to say, Pown.js is missing important features:

- [ ] a rich collection of payloads
- [ ] a rich collection of exploits

## How To Contribute

Follow us on [twitter](https://twitter.com/pownjs). Star us on [GitHub](https://github.com/pownjs). Join the conversation on [Gitter](https://gitter.im/pownjs/Lobby#).

Many of the details are still ironed out but since this is the beginning it is an excellent opportunity not only to expand your knowledge in the field of information security by contributing directly to Pown.js but also to become a leading member and a frontrunner of the Pown.js eco-system and the security field wold-wide.