import Ember from 'ember';
import ApplicationAdapter from './application';

const {get} = Ember;

export default ApplicationAdapter.extend({
	// query(store, type, query) {
	// 	if(query.root) {
	// 		return get(this, 'mpd').cmd('lsinfo /');
	// 	}
	// },
	// findHasMany(store, snapshot, link, relationship) {
	// 	alert('many');
	// 	console.log('find has many');
	// 	debugger;
	// 	// return this.ajax('/cmd', 'POST', { 
	// 	// 	data: `lsinfo ${snapshot.id}`
	// 	// });
	// }
});
