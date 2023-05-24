const path = require('path')
const express = require('express')
const httpProxy = require('http-proxy')

const host = 'localhost'
const port = 8080
const discoveryServiceEndpoint = 'http://localhost:9295/api'
const root = path.join(__dirname, '../dist')
const app = express()
const proxy = httpProxy.createProxyServer()

app.use(express.static(root))

app.get(
  ['/api/search/hspobjects', '/api/search/hspobjects/*'],
  function (req, res) {
    req.url = req.url.replace('/api/search', '')
    proxy.web(req, res, {
      target: discoveryServiceEndpoint,
      changeOrigin: true,
    })
  }
)

app.get('/*', function (req, res) {
  res.sendFile(path.join(root, 'index.html'))
})

app.listen(port, host, function () {
  console.log(`server listening on port ${port}`)
})
