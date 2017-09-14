const {resolve} = require('path')
const {promisify} = require('util')
const fs = require('fs')
const {parse} = require('dotenv')
const mu2 = require('mu2')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const {createWriteStream} = fs

const dotEnvFile = resolve(__dirname, '..', '.env')
const publicDir = resolve(__dirname, '..', 'public')
const indexFile = resolve(publicDir, 'index.html')
const templateFile = resolve(publicDir, 'index.html.mustache')

readFile(dotEnvFile)
  .then(parse)
  .then(env => {
    const readStream = mu2.compileAndRender(templateFile, env)
    const writeStream = createWriteStream(indexFile)
    readStream.pipe(writeStream)
  })
