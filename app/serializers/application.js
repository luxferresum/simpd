import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
	mpd: Ember.inject.service(),
});
