import { Observable } from 'rxjs';
import { List, Map } from 'Immutable.js';

export default (io, custom_events) => {
    if (custom_events === undefined || typeof custom_events[Symbol.iterator] !== 'function')
        throw 'custom_events must be iterable';

    const socket_events = List([
        'disconnection',
        'disconnecting',
        'error'
    ]);

    const events = socket_events
        .concat(List(custom_events).filter(event =>
            socket_events.concat([ 'connection', 'connect' ]).find(event) === undefined));

    return events.reduce((observables, event) => ({
        ...observables,
        [event]: socket_observable.connection.flatMap(({ socket }) =>
            Observable.fromEvent(socket, event)
                .map(data => Map({ socket, data })))
    }), {
        connection: Observable.fromEvent(io, 'connection')
            .map(socket => Map({ socket }))
    });
};