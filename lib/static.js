"use strict"

import Koa from 'koa'
import KoaConvert from 'koa-convert'
import KoaBetterBody from 'koa-better-body'
import KoaRouter from 'koa-router'
import KoaSend from 'koa-send'

export function start(...middleware) {
	const app = new Koa();
	app.use(KoaConvert(KoaBetterBody()));

	middleware.forEach(m => app.use(m))

	app.use(async function(ctx, next) {
		await KoaSend(ctx, `client/dist${ctx.path}`, {
			root: 'client/dist/'
		})
		await next()
	})

	app.use(async function(ctx, next) {
		console.log('lol')
		await KoaSend(ctx, 'client/dist/index.html')
	})

	const port = process.env.PORT || 5000
	app.listen(port)
	console.log(`listening on  ${port}`)
}

export default start;