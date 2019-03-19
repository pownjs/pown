[![Follow on Twitter](https://img.shields.io/twitter/follow/pownjs.svg?logo=twitter)](https://twitter.com/pownjs)
[![NPM](https://img.shields.io/npm/v/pown.svg)](https://www.npmjs.com/package/pown)
[![Fury](https://img.shields.io/badge/version-2x%20Fury-red.svg)](https://github.com/pownjs/lobby)

# Pown

Pown.js is a security testing and exploitation toolkit built on top of Node.js and NPM. Unlike traditional security tools like Metasploits, Pown.js considers frameworks to be an anti-pattern. Therefore, each module in Pown is in fact a standalone NPM module allowing greater degree of reuse and flexibility. Creating new modules is a matter of publishing to NPM and tagging it with the correct tags. The rest is handled automatically.

## Quickstart

Install Pown.js globally with npm or yarn.

```sh
$ npm install -g pown@latest
```

## Usage

```
pown [options] <command> [command options]

Commands:
  pown modules <command>               Module manager  [aliases: module, m]
  pown update [options]                Update global installation of pown  [aliases: upgrade, up]
  pown buster <command>                Multi-service bruteforce discovery tool  [aliases: bust]
  pown credits [options]               list contributors and credits
  pown dicts [options] <search>        Assorted Dictionaries
  pown duct <command>                  Side-channel attack enabler  [aliases: ducting, d]
  pown figlet <text>                   Generate figlet
  pown preferences <command>           Preferences  [aliases: prefs]
  pown proxy [options] [command]       HTTP proxy
  pown recon <command>                 Target recon
  pown script [file|script] [args...]  Simple scripting engine for automating pown commands.
  pown shell [options]                 Simple shell
  pown whoarethey <accounts...>        find social networking accounts and more

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
pown buster <command>

Multi-service bruteforce discovery tool

Commands:
  pown buster web [options] <url>       Web file and directory bruteforcer (a.k.a dirbuster)
  pown buster email [options] <domain>  Email bruteforce discovery tool (via smtp)  [aliases: emails]

Options:
  --version  Show version number  [boolean]
  --help     Show help  [boolean]
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

### `pown figlet`

```
pown figlet <text>

Generate figlet

Options:
  --version   Show version number  [boolean]
  --help      Show help  [boolean]
  --font, -f  FIGlet font to use  [string] [default: "Standard"]
  --fg        Foreground color  [choices: "default", "black", "red", "green", "yellow", "blue", "magenta", "cyan", "white", "gray", "grey"] [default: "default"]
  --bg        Background color  [choices: "default", "black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"] [default: "default"]
  --bold      Make it bold  [boolean] [default: false]
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
  --certs-dir               Directory for the certificates  [string] [default: "/home/ec2-user/.pown/proxy/certs"]
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
  pown recon import <file>                Import file  [aliases: i]
  pown recon export <file>                Export to file  [aliases: e]

Options:
  --version  Show version number  [boolean]
  --help     Show help  [boolean]
```

### `pown script`

```
pown script [file|script] [args...]

Simple scripting engine for automating pown commands.

Options:
  --version      Show version number  [boolean]
  --help         Show help  [boolean]
  --command, -c  Evaluate inline commands  [boolean] [default: false]
  --exit, -e     Exit immediately  [boolean] [default: false]
  --expand, -x   Expand command  [boolean] [default: false]
  --skip, -s     Skip number of lines  [number] [default: 0]
```

### `pown shell`

```
pown shell [options]

Simple shell

Options:
  --version  Show version number  [boolean]
  --help     Show help  [boolean]
```

### `pown whoarethey`

```
pown whoarethey <accounts...>

find social networking accounts and more

Options:
  --version  Show version number  [boolean]
  --help     Show help  [boolean]
```

## Modules

Pown.js comes with several builtin modules for convenience. However, additional modules can be installed directly from the NPM registry using `pown modules` command. Optional modules are installed in the current users's home folder under `.pown/modules`.
