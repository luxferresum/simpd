import Ember from 'ember';
import DS from 'ember-data';

const {get,set} = Ember;

export default DS.Model.extend({
	port: DS.attr('number'),
	host: DS.attr('string'),

	volume: DS.attr('number'),
	isPlaying: Ember.computed('state', {
		get() {
			return get(this, 'state') === 'play';
		},
		set(key, val) {
			return set(this, 'state', val ? 'play' : 'pause');
		}
	}),

	state: DS.attr('string'),

	repeat: DS.attr('boolean'),
	random: DS.attr('boolean'),
	single: DS.attr('boolean'),


	// consume: 0
	// playlist: 166
	// playlistlength: 1
	// mixrampdb: 0.000000
	
	// xfade: 5
	// song: 0
	// songid: 25
	// time: 130:0
	// elapsed: 130.403
	// bitrate: 77
	// audio: 44100:f:2

	rootDirs: DS.hasMany('directory'),
});
