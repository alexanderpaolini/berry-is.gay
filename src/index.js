const express = require('express')

require('dotenv').config()
const PORT = parseInt(process.env['PORT'])
const BERRY = process.env['BERRY']

if (!PORT) throw new Error('PORT environment variable not provided')
if (BERRY !== 'GAY') throw new Error('BERRY environment variable not gay')

/**
 * @typedef Link
 * @property {string} name
 * @property {string[]} aliases
 * @property {string} path
 * @property {"video" | "image"} type
 */

/**
 * @typedef Links
 * @type {Link[]}
 */

/**
 * @type {Links}
 */
const links = require('./links.json')

/**
 * @type {Links}
 */
const notLoaded = []
/**
 * @type {Links}
 */
const loaded = []

for (const link of links) {
  if (
    typeof link.name !== 'string' ||

    !Array.isArray(link.aliases) ||
    link.aliases.some(e => typeof e !== 'string') ||

    !['image', 'video'].includes(link.type) ||

    !link.path
  ) notLoaded.push(link)
  else loaded.push(link)
}

for (const link of notLoaded) {
  console.warn(
    `Didn't load link "${link.name}"`
  )
}

/**
 * @param {string} path
 * @returns {Link | null} 
 */
function resolveLink (path) {
  const name = path
    .replace(/\//g, '')
    .toLowerCase()

  const link = links.find(
    e => e.name === name ||
      e.aliases.includes(name)
  )

  return link ?? null
}

/**
 * @param {Link} link 
 */
function renderHTML (link) {
  const metaElement = link.type === 'image'
    ? `<meta property="og:image" content="${link.path}">`
    : `<meta property="og:video" content="${link.path}">`

  const bodyElement = link.type === 'image'
    ? `<img src="${link.path}"></img>`
    : `<video controls><source src="${link.path}" type="video/mp4"></video>`

  return `<!DOCTYPE html>
<html>

<head>
  ${metaElement}
  <meta name="twitter:card" content="summary_large_image">
  <title>Berry is gay</title>
</head>

<body>
  ${bodyElement}
</body>

</html>`
}

const app = express()

app
  .get('list', (req, res) => {
    res.status(200)
    res.json(
      loaded.map((link) => {
        return {
          name: link.name,
          aliases: link.aliases,
          type: link.type
        }
      })
    )
  })
  .get('*', (req, res) => {
    const link = resolveLink(req.path)

    res
      .contentType('html')
      .setHeader('berry', 'gay')

    if (!link) {
      res
        .send(
          renderHTML(
            resolveLink('404')
          )
        )
        .status(404)
      return
    }

    const html = renderHTML(link)
    res
      .status(200)
      .send(html)
  })
  .listen(PORT, () => {
    console.log('Started on port', PORT)
  })
