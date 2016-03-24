import Ember from 'ember';

const {get} = Ember;

export default Ember.Component.extend({
	tagName: 'span',
	boundUpdate: null,
	change() {
		let newVal = this.$('input').val();
		get(this, 'attrs.value').update(newVal);
	}
});
