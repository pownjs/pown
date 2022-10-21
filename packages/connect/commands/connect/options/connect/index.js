module.exports = {
  'connect-timeout': {
    alias: ['t', 'timeout'],
    type: 'number',
    describe: 'Maximum time allowed for connection',
    default: 30000,
  },

  'data-timeout': {
    alias: ['T'],
    type: 'number',
    describe: 'Maximum time allowed for connection',
    default: 30000,
  },

  'accept-unauthorized': {
    alias: ['k', 'insecure'],
    type: 'boolean',
    describe: 'Accept unauthorized TLS errors',
    default: false,
  },

  tls: {
    alias: [],
    type: 'boolean',
    describe: 'Connect with TLS',
    default: false,
  },
}
