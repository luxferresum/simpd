"use strict"

import "babel-polyfill"

import Koa from 'koa'
import KoaConvert from 'koa-convert'
import KoaBetterBody from 'koa-better-body'
import KoaRouter from 'koa-router'

// import Mpd from './lib/Mpd.js'
import MpdNetClient from './lib/MpdNetClient.js'
import {serveClient} from './lib/serve-client.js'
import {mpdService} from './lib/mpd-service.js'

async function read(stream) {
	return new Promise((resolve, reject) => {
		let chunks = []
		stream.setEncoding('utf8')
		stream.on('data', (chunk)  => {
			console.log('read chunk');
			chunks.push(chunk)
		})
		stream.on('end', () => {
			console.log('read done');
			resolve(chunks.join(''))
		})
		stream.on('error', () => {
			reject()
		})
	})
}

async function run() {
	const app = new Koa();
	const mpd = new MpdNetClient('labblaster', 6600);
	const router = new KoaRouter();

	router.use(KoaConvert(KoaBetterBody()));

	// services
	// router.use('/mpd-service', mpdService(mpd))
	router.post('/cmd', async function(ctx, next) {
		let data = await read(ctx.req)
		// console.log(ctx.request.body)
		console.log(data)
		ctx.body = await mpd.cmd(data)
		console.log(ctx.body)
		// ctx.body = data
	})

	// must be last because it wont next()
	router.use(serveClient())

	app.use(router.routes())

	const port = process.env.PORT || 5000
	app.listen(port)
	console.log(`listening on  ${port}`)

	// 

	// try {
	// 	//let curr = await mpd.lsinfo('00_music/autosort')

	// 	let t = await mpd.test();

	// 	console.log("======DEBUG OK:=====");

	// 	console.log(t);
	// } catch (e) {
	// 	console.log("======DEBUG ERROR:=====");
	// 	console.log(e);
	// }
}

run()