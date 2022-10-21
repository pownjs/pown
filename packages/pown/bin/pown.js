#!/usr/bin/env node

const boot = async () => {
  const path = require('path')
  const {
    ensurePreferencesFilename,
    getPreferencesDirectory,
  } = require('@pown/preferences')

  // stage1: setup pown root

  if (!process.env.POWN_ROOT) {
    process.env.POWN_ROOT = path.join(__dirname, '..')
  }

  // stage2: setup pown modules

  await ensurePreferencesFilename('modules', 'package.json')

  const dirname = getPreferencesDirectory('modules')

  process.env.POWN_PATH = [
    dirname,
    ...(process.env.POWN_PATH ? [process.env.POWN_PATH] : []),
  ].join(path.delimiter)

  // stage4: launch

  require('@pown/cli/bin/cli')
}

boot().catch((error) => {
  console.error(error)

  process.exit(1)
})
