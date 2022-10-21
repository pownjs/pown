module.exports = {
  'filter-response-code': {
    alias: ['response-code', 'filter-status'],
    type: 'string',
    describe: 'Filter responses with code',
    default: '',
  },

  'content-sniff-size': {
    alias: ['content-sniff', 'sniff-size'],
    type: 'number',
    describe: 'Specify the size of the content sniff',
    default: 5,
  },

  'print-response-body': {
    alias: ['print-body'],
    type: 'boolean',
    describe: 'Print response body',
    default: false,
  },

  'download-response-body': {
    alias: ['download-body'],
    type: 'boolean',
    describe: 'Download response body',
    default: false,
  },
}
