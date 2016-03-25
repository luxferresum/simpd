import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return this.store.findRecord('mpd', 'labblaster:6600');
	}
});
