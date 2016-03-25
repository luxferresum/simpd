import Ember from 'ember';
import DS from 'ember-data';
import {parseAttrs} from '../utils/parse-mpd';
import io from 'socket.io';

const {get,set} = Ember;

function send(socket,event,data) {
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
	onInit: Ember.on('init', function() {
		set(this, 'socket', io());
	}),
	cmd(command) {
		return send(get(this, 'socket'), {
			host: 'labblaster',
			port: 6600,
			cmd: 'lsinfo /',
		});
	}
	// ajax: Ember.inject.service(),
	// cmd(command) {
	// 	console.log(`request command: ${command}`);
	// 	return get(this, 'ajax').request('/cmd', {
	// 		type: "POST",
	// 		url:'/cmd',
	// 		contentType: "text/text; charset=utf-8",
	// 		dataType: "text",
	// 		data: command
	// 	});
	// 	// return get(this, 'ajax')({
	// 	// 	type: "POST",
	// 	// 	url:'/cmd',
	// 	// 	contentType: "text/text; charset=utf-8",
	// 	// 	dataType: "text",
	// 	// 	data: command
	// 	// });
	// },
	// status: Ember.computed('ajax', {
	// 	get() {
	// 		// return get(this, 'ajax').request('/cmd', {
	// 		// 	method: 'POST',
	// 		// 	// data: {
	// 		// 	// 	foo: 'bar'
	// 		// 	// }
	// 		// });
	// 		let promise = this.cmd('status').then(d => parseAttrs(d))
	// 		return DS.PromiseObject.create({promise})
	// 	}
	// }),
	// volume: Ember.computed('status.volume', {
	// 	get() {
	// 		return get(this, 'status.volume');
	// 	},
	// 	set(key, val) {
	// 		get(this, 'ajax').request('/mpd-service/volume', {
	// 			method: 'PATCH',
	// 			data: {
	// 				volume: val
	// 			}
	// 		})
	// 	}
	// })
});
