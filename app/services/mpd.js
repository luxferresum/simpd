import Ember from 'ember';
// import DS from 'ember-data';
// import {parseAttrs} from '../utils/parse-mpd';
import io from 'socket.io';

const {get,set} = Ember;

function send(socket, event, data) {
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

export default Ember.Service.extend({
	store: Ember.inject.service(),
	onInit: Ember.on('init', function() {
		set(this, 'socket', io());

		get(this, 'socket').on('changed', ({data, id}) => {
			console.log('changed');
			let mpd = get(this, 'store').peekRecord('mpd', id)
			if(mpd) {
				mpd.reload();
			}
		})
	}),
	buildLink(host, port, cmd) {
		return JSON.stringify({host, port, cmd});
	},
	link(link) {
		let {host, port, cmd} = JSON.parse(link);
		return this.cmd(host, port, cmd);
	},
	cmd(host, port, cmd) {
		return send(get(this, 'socket'), 'cmd', {
			host,
			port,
			cmd,
		}).then(payloadData => ({
			host,
			port,
			payloadData,
		}));
	}
});
