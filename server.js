import express from 'express'
import http from 'http'
import io from 'socket.io'
import {Observable} from 'rxjs'

const port = 3000

const app = express()

const server = http.server(app)

const io = io(server)

const socket_observables = ((io, events) =>
    events.reduce((observables, event) =>
        ({
            ...observables,
            [event]: socket_observable.connection.flatMap(({socket}) =>
                Observable.fromEvent(socket, event)
                    .map(data => ({socket, data})))
        }), {
            connection: Observable.fromEvent(io, 'connection')
                .map(socket => ({socket}))
        })
)(io, [
    'disconnection',
    'disconnecting',
    'error',
    'command'
])

http.listen(port, () => console.log('listening on port: ' + port))