const fs = require('fs')
const path = require('path')

const main = async () => {
    const packagesDir = path.join(__dirname, '..', 'packages')

    for (const dir of fs.readdirSync(packagesDir)) {
        const packageFile = path.join(packagesDir, dir, 'package.json')

        const packageJSON = fs.readFileSync(packageFile)

        const package = JSON.parse(packageJSON.toString())

        package.version = process.env.npm_new_version

        fs.writeFileSync(packageFile, JSON.stringify(package, '', 2) + '\n')
    }
}

main().catch(console.error)
