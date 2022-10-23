const { parentPort } = require('worker_threads')

parentPort.on('message', () => {
  parentPort.postMessage({
    type: 'new-type',
    label: 'new-label',
    props: { title: 'It works!' },
  })
})
