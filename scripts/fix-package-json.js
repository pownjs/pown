const fs = require('fs')
const path = require('path')

const main = async () => {
    const packagesDir = path.join(__dirname, '..', 'packages')

    for (const dir of fs.readdirSync(packagesDir)) {
        const packageFile = path.join(packagesDir, dir, 'package.json')

        const packageJSON = fs.readFileSync(packageFile)

        const package = JSON.parse(packageJSON.toString())

        package.main = 'lib/index.js'

        package.scripts.test = 'NODE_ENV=test npx -y mocha@latest'

        package.homepage = `https://github.com/pownjs/pown.git/packages/${dir}#readme`,

            package.license = 'MIT'

        package.repository = {
            type: 'git',
            url: `git+https://github.com/pownjs/pown.git/packages/${dir}`
        }

        package.bugs = {
            url: "https://github.com/pownjs/pown/issues"
        }

        package.engines = {
            node: '>=14'
        }

        package.publishConfig = {
            access: 'public',
            registry: 'https://registry.npmjs.org/'
        }

        fs.writeFileSync(packageFile, JSON.stringify(package, '', 2))
    }
}

main().catch(console.error)
