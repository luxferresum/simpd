import Ember from 'ember';
import io from 'socket.io';

const socket = io();

export function cmd(host, port, cmd) {
	return send('cmd', {
		host,
		port,
		cmd,
	});
}

function send(event,data) {
	return new Ember.RSVP.Promise((resolve,reject) => {
		socket.emit(event,data, ({ok,data}) => {
			if(ok) {
				resolve(data);
			} else {
				reject(data);
			}
		});
	});
}

export function subscribe(host, port, store, id) {
	socket.emit('subscribe', {
		host,
		port,
	}, ({ok, data}) => {
		if(!ok) {
			throw data;
		}

		store.find('mpd', id).reload();
	});
}