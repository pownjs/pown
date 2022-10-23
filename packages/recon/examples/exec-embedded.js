module.exports = async (_, { stq }) => {
    const message = 'adding targets...'

    await stq`echo ${message}`

    await stq`recon add --node-type domain target.com`
}
