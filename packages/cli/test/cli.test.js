const assert = require('assert')
const { setTimeout } = require('timers')

const cli = require('../lib/cli')

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

describe('cli', () => {
  describe('#parse', () => {
    it('parses command', () => {
      assert.deepEqual(cli.parse('a b c'), ['a', 'b', 'c'])
    })

    it('parsesed command returns strings', () => {
      assert.equal(typeof cli.parse(`a 1`)[1], 'string')
    })

    it('parsesed command returns options', () => {
      assert.deepEqual(cli.parse('a -b -c'), ['a', '-b', '-c'])
    })

    it('parses command with envs', () => {
      assert.deepEqual(cli.parse(`a $B`, {}), ['a', ''])
      assert.deepEqual(cli.parse(`a $B`, { B: 'b' }), ['a', 'b'])
      assert.deepEqual(cli.parse(`a $B '$C'`, { B: 'b' }), ['a', 'b', '$C'])
      assert.deepEqual(cli.parse(`a $B '$C' "d $E"`, { B: 'b', E: 'e' }), [
        'a',
        'b',
        '$C',
        'd e',
      ])
      // assert.deepEqual(cli.parse(`a $B '$C' "d $E" $F`, { B: 'b', E: 'e', F: 'f g h' }), ['a', 'b', '$C', 'd e', 'f g h']) // NOTE: disabled due to https://github.com/ljharb/shell-quote/issues/1
    })

    it('parses command with special vars', () => {
      assert.deepEqual(cli.parse(`a $@`, {}), ['a', ''])
      // assert.deepEqual(cli.parse(`a $@`, { '@': 'b c' }), ['a', 'b', 'c']) // NOTE: disabled due to https://github.com/ljharb/shell-quote/issues/1
    })
  })

  describe('#execute', () => {
    it('handles undefined handlers', async () => {
      const inlineCommands = [
        {
          yargs: {
            command: 'test',
            describe: 'test',
          },
        },
      ]

      await cli.execute('test', { inlineCommands })
    })

    it('execs async', async () => {
      const inlineCommands = [
        {
          yargs: {
            command: 'foo',

            handler: async () => {
              await sleep(1000)
            },
          },
        },
      ]

      await cli.execute('foo', { inlineCommands })
    }).timeout(2000)

    it('execs async with subcommands', async () => {
      const inlineCommands = [
        {
          yargs: {
            command: 'foo <subcommand>',

            builder: (yargs) => {
              yargs.command({
                command: 'bar',

                handler: async () => {
                  await sleep(1000)
                },
              })
            },
          },
        },
      ]

      await cli.execute('foo bar', { inlineCommands })
    }).timeout(2000)

    /**
     * This behaviour does not seem to be supported in later versions of yargs
     * which we believe it is a bug. This is why we only support yargs version
     * 13 until a better solution is identified. This is also the reason why
     * async builders are also not supported.
     */
    it('check if varadic args can be passed after --', async () => {
      const inlineCommands = [
        {
          yargs: {
            command: 'echo <strings...>',

            handler: async ({ strings }) => {
              assert.deepEqual(strings, ['a', 'b', 'd']) // NOTE: it should really also capture -c but yars is kind of messy and broken
            },
          },
        },
      ]

      await cli.execute('echo -- a b -c d', { inlineCommands })
    })
  })
})
