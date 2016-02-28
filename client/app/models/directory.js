import DS from 'ember-data';

export default DS.Model.extend({
	directory: DS.attr('string'),
	parentDir: DS.belongsTo('directory', {inverse:'subDirs'}),
	subDirs: DS.hasMany('directory', {inverse:'parentDir'}),
	files: DS.hasMany('file'),
});
