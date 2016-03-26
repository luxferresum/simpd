import Ember from 'ember';

const {set} = Ember;

export default Ember.Route.extend({
	model() {
		return this.store.findRecord('mpd', 'labblaster:6600');
	},
	actions: {
		play(mpd) {
			set(mpd, 'isPlaying', true);
			mpd.save();
		},
		pause(mpd) {
			set(mpd, 'isPlaying', false);
			mpd.save();
		},
	}
});
