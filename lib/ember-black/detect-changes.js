/*jshint node:true*/
"use strict";

const Plugin = require('broccoli-plugin');
const Promise = require("bluebird");

const fs = Promise.promisifyAll(require("fs"));
const symlinkOrCopySync = require('symlink-or-copy').sync;
const walkSync = require('walk-sync');
const checksumFileAsync = Promise.promisify(require('checksum').file);
const path = require('path');
const flat = Array.prototype.concat.apply.bind(Array.prototype.concat, Array.prototype);

function build() {
	return Promise.all(this.inputPaths.map(inputPath => {
		let paths = walkSync(inputPath);
		let files = paths.filter(p => !p.endsWith('/'))
			.map(p => ({
				in: path.join(inputPath, p),
				out: path.join(this.outputPath, p),
			}));

		paths.filter(p => p.endsWith('/'))
			.forEach(p => fs.mkdirSync(path.join(this.outputPath, p)));

		files.forEach(p => symlinkOrCopySync(p.in, p.out));

		let checksums = files.map(p => checksumFileAsync(p.in));

		return Promise.all(checksums)
			.then(c => c.join(';'));
	})).then(checksums => {
		let newHash = checksums.join(';');

		if(!this.hash || newHash !== this.hash) {
			this.onChange(this.cachePath);
			this.hash = newHash;
		}

		console.log('ash',this.hash);
	});
}

function DetectChanges(inputNodes, options) {
	Plugin.call(this, inputNodes);
	this.onChange = options.onChange || () => {};
}

DetectChanges.prototype.constructor = DetectChanges;
DetectChanges.prototype = Object.create(Plugin.prototype);
DetectChanges.prototype.build = build;

module.exports = DetectChanges;