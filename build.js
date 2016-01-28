"use strict";

const babel =  require('rollup-plugin-babel');
const rollup = require('rollup');
const childProcess = require('child_process');
const path = require('path');

Promise.resolve()
.then(function() {
	console.log("run rollup");
	return rollup.rollup({
		entry: 'index.js',
		plugins: [ babel({
			presets: ['es2015-rollup'],
			plugins: ['syntax-decorators', 'transform-function-bind', ['transform-async-to-module-method', {
				"module": "bluebird",
				"method": "coroutine"
			}]]
		}) ]
	});
})
.then(function(data) {
	console.log("rollup done", data);
	return data.write({
		dest: 'bundle.js',
		format: 'cjs',
		sourceMap: true
	});
}).then(function() {
	if(process.argv.indexOf('with-client') !== -1) {
		let clientPath = path.join(process.cwd(), 'client/');
		console.log('run npm install');
		childProcess.execSync('npm install', {
			cwd: clientPath,
			stdio: [0,1,2]
		});
		console.log('npm install done');

		console.log('run bower install');
		childProcess.execSync('node_modules/bower/bin/bower install', {
			cwd: clientPath,
			stdio: [0,1,2]
		});
		console.log('bower install done');

		console.log('run ember build');
		childProcess.execSync('node_modules/ember-cli/bin/ember build', {
			cwd: clientPath,
			stdio: [0,1,2]
		});
		console.log('ember build done');
	}
})
.then(function() {
	if(process.argv.indexOf('run') !== -1) {
		console.log('run bundle.js');
		console.log('=============\n');
		childProcess.fork('bundle.js');
	}
}, function(err) {
	console.log("error", err);
	// console.log("err", err);
});