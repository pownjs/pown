[![Follow on Twitter](https://img.shields.io/twitter/follow/pownjs.svg?logo=twitter)](https://twitter.com/pownjs)
[![NPM](https://img.shields.io/npm/v/pown.svg)](https://www.npmjs.com/package/pown)
[![Fury](https://img.shields.io/badge/version-2x%20Fury-red.svg)](https://github.com/pownjs/lobby)

# Pown

Pown.js is a security testing an exploitation toolkit built on top of Node.js and NPM.

## Quickstart

Install Pown.js globally like this:

```sh
$ npm install -g pown@latest
```

## Usage

```
pown [options] <command> [command options]

Commands:
  pown modules <command>          Module manager  [aliases: module, m]
  pown update [options]           Update global installation of pown  [aliases: upgrade, up]
  pown buster [options] <url>     Web file and directory bruteforcer (a.k.a dirbuster)
  pown credits [options]          list contributors and credits
  pown dicts [options] <search>   Assorted Dictionaries
  pown duct <command>             Side-channel attack enabler  [aliases: ducting, d]
  pown preferences <command>      Preferences  [aliases: prefs]
  pown proxy [options] [command]  HTTP proxy
  pown recon <command>            Target recon
  pown script [file|script]       Simple scripting engine
  pown shell [options]            Simple shell

Options:
  --version  Show version number  [boolean]
  --help     Show help  [boolean]
```

### `pown modules`

```
pown modules <command>

Module manager

Commands:
  pown modules install <modules...>    Install modules
  pown modules uninstall <modules...>  Uninstall modules
  pown modules update [modules...]     Update modules
  pown modules list                    List install modules
  pown modules search <terms...>       Search modules

Options:
  --version  Show version number  [boolean]
  --help     Show help  [boolean]
```

### `pown update`

```
pown update [options]

Update global installation of pown

Options:
  --version  Show version number  [boolean]
  --help     Show help  [boolean]
```

### `pown buster`

```
pown buster [options] <url>

Web file and directory bruteforcer (a.k.a dirbuster)

Options:
  --version                   Show version number  [boolean]
  --help                      Show help  [boolean]
  --request-method, -X        Request method  [string] [default: "GET"]
  --name-dictionary, -n       Name dictionary file  [string]
  --extension-dictionary, -e  Extension dictionary file  [string]
  --name-prefix               Name prefix  [string] [default: "/"]
  --name-suffix               Name suffix  [string] [default: ""]
  --extension-prefix          Extension prefix  [string] [default: "."]
  --extension-suffix          Extension suffix  [string] [default: ""]
  --request-concurrency, -r   The number of request to run concurrently  [string] [default: Infinity]
  --load-concurrency, -l      The number of assync operations to run concurrently  [string] [default: Infinity]
  --header, -H                Set header  [array] [default: []]
  --timeout, -t               Request timeout in milliseconds  [number] [default: 30000]
  --all, -y                   Display all results  [boolean] [default: false]
  --yes, -y                   Answer yes to all questions  [boolean] [default: false]
  --blessed, -b               Start with blessed ui  [boolean] [default: false]

Examples:
  pown buster -X HEAD -n words.txt http://target                                             Send requests using the HEAD HTTP method
  pown buster -H 'Authorization: Basic YWxhZGRpbjpvcGVuc2VzYW1l' -n words.txt http://target  Send basic authentication headers
  pown buster -b --all -n words.txt http://target                                            Start buster but also open the results in nice text user interface
```

### `pown credits`

```
pown credits [options]

list contributors and credits

Options:
  --version   Show version number  [boolean]
  --help      Show help  [boolean]
  --only, -o  Only Pown.js contributors  [boolean]
```

### `pown dicts`

```
pown dicts [options] <search>

Assorted Dictionaries

Options:
  --version       Show version number  [boolean]
  --help          Show help  [boolean]
  --download, -d  Download found dictionaries  [boolean] [default: false]
  --regex, -r     Search with regex  [boolean] [default: false]
```

### `pown duct`

```
pown duct <command>

Side-channel attack enabler

Commands:
  pown duct dns  DNS ducting

Options:
  --version  Show version number  [boolean]
  --help     Show help  [boolean]
```

### `pown preferences`

```
pown preferences <command>

Preferences

Commands:
  pown preferences get <tool> [name]          get preferences
  pown preferences set <tool> <name> <value>  set preferences

Options:
  --version  Show version number  [boolean]
  --help     Show help  [boolean]
```

### `pown proxy`

```
pown proxy [options] [command]

HTTP proxy

Options:
  --version                 Show version number  [boolean]
  --help                    Show help  [boolean]
  --log, -l                 Log requests and responses  [boolean] [default: false]
  --host, -h                Host to listen to  [string] [default: "0.0.0.0"]
  --port, -p                Port to listen to  [number] [default: 8080]
  --text, -t                Start with text ui  [boolean] [default: false]
  --ws-client, -c           Connect to web socket  [string] [default: ""]
  --ws-server, -s           Forward on web socket  [boolean] [default: false]
  --ws-host                 Web socket server host  [string] [default: "0.0.0.0"]
  --ws-port                 Web socket server port  [number] [default: 9090]
  --ws-app                  Open app  [string] [choices: "", "httpview"] [default: ""]
  --certs-dir               Directory for the certificates  [string] [default: "/Users/pdp/.pown/proxy/certs"]
  --server-key-length       Default key length for certificates  [number] [default: 1024]
  --default-ca-common-name  The CA common name  [string] [default: "Pown.js Proxy"]
```

### `pown recon`

```
pown recon <command>

Target recon

Commands:
  pown recon transform <transform>        Perform inline transformation  [aliases: t]
  pown recon select <selectors...>        Select nodes  [aliases: s]
  pown recon add <nodes...>               Add nodes  [aliases: a]
  pown recon remove <selectors...>        Remove nodes  [aliases: r]
  pown recon merge <files...>             Perform a merge between at least two recon files  [aliases: m]
  pown recon diff <fileA> <fileB>         Perform a diff between two recon files  [aliases: d]
  pown recon group <name> <selectors...>  Group nodes  [aliases: g]
  pown recon ungroup <selectors...>       Ungroup nodes  [aliases: u]

Options:
  --version  Show version number  [boolean]
  --help     Show help  [boolean]
```

### `pown script`

```
pown script [file|script]

Simple scripting engine

Options:
  --version   Show version number  [boolean]
  --help      Show help  [boolean]
  --eval, -e  Evaluate inline script  [boolean] [default: false]
```

### `pown shell`

```
pown shell [options]

Simple shell

Options:
  --version  Show version number  [boolean]
  --help     Show help  [boolean]
```
