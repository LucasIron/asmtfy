import express from 'express';
import http from 'http';
import { List } from 'Immutable.js';
import socket_observables from 'socket_observables';
import io from 'socket.io';

const port = 3000;

const app = express();

const server = http.server(app);

const io = io(server);

const socket_observables = socket_observables(io, List([ 'command' ]));

http.listen(port, () => console.log('listening on port: ' + port));