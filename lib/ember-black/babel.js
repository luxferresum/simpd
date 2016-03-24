/*jshint node:true*/
"use strict";

const Plugin = require('broccoli-plugin');
const Promise = require("bluebird");

const babel = Promise.promisifyAll(require("babel-core"));

const fs = Promise.promisifyAll(require("fs"));
const symlinkOrCopySync = require('symlink-or-copy').sync;
const walkSync = require('walk-sync');
// const checksumFileAsync = Promise.promisify(require('checksum').file);
const path = require('path');
// const flat = Array.prototype.concat.apply.bind(Array.prototype.concat, Array.prototype);

function build() {
	return Promise.all(this.inputPaths.map(inputPath => {
		return Promise.all(walkSync(inputPath)
			.map(p => ({
				in: path.join(inputPath, p),
				out: path.join(this.outputPath, p),
			}))
			.map(p => {
				if(p.in.endsWith('/')) {
					fs.mkdirSync(p.out);
				} else if(p.in.endsWith('.js')) {
					return babel.transformFileAsync(p.in, this.options)
						.then(data => fs.writeFileAsync(p.out, data.code, {
							encoding: 'utf8'
						}));
				} else {
					symlinkOrCopySync(p.in, p.out)
				}
			}));
	}));
}

function Babel(inputNodes, options) {
	Plugin.call(this, inputNodes);
	this.options = options;
}

Babel.prototype.constructor = Babel;
Babel.prototype = Object.create(Plugin.prototype);
Babel.prototype.build = build;

module.exports = Babel;