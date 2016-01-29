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

export default class Mpd {
	constructor(host, port) {
		this[clientSymbol] = new MpdNetClient(host, port)
	}

	async pause() {
		return await this[clientSymbol].cmd(`pause`)
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
		return await this[clientSymbol].cmd(`lsinfo ${uri}`)
	}
};