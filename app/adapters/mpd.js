import Ember from 'ember';
import ApplicationAdapter from './application';
import {cmd,subscribe} from '../utils/mpd';
import {parseAttrs} from '../utils/parse-mpd';

const {get} = Ember;

export default ApplicationAdapter.extend({
	findRecord(store, type, id, snapshot) {
		let [host, port] = id.split(':');

		return cmd(host, port, 'status').then(data => {

			subscribe(host, port, store, id);

			return {
				data: {
					id: id,
					type: 'mpd',
					attributes: Object.assign({
						host,
						port,
					}, parseAttrs(data))
				}
			};
		});
	}
});
