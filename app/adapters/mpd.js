import Ember from 'ember';
import ApplicationAdapter from './application';
// import {cmd,subscribe} from '../utils/mpd';

const {get} = Ember;

export default ApplicationAdapter.extend({
	findRecord(store, type, id, snapshot) {
		let [host, port] = id.split(':');
		return get(this, 'mpd').cmd(host, port, 'status');

		// return get(this, 'mpd').cmd(host, port, 'status').then(data => {
		// 	return {
		// 		data: {
		// 			id: id,
		// 			type: 'mpd',
		// 			attributes: Object.assign({
		// 				host,
		// 				port,
		// 			}, parseAttrs(data))
		// 		}
		// 	};
		// });
	}
});
