const inquirer = require('inquirer')

const prompt = (...args) => {
    return inquirer.prompt(...args)
}

module.exports = { prompt }
