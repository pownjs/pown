#!/usr/bin/env bash

set -e

for dir in packages/*; do mkdir -p $dir/test; done

find packages -maxdepth 2 -type d -name test -exec cp test/env.test.js '{}' ';'
