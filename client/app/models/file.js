import DS from 'ember-data';

export default DS.Model.extend({
	directory: DS.belongsTo('directory')
});
