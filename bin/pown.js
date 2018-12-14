#!/usr/bin/env node

if (!process.env.POWN_ROOT) {
    process.env.POWN_ROOT = require('path').join(__dirname, '..')
}

require('@pown/cli/bin/cli')
