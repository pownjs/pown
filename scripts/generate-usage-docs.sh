#!/usr/bin/env bash

COMMANDS="pown"
SUBCOMMANDS="modules update buster credits dicts duct figlet preferences proxy recon script shell whoarethey"

export POWN_ROOT=.

for C in $COMMANDS
do
    echo '## Usage'
    echo
    echo '```'
    $C --help
    echo '```'
    echo

    for SC in $SUBCOMMANDS
    do
        echo "### \`$C $SC\`"
        echo
        echo '```'
        $C $SC --help
        echo '```'
        echo
    done
done
