#!/usr/bin/env bash

set -e

find packages/* -maxdepth 0 -type d -exec cp LICENSE '{}' ';'
