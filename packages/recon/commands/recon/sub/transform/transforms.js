const { extractSync } = require('@pown/modules')
const { getPreferencesSync } = require('@pown/preferences')

const { buildRemoteTransforms } = require('../../../../lib/remote')

const getCompoundTransforms = () => {
  const { remotes = {} } = getPreferencesSync('recon')

  const remoteTransforms = buildRemoteTransforms(remotes)

  const { loadableTransforms } = extractSync()

  return {
    ...remoteTransforms,

    ...Object.assign(
      {},
      ...loadableTransforms.map((module) => {
          let transforms

          try {
            transforms = require(module)
          } catch (e) {
            if (process.env.POWN_DEBUG) {
              console.error(e)
            }

            return {}
          }

          return Object.assign(
            {},
            ...Object.entries(transforms).map(([name, Transform]) => {
              return {
                [name]: class extends Transform {
                  static loadableTransformModule = module
                  static loadableTransformName = name
                },
              }
            })
          )
        })
    ),
  }
}

module.exports = { getCompoundTransforms }
