const path = require('path')
const express = require('express')
const httpProxy = require('http-proxy')
const webpack = require('webpack')
const webpackConfig = require('../webpack.config')
const compiler = webpack(webpackConfig)

const host = 'localhost'
const port = 8080
const discoveryServiceEndpoint = 'http://b-dev1047.pk.de:9295/api'
const root = path.join(__dirname, '../')
const app = express()
const proxy = httpProxy.createProxyServer()

app.use(require('webpack-dev-middleware')(compiler))
app.use(require('webpack-hot-middleware')(compiler))

app.use(express.static(root))

app.get(['/api/hspobjects', '/api/hspobjects/*'], function (req, res) {
  req.url = req.url.replace('/api', '')
  proxy.web(req, res, {
    target: discoveryServiceEndpoint,
    changeOrigin: true,
  })
})

app.get('/*', function (req, res) {
  res.sendFile(path.join(root, 'index.html'))
})

app.listen(port, host, function () {
  console.log(`server listening on port ${port}`)
})
