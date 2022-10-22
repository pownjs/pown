/**
 * This is an example of `pown exec` dynamic embedding.
 */

module.exports = (recon) => {
  recon.add([
    {
      type: 'domain',
      label: 'secapps.com',
    },
    {
      type: 'domain',
      label: 'websecurify.com',
    },
  ])
}
