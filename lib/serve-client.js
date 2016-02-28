"use strict"

import KoaSend from 'koa-send'
import KoaRouter from 'koa-router'

export function serveClient() {
	const router = KoaRouter();

	router.get('*', async function(ctx, next) {
		await KoaSend(ctx, `client/dist${ctx.path}`, {
			root: 'client/dist/'
		})
		await next()
	})

	router.get('*', async function(ctx, next) {
		await KoaSend(ctx, 'client/dist/index.html')
	})

	return router.routes()
}

export default serveClient;