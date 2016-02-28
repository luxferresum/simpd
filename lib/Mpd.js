"use strict";

import MpdNetClient from './MpdNetClient.js'

const clientSymbol = Symbol()

function parseAttrs(attrs) {
	return attrs.split('\n').reduce((result, attr) => {
		let parts = attr.split(': ')
		result[parts[0]] = parts[1]
		return result
	}, {});
}

function parseList(str, ...startNames) {
	return str.split('\n').map(str => str.split(': ')).reduce((res, pair) => {
		console.log('process pair', pair);
		if(startNames.indexOf(pair[0]) !== -1) {
			console.log('set curr')
			res.arr.push(res.curr = {})
		}
		res.curr[pair[0]] = pair[1];
		return res;
	}, {arr:[]}).arr;
}

export default class Mpd {
	constructor(host, port) {
		this[clientSymbol] = new MpdNetClient(host, port)
	}

	async pause() {
		return await this[clientSymbol].cmd(`pause`)
	}

	async update(uri) {
		return await this[clientSymbol].cmd(`update ${uri}`)
	}

	async currentsong() {
		return await this[clientSymbol].cmd(`currentsong`)
	}

	async status() {
		return parseAttrs(await this[clientSymbol].cmd(`status`))
	}

	async stats() {
		return parseAttrs(await this[clientSymbol].cmd(`stats`))
	}

	async setvol(vol) {
		return await this[clientSymbol].cmd(`setvol ${vol}`)
	}

	async shuffle() {
		return await this[clientSymbol].cmd(`shuffle`)
	}

	async listplaylists() {
		return await this[clientSymbol].cmd(`listplaylists`)
	}

	async find(type, what) {
		return await this[clientSymbol].cmd(`find ${type} ${what}`)
	}

	async lsinfo(uri) {
		return parseList(await this[clientSymbol].cmd(`lsinfo ${uri}`), 'directory', 'playlist', 'file')
	}
};