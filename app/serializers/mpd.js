import Ember from 'ember';
import DS from 'ember-data';
import ApplicationSerializer from './application';
import {parseList,listToJsonApi} from '../utils/parse-mpd';
import {parseAttrs} from '../utils/parse-mpd';

const {get,getProperties} = Ember;

export default ApplicationSerializer.extend({
	normalizeResponse(store, primaryModelClass, payload, id, requestType) {
		let {host, port, payloadData} = payload;
		
		let mpd = get(this, 'mpd');
		return {
			data: {
				id: id,
				type: 'mpd',
				attributes: parseAttrs(payloadData),
				relationships: {
					rootDirs: {
						links: {
							related: mpd.buildLink(host, port, 'lsinfo /'),
						},
					},
				},
			},
		};
	}
});
