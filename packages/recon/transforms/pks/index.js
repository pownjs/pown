const querystring = require('querystring')

const { makeId } = require('../../lib//utils')
const { isEmail } = require('../../lib//detect')
const { Transform } = require('../../lib//transform')
const { DOMAIN_TYPE, EMAIL_TYPE } = require('../../lib//types')

const pksLookupKeys = class extends Transform {
  static get alias() {
    return ['pks_lookup_keys', 'pkslk']
  }

  static get title() {
    return 'PKS Lookup'
  }

  static get description() {
    return 'Look the the PKS database at pool.sks-keyservers.net which pgp.mit.edu is part of'
  }

  static get group() {
    return this.title
  }

  static get tags() {
    return ['ce']
  }

  static get types() {
    return [DOMAIN_TYPE, EMAIL_TYPE]
  }

  static get options() {
    return {}
  }

  static get priority() {
    return 1
  }

  static get noise() {
    return 1
  }

  async handle({ id: source = '', label = '' }) {
    const query = querystring.stringify({
      search: label,
      op: 'index',
    })

    const server = 'https://keyserver.ubuntu.com'

    const { responseBody } = await this.scheduler.tryRequest({
      uri: `${server}/pks/lookup?${query}`,
      maxRetries: 5,
    })

    const text = responseBody.toString()
    const regx = /<pre>([\s\S]+?)<\/pre>/g

    const results = []

    let match

    while ((match = regx.exec(text))) {
      let inner = match[1] || ''

      if (inner.length > 1024) {
        continue // NOTE: too big and probably junk
      }

      inner = inner
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')

      let key = ''
      let uri = ''
      let content = ''

      const innerMatch = inner.match(
        /<a href="(?<uri>[\s\S]+?)">(?<key>[\s\S]+?)<\/a>[\s\S]+?<a href="[\s\S]+?">[\s\S]+?<\/a>(?<content>[\s\S]*)/
      )

      if (innerMatch) {
        uri = `${server}${innerMatch.groups.uri.trim()}`
        key = innerMatch.groups.key.trim()
        content = innerMatch.groups.content.trim()
      }

      if (key && uri) {
        if (!/^rsa/.test(key)) {
          continue
        }

        const keyNode = {
          id: makeId('pks:key', key),
          type: 'pks:key',
          label: key,
          props: { uri, key },
          edges: [source],
        }

        results.push(keyNode)

        let emailRegex =
          /<span class="uid">(?<name>.+?)<(?<email>.+?)><\/span>/g

        let emailMatch

        while ((emailMatch = emailRegex.exec(content))) {
          const name = emailMatch.groups.name.trim()
          const email = emailMatch.groups.email.trim()

          if (!isEmail(email)) {
            return
          }

          const emailNode = {
            id: makeId('email', email),
            type: 'email',
            label: email,
            props: { email, name },
            edges: [keyNode.id],
          }

          results.push(emailNode)

          if (name) {
            results.push({
              id: makeId('person', name),
              type: 'person',
              label: name,
              props: { name, email },
              edges: [emailNode.id],
            })
          }
        }
      }
    }

    return results
  }
}

module.exports = { pksLookupKeys }
