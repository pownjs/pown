module.exports = {
    'content-sniff-size': {
        alias: ['content-sniff', 'sniff-size'],
        type: 'number',
        describe: 'Specify the size of the content sniff',
        default: 5
    },

    'print-response-data': {
        alias: ['print-data'],
        type: 'boolean',
        describe: 'Print response data',
        default: false
    },

    'download-response-data': {
        alias: ['download-data'],
        type: 'boolean',
        describe: 'Download response data',
        default: false
    }
}
