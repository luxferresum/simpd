import Ember from 'ember';

const {get} = Ember;

export default Ember.Component.extend({
	store: Ember.inject.service('store'),
	rootNodes: Ember.computed({
		get() {
			let store = get(this, 'store');
			return store.query('directory', { root: true });
		}
	}),
});
