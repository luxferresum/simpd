import Ember from 'ember';

const {get} = Ember;

export default Ember.Component.extend({
	mpd: Ember.inject.service('mpd')
});
