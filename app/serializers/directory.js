import Ember from 'ember';
import DS from 'ember-data';
import {parseList,listToJsonApi} from '../utils/parse-mpd';

const {get,getProperties} = Ember;

function parentId(str) {
	let lastIndex = str.lastIndexOf('/');
	return lastIndex && str.substr(0, lastIndex) || '';
}

export default DS.JSONAPISerializer.extend({
	normalizeResponse(store, primaryModelClass, payload, id, requestType) {
		let parsed = parseList(payload, 'directory', 'playlist', 'file');

		let data = {
			directory: listToJsonApi(parsed, 'directory', dir => ({
				subDirs: {
					links: {
						related: `lsinfo ${dir.directory}`
					}
				},
				files: {
					links: {
						related: `lsinfo ${dir.directory}`
					}
				},
				parentDir: {
					id: parentId(dir.directory),
					type: 'directory'
				}
			})),
			file: listToJsonApi(parsed, 'file', file => ({
				directory: {
					id: parentId(file.file),
					type: 'directory'
				}
			}))
		};

		return {
			data: data[primaryModelClass.modelName].map(d => getProperties(d, 'id', 'type')),
			included: [...data.directory, ...data.file]
		}
	}
});
