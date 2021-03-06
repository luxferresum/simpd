"use strict";

import Net from 'net'
import Promise from 'bluebird'

async function connect(host, port) {
	let sock = Net.connect({host, port});
	let version = '';

	await new Promise((resolve, reject) => {
		let errListener = err => {
			sock.removeListener('connect', connectListener)
			reject(err)
		}
		let connectListener = () => {
			sock.removeListener('error', errListener)
			resolve({})
		}

		sock.once('error', errListener);
		sock.once('connect', connectListener);
	})

	await new Promise((resolve, reject) => {
		sock.once('data', d => {
			let str = d.toString();
			if(str.startsWith('OK MPD')) {
				version = str.substr(7)
				resolve({});
			} else {
				reject(`No OK MPD but ${str}`)
			}
		})
	})

	sock.setEncoding('utf8')

	return {sock, version}
}

const versionSymbol = Symbol()
const sockSymbol = Symbol()
const dataArrSymbol = Symbol()
const dataStrSymbol = Symbol()
const currPromiseSymbol = Symbol()

function processResponse() {
	console.log('got response')
	let lastIdxLineBreak = this[dataStrSymbol].length-1

	while(this[dataStrSymbol][lastIdxLineBreak] == '\n') {
		lastIdxLineBreak--
	}

	let lastLine = this[dataStrSymbol].substr(this[dataStrSymbol].substr(0, lastIdxLineBreak+1).lastIndexOf('\n')+1)

	if(lastLine.startsWith('ACK ')) {
		this[currPromiseSymbol].reject(this[dataStrSymbol])
		this[dataStrSymbol] = ''
	} else if(lastLine.startsWith('OK')) {
		this[currPromiseSymbol].resolve(this[dataStrSymbol].substr(0, lastIdxLineBreak-2))
		this[dataStrSymbol] = ''
	}
}

function setupConnection(host, port) {
	console.log('setup connection');
	let conn = connect(host, port)

	this[sockSymbol] = conn.then(c => c.sock)
	this[versionSymbol] = conn.then(c => c.version)
	
	this[sockSymbol].then(sock => sock.once('close', () => this::setupConnection(host, port)))

	this[sockSymbol].then(sock => {
		sock.on('data', d => {
			this[dataArrSymbol].push(d)
		})
	})
}

export default class MpdNetClient {

	constructor(host, port) {
		this[dataArrSymbol] = []
		this[dataStrSymbol] = ''

		this::setupConnection(host, port)

		setInterval(() => {
			while(this[currPromiseSymbol] && this[dataArrSymbol].length) {
				this[dataStrSymbol] += this[dataArrSymbol].shift()
				this::processResponse()
			}
		}, 5)
	}
	async cmd(command) {
		let sock = await this[sockSymbol]
		console.log('got sock')

		if(this[currPromiseSymbol]) {
			await this[currPromiseSymbol].promise
		}

		let promise = new Promise((resolve, reject) => {
			this[currPromiseSymbol] = {resolve, reject, promise}
		})

		console.log('created prom')

		sock.write(`${command}\n`)

		let result = await promise
		console.log('resolved the prom');
		this[currPromiseSymbol] = null

		return result;
	}
	async version() {
		return await this[connectDataSymbol]
		return connectData.version
	}
}