import Net from 'net'
import Promise from 'bluebird'

async function connect(host, port) {
	let sock = new Socket(Net.connect({host, port}))
	await sock.ready;
	let firstData = await sock.read()
	if(!firstData.startsWith('OK MPD')) {
		return Promise.reject(`No OK MPD but ${firstData}`)
	}

	return sock;
}

function endsWithOKorACK(str) {
	


}

export async function cmd(host, port, cmd) {
	let sock = await connect(host, port)

	sock.send(cmd)

	let str = ''
	while(true) {
		str += await sock.read()
		let lastIdx = str.length-1

		while(str[lastIdx] === '\n') {
			lastIdx--
		}
		console.log(lastIdx)
		let lstLineIdx = str.substr(0, lastIdx+1).lastIndexOf('\n')
		console.log(lstLineIdx)

		let lastLine = str.substr(lstLineIdx+1)

		if(lastLine.startsWith('OK')) {
			console.log('done ok')
			return str.substr(0, lstLineIdx)
		} else if(lastLine.startsWith('ACK')) {
			console.log('done ack')
			throw str
		} else {
			console.log('not yet done', lastLine)
		}
	}
}

export async function subscribe(host, port, fn) {
	while(true) {
		console.log('subscribe...')
		let changed = await cmd(host, port, 'idle')
		console.log('changed...', changed)
		fn(changed)
	}
}

class Socket {
	constructor(sock) {
		console.log('create socket')
		this.sock = sock
		sock.setEncoding('utf8')
		this.data = []
		sock.on('data', data => {
			console.log('data')
			data = data.toString()
			if(this.promise) {
				this.promise.resolve(data)
			} else {
				this.data.push({data})
			}
		});
		sock.on('error', error => {
			console.log('error')
			if(this.promise) {
				this.promise.reject(error)
			} else {
				this.data.push({error})
			}
		})

		this.ready = new Promise((resolve, reject) => {
			sock.once('error', reject);
			sock.once('error', () => sock.removeListener('connect', resolve))
			sock.once('connect', resolve);
			sock.once('connect', () => sock.removeListener('error', reject))
		})
		sock.once('error', err => this.ready = Promise.reject(err))
	}
	async read() {
		if(this.data.length) {
			let {data, error} = this.data.shift()
			if(error) {
				return Promise.reject(error)
			} else {
				return Promise.resolve(data)
			}
		} else {
			return new Promise((resolve, reject) => {
				this.promise = {resolve, reject}
			})
		}
	}
	send(data) {
		console.log('send data')
		this.sock.write(`${data}\n`);
	}
}
