module.exports = async ({ shq }) => {
  const message = 'adding targets...'

  await shq`echo ${message}`

  await shq`echo TEST=${process.env.TEST}`

  await shq`recon add --node-type domain target.com`
}
