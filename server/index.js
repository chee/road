require('dotenv').config()

const {resolve} = require('path')
const serve = require('serve')

const {env} = process

const publicPath = env.PUBLIC_PATH || resolve(__dirname, '../client/public')

serve(publicPath, {
  port: env.HTTP_PORT
})
