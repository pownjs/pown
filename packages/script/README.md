[![Follow on Twitter](https://img.shields.io/twitter/follow/pownjs.svg?logo=twitter)](https://twitter.com/pownjs)
[![NPM](https://img.shields.io/npm/v/pown.svg)](https://www.npmjs.com/package/pown)
[![Fury](https://img.shields.io/badge/version-3x%20Rage-red.svg)](https://github.com/pownjs/lobby)
![default workflow](https://github.com/pownjs/git/actions/workflows/default.yaml/badge.svg)
[![SecApps](https://img.shields.io/badge/credits-SecApps-black.svg)](https://secapps.com)

# Pown Script

Pown Script is a simple scripting environment. The key advantage of using Pown Script instead of Bash, Python, Perl, etc, is because all commands are executed within the same VM context (same process). Commands such as [Pown Recon](https://github.com/pownjs/pown-script) take advantage of this by keeping a global model of its graph, thus, removing the need to save into intermediate files upon each command execution.

Pown Script implements some some standard commands such as `echo`, `sleep` and even `set`. This is done for interoperability. Every pown script is also a valid bash script.
