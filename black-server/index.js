import http from 'http'
import Koa from 'koa'
import KoaConvert from 'koa-convert'
import KoaBetterBody from 'koa-better-body'
import KoaRouter from 'koa-router'
import KoaSend from 'koa-send'
import socketIO from 'socket.io'

import {subscribe} from './mpd'

export default function run() {
	console.log('Start Koa...');

	const app = new Koa()
	const server = new http.Server(app.callback());
	const router = new KoaRouter()
	const io = socketIO(server);

	router.use(KoaConvert(KoaBetterBody()))

	io.on('connection', function(socket){
		console.log('a user connected');
	  	subscribe('labblaster', 6600).then(data => {
			console.log('subscribe ok');
		}, err => {
			console.log('subscribe error', err);
		});
	});

	// router.post('/cmd', async function(ctx, next) {
	// 	let data = await read(ctx.req)
	// 	console.log(data)
	// 	ctx.body = "OK";
	// 	// console.log(ctx.body)
	// 	// ctx.body = data
	// })

	router.get('*', async function(ctx, next) {
		await KoaSend(ctx, `client/dist${ctx.path}`, {
			root: 'client/dist/'
		})
		await next()
	})

	router.get('*', async function(ctx, next) {
		await KoaSend(ctx, 'client/dist/index.html')
	})

	app.use(router.routes())

	const port = process.env.PORT || 80
	server.listen(port)
	console.log(`listening on  ${port}`)
}

async function read(stream) {
	return new Promise((resolve, reject) => {
		let chunks = []
		stream.setEncoding('utf8')
		stream.on('data', (chunk)  => {
			console.log('read chunk')

			chunks.push(chunk)
		}) 
		stream.on('end', () => {
			console.log('read done')

			resolve(chunks.join(''))
		})
		stream.on('error', () => {
			reject()
		})
	})
}