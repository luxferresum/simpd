import Ember from 'ember';

const {get,set} = Ember;

export default Ember.Component.extend({
	showDetail: false,
	actions: {
		toggleDetail() {
			set(this, 'showDetail', !get(this, 'showDetail'));
		}
	}
});
