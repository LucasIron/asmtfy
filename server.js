const express = require('express')
const http = require('http')
const path = require('path')

const app = express()
const server = http.Server(app)

const port = process.env.PORT || 3000

app.set('port', port)
app.use(express.static(__dirname + '/public'))

const sendFile = filePath => (request, response) => response.sendFile(path.join(__dirname, filePath))
app.get('/', sendFile('/public/menu.html'))
app.get('/game', sendFile('/public/game.html'))


server.listen(port, () => console.log('Server listening at port ' + port + '.'))