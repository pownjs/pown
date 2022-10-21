const fs = require('fs')
const path = require('path')

const main = async () => {
  const packagesDir = path.join(__dirname, '..', 'packages')

  for (const dir of fs.readdirSync(packagesDir)) {
    const packageFile = path.join(packagesDir, dir, 'package.json')

    const packageJSON = fs.readFileSync(packageFile)

    const pkg = JSON.parse(packageJSON.toString())

    pkg.main = 'lib/index.js'

    pkg.scripts.test = 'NODE_ENV=test npx -y mocha@latest'

    pkg.homepage = `https://github.com/pownjs/pown/tree/master/packages/${dir}#readme`

    pkg.license = 'MIT'

    pkg.repository = {
      type: 'git',
      url: `git+https://github.com/pownjs/pown.git`,
    }

    pkg.bugs = {
      url: 'https://github.com/pownjs/pown/issues',
    }

    pkg.engines = {
      node: '>=14',
    }

    pkg.publishConfig = {
      access: 'public',
      registry: 'https://registry.npmjs.org/',
    }

    if (pkg?.pown?.commands?.length > 0) {
      pkg.scripts.start = 'POWN_ROOT=. pown-cli'

      if (!pkg.peerDependencies) {
        pkg.peerDependencies = {}
      }

      pkg.peerDependencies['@pown/cli'] = '*'

      if (!pkg.devDependencies) {
        pkg.devDependencies = {}
      }

      pkg.devDependencies['@pown/cli'] = '*'
    }

    fs.writeFileSync(packageFile, JSON.stringify(pkg, '', 2) + '\n')
  }
}

main().catch(console.error)
