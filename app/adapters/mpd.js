import Ember from 'ember';
import ApplicationAdapter from './application';
// import {cmd,subscribe} from '../utils/mpd';

const {get} = Ember;

export default ApplicationAdapter.extend({
	findRecord(store, type, id, snapshot) {
		let [host, port] = id.split(':');
		return get(this, 'mpd').cmd(host, port, 'status');
	},
	updateRecord(store, type, snapshot) {
		let changed = snapshot.changedAttributes();
		let mpd = get(this, 'mpd');

		let [host, port] = get(snapshot, 'id').split(':');
		
		if(changed['state']) {
			mpd.cmd(host, port, `pause ${changed.state[1] === 'play' ? 0 : 1}`);
		}

		return Ember.RSVP.resolve(undefined);
	},
});
