"use strict";

import MpdConnection from 'mpdlib';

const connectionSymbol = Symbol();

async function cmd(command) {
	let connection = await this[connectionSymbol];
	return await connection.command(command);
}

export default class Mpd {
	constructor(host, port) {
		this[connectionSymbol] = MpdConnection(host, port);
	}

	async pause() {
		return await this::cmd('pause');
	}

	async currentsong() {
		return await this::cmd('currentsong');
	}
};